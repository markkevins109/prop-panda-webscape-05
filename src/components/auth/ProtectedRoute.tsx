
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
  const [isNewUser, setIsNewUser] = useState(false);
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
        
        // Check if this is a new user that needs to complete their profile
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("created_at, is_profile_complete")
          .eq("id", session.user.id)
          .single();
        
        if (error) {
          console.error("Error fetching profile:", error);
          toast.error("Failed to verify profile status");
          setIsNewUser(false);
        } else {
          // Check if user was created in the last minute (new signup)
          const isJustCreated = profile?.created_at && 
            (new Date().getTime() - new Date(profile.created_at).getTime()) < 60000;
          
          // Only redirect to profile setup if user just signed up and hasn't completed profile
          setIsNewUser(isJustCreated && !profile?.is_profile_complete);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        setIsNewUser(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndProfile();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsAuthenticated(!!session);
      
      if (session && event === 'SIGNED_IN') {
        const { data: profile } = await supabase
          .from("profiles")
          .select("created_at, is_profile_complete")
          .eq("id", session.user.id)
          .single();
          
        // Check if user was created in the last minute (new signup)
        const isJustCreated = profile?.created_at && 
          (new Date().getTime() - new Date(profile.created_at).getTime()) < 60000;
        
        // Only set as new user if just created and profile not complete
        setIsNewUser(isJustCreated && !profile?.is_profile_complete);
      } else {
        setIsNewUser(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Only redirect to profile setup if user just signed up
  if (isNewUser && location.pathname !== "/profile/setup") {
    return <Navigate to="/profile/setup" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
