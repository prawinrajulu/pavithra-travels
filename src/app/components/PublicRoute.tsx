import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, initialCheckDone } = useAuth();

  // If we are still doing the initial check, show nothing or a spinner
  if (!initialCheckDone) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-blue-500/30 border-t-amber-500 rounded-full animate-spin"></div>
          <p className="text-white/50 animate-pulse text-sm font-light">Loading...</p>
        </div>
      </div>
    );
  }

  // If already authenticated, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
