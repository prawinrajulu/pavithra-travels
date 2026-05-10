import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut,
  getIdToken
} from 'firebase/auth';
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

  // Synchronize Firebase Auth state with our internal User state
  const syncUser = async (firebaseUser: any) => {
    console.log("Auth synchronization started for:", firebaseUser?.email || "No User");
    
    if (!firebaseUser) {
      setUser(null);
      apiClient.setToken(null);
      setLoading(false);
      setInitialCheckDone(true);
      console.log("Auth state: Logged Out");
      return null;
    }

    try {
      const token = await getIdToken(firebaseUser);
      apiClient.setToken(token);

      const basicUser: User = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || '',
        email: firebaseUser.email || '',
      };
      
      setUser(prev => {
        if (prev && prev.id === firebaseUser.uid && (prev.phone || prev.role)) {
          return prev;
        }
        return basicUser;
      });
      
      setLoading(false);
      setInitialCheckDone(true);
      console.log("Auth state: Logged In (Basic Info)");

      // Fetch extended profile - await it to ensure role is available for redirection
      try {
        const response = await apiClient.getUserProfile();
        if (response.success && response.profile) {
          console.log("Auth state: Profile synchronized from backend");
          if (response.profile.phone) {
            localStorage.setItem('userPhone', response.profile.phone);
          }
          const fullUser = {
            id: response.profile.id,
            name: response.profile.displayName || response.profile.name,
            email: response.profile.email,
            phone: response.profile.phone,
            role: response.profile.role
          };
          setUser(fullUser);
          setLoading(false);
          setInitialCheckDone(true);
          return fullUser; // Return the full user for immediate use in login page
        }
      } catch (err) {
        console.warn("Extended profile fetch failed, continuing with basic info", err);
      }

      setLoading(false);
      setInitialCheckDone(true);
      return basicUser;
    } catch (error) {
      console.error("Auth synchronization failed critical error:", error);
      setUser(null);
      setLoading(false);
      setInitialCheckDone(true);
      return null;
    }
  };

  useEffect(() => {
    console.log("Initializing AuthContext listener...");
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      syncUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting login for:", email);
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Firebase login successful!");
      return await syncUser(userCredential.user) || null;
    } catch (error: any) {
      console.error("Login process failed:", error);
      setLoading(false);
      throw error;
    }
  };

  const signup = async (userData: { name: string; email: string; phone: string; password: string }) => {
    try {
      console.log("Signup started for:", userData.email);
      setLoading(true);
      
      const response = await apiClient.register(
        userData.email,
        userData.password,
        userData.name,
        userData.phone
      );

      if (response.success) {
        console.log("Backend registration successful. Attempting Firebase sign-in...");
        
        // Sometimes and Firebase propagation can take a split second
        // We'll try to sign in, with a small retry if it fails immediately
        let userCredential;
        const maxRetries = 3;
        for (let i = 0; i < maxRetries; i++) {
          try {
            userCredential = await signInWithEmailAndPassword(auth, userData.email, userData.password);
            break; // Success!
          } catch (retryErr) {
            console.warn(`Sign-in attempt ${i + 1} failed, retrying in 500ms...`);
            if (i === maxRetries - 1) throw retryErr;
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
        
        if (userCredential) {
          console.log("Firebase sign-in successful after signup!");
          return await syncUser(userCredential.user) || null;
        }
        return null;
      } else {
        throw new Error(response.message || 'Signup failed at backend');
      }
    } catch (error: any) {
      console.error("Critical Signup failure:", error);
      setLoading(false);
      throw error;
    }
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
