import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, initialCheckDone } = useAuth();
  const location = useLocation();

  if (!initialCheckDone) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFBF0]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-[#FF8C00]/30 border-t-[#FF8C00] rounded-full animate-spin"></div>
          <p className="text-[#0B132B]/50 animate-pulse text-sm font-light">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  // Check if user is logged in AND has admin role
  if (!user || user.role !== 'admin') {
    console.warn("Access denied: User is not an admin", user);
    if (user) {
      alert("Access Denied: Administrative privileges required.");
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
