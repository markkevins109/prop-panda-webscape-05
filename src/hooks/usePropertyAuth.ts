
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { generateUUID } from "@/utils/uuid";

export function usePropertyAuth() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function getUserId() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log("Authenticated user ID:", session.user.id);
          setUserId(session.user.id);
        } else {
          const demoAuth = localStorage.getItem("prop-panda-demo-auth");
          if (demoAuth === "authenticated") {
            // For demo users, generate a UUID if one doesn't exist
            let demoUserId = localStorage.getItem("prop-panda-demo-user-id");
            if (!demoUserId) {
              demoUserId = generateUUID();
              localStorage.setItem("prop-panda-demo-user-id", demoUserId);
            }
            console.log("Demo user ID:", demoUserId);
            setUserId(demoUserId);
          } else {
            console.log("No authentication found, redirecting to login");
            toast.error("Please sign in to add properties");
            navigate("/auth");
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        toast.error("Authentication error occurred");
      } finally {
        setIsLoading(false);
      }
    }
    
    getUserId();
  }, [navigate]);

  return { userId, isLoading };
}
