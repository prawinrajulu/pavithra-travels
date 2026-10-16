import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signInWithCustomToken,
  signOut,
  getIdToken
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { apiClient } from '../../services/apiClient';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: 'user' | 'admin' | 'super_admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  initialCheckDone: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  signup: (userData: { name: string; email: string; phone: string; password: string }) => Promise<User | null>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // In-flight sync deduplication & cache refs
  const inFlightSyncRef = useRef<Promise<User | null> | null>(null);
  const userRef = useRef<User | null>(null);
  userRef.current = user;

  // Synchronize Firebase Auth state with our internal User state
  const syncUser = async (firebaseUser: FirebaseUser | null, preloadedProfile?: any): Promise<User | null> => {
    if (!firebaseUser) {
      console.log("Auth state: Logged Out");
      setUser(null);
      apiClient.setToken(null);
      setLoading(false);
      setInitialCheckDone(true);
      return null;
    }

    // If an identical user is already fully synced with a role, return existing user
    if (userRef.current && userRef.current.id === firebaseUser.uid && userRef.current.role && !preloadedProfile) {
      setLoading(false);
      setInitialCheckDone(true);
      return userRef.current;
    }

    // Deduplicate concurrent sync operations (e.g. onAuthStateChanged + direct caller)
    if (inFlightSyncRef.current) {
      return inFlightSyncRef.current;
    }

    const syncPromise = (async () => {
      try {
        console.log("Auth synchronization started for:", firebaseUser.email || firebaseUser.uid);
        const token = await getIdToken(firebaseUser);
        apiClient.setToken(token);

        // Fast-path: use preloaded profile if available (e.g. from registration response)
        if (preloadedProfile) {
          const fastUser: User = {
            id: firebaseUser.uid,
            name: preloadedProfile.displayName || preloadedProfile.name || firebaseUser.displayName || '',
            email: firebaseUser.email || preloadedProfile.email || '',
            phone: preloadedProfile.phone,
            role: preloadedProfile.role || 'user'
          };
          if (fastUser.phone) {
            localStorage.setItem('userPhone', fastUser.phone);
          }
          setUser(fastUser);
          setLoading(false);
          setInitialCheckDone(true);
          console.log("Auth state: Profile synchronized via preloaded data");
          return fastUser;
        }

        // Standard path: fetch extended profile from backend
        let fullUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || '',
          email: firebaseUser.email || '',
        };

        try {
          const response = await apiClient.getUserProfile();
          if (response?.success && response.profile) {
            if (response.profile.phone) {
              localStorage.setItem('userPhone', response.profile.phone);
            }
            fullUser = {
              id: response.profile.id || firebaseUser.uid,
              name: response.profile.displayName || response.profile.name || firebaseUser.displayName || '',
              email: response.profile.email || firebaseUser.email || '',
              phone: response.profile.phone,
              role: response.profile.role || 'user'
            };
            console.log("Auth state: Profile synchronized from backend");
          }
        } catch (err) {
          console.warn("Extended profile fetch failed, continuing with basic credentials", err);
        }

        setUser(fullUser);
        setLoading(false);
        setInitialCheckDone(true);
        return fullUser;
      } catch (error) {
        console.error("Auth synchronization critical error:", error);
        setUser(null);
        setLoading(false);
        setInitialCheckDone(true);
        return null;
      } finally {
        inFlightSyncRef.current = null;
      }
    })();

    inFlightSyncRef.current = syncPromise;
    return syncPromise;
  };

  useEffect(() => {
    console.log("Initializing AuthContext listener...");
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      syncUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  // In-flight deduplication refs to avoid duplicate calls from repeated submissions
  const inFlightLoginRef = useRef<Promise<User | null> | null>(null);
  const inFlightSignupRef = useRef<Promise<User | null> | null>(null);

  const login = async (email: string, password: string): Promise<User | null> => {
    // Prevent duplicate login requests caused by rapid repeated submissions
    if (inFlightLoginRef.current) {
      console.log("Login already in progress, deduplicating request...");
      return inFlightLoginRef.current;
    }

    const cleanEmail = (email || '').trim();
    const cleanPassword = password || '';

    if (!cleanEmail || !cleanPassword) {
      const validationError: any = new Error('Please enter both email and password.');
      validationError.code = 'auth/invalid-email';
      throw validationError;
    }

    const loginPromise = (async () => {
      try {
        console.log("Attempting Firebase login for:", cleanEmail);
        setLoading(true);

        let userCredential;
        try {
          userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
        } catch (initialError: any) {
          // Bounded retry ONLY for confirmed transient network failures
          // Never retry permanent credential errors (e.g., auth/invalid-credential, auth/user-not-found)
          if (initialError?.code === 'auth/network-request-failed') {
            console.warn("Transient network failure during Firebase login. Performing single bounded retry...");
            await new Promise((resolve) => setTimeout(resolve, 600));
            try {
              userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
              console.log("Bounded retry succeeded!");
            } catch (retryError) {
              // Retry failed; rethrow the network failure
              throw retryError;
            }
          } else {
            // Permanent error, rethrow immediately without retrying
            throw initialError;
          }
        }

        console.log("Firebase login successful!");
        return await syncUser(userCredential.user);
      } catch (error: any) {
        console.error("Login process failed:", error);
        // Prevent stale authentication state after failed login attempts
        setUser(null);
        apiClient.setToken(null);
        throw error;
      } finally {
        setLoading(false);
        inFlightLoginRef.current = null;
      }
    })();

    inFlightLoginRef.current = loginPromise;
    return loginPromise;
  };

  const signup = async (userData: { name: string; email: string; phone: string; password: string }): Promise<User | null> => {
    // Prevent duplicate signup requests caused by rapid repeated submissions
    if (inFlightSignupRef.current) {
      console.log("Signup already in progress, deduplicating request...");
      return inFlightSignupRef.current;
    }

    const cleanName = (userData.name || '').trim();
    const cleanEmail = (userData.email || '').trim();
    const cleanPhone = (userData.phone || '').trim();
    const cleanPassword = userData.password || '';

    if (!cleanName || !cleanEmail || !cleanPassword) {
      const validationError: any = new Error('Please fill in all required fields.');
      validationError.code = 'auth/invalid-input';
      throw validationError;
    }

    const signupPromise = (async () => {
      try {
        console.log("Signup started for:", cleanEmail);
        setLoading(true);
        
        const response = await apiClient.register(
          cleanEmail,
          cleanPassword,
          cleanName,
          cleanPhone
        );

        if (response.success) {
          console.log("Backend registration successful.");
          let userCredential;

          // Priority 1: Instant cryptographic sign-in via customToken (eliminates propagation delay & retries)
          if (response.customToken) {
            console.log("Signing in with Firebase customToken (zero replication latency)...");
            userCredential = await signInWithCustomToken(auth, response.customToken);
          } else {
            // Fallback if customToken wasn't returned, with single bounded retry for transient network glitches
            console.log("Falling back to password sign-in...");
            try {
              userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
            } catch (initialErr: any) {
              if (initialErr?.code === 'auth/network-request-failed') {
                console.warn("Transient network error during signup sign-in, retrying once...");
                await new Promise((r) => setTimeout(r, 600));
                userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
              } else {
                throw initialErr;
              }
            }
          }
          
          if (userCredential) {
            console.log("Firebase authentication established! Synchronizing session...");
            return await syncUser(userCredential.user, response.user);
          }
          return null;
        } else {
          throw new Error(response.message || 'Signup failed at backend');
        }
      } catch (error: any) {
        console.error("Critical Signup failure:", error);
        // Prevent stale authentication state
        setUser(null);
        apiClient.setToken(null);
        throw error;
      } finally {
        setLoading(false);
        inFlightSignupRef.current = null;
      }
    })();

    inFlightSignupRef.current = signupPromise;
    return signupPromise;
  };

  const logout = async () => {
    try {
      console.log("Logging out...");
      await signOut(auth);
      setUser(null);
      apiClient.setToken(null);
      setLoading(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      initialCheckDone,
      login,
      signup,
      logout,
      isAuthenticated: !!user
    }}>
      {initialCheckDone ? children : (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-white/50 animate-pulse text-sm font-light">Loading Pavithra Travels...</p>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
