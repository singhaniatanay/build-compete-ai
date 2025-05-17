
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // Show loading indicator while checking authentication status
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we check your authentication.</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login page
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // If authenticated, render the protected content
  return <Outlet />;
};
