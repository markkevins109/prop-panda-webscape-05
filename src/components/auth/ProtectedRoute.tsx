
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuthAndProfile = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        
        setIsAuthenticated(true);
        
        // Check if profile is complete
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("is_profile_complete")
          .eq("id", session.user.id)
          .single();
        
        if (error) {
          console.error("Error fetching profile:", error);
          toast.error("Failed to verify profile status");
          setIsProfileComplete(false);
        } else {
          setIsProfileComplete(profile?.is_profile_complete || false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        setIsProfileComplete(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndProfile();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsAuthenticated(!!session);
      
      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_profile_complete")
          .eq("id", session.user.id)
          .single();
          
        setIsProfileComplete(profile?.is_profile_complete || false);
      } else {
        setIsProfileComplete(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    // You might want to add a loading spinner here
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!isProfileComplete && location.pathname !== "/profile/setup") {
    return <Navigate to="/profile/setup" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
