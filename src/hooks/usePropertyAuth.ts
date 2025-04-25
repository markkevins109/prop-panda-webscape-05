
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
          setUserId(session.user.id);
        } else {
          const demoAuth = localStorage.getItem("prop-panda-demo-auth");
          if (demoAuth === "authenticated") {
            const demoUuid = generateUUID();
            setUserId(demoUuid);
          } else {
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
