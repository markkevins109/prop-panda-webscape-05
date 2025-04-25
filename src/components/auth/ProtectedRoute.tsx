
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = "/login",
}) => {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return <div className="container-custom py-20 flex items-center justify-center">Loading...</div>;
  }

  // If user is not authenticated, redirect to login page
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // If user is authenticated, render the protected content
  return <>{children}</>;
};
