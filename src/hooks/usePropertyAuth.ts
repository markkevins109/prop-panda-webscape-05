
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
            
            // Check if an agent profile exists for this demo user
            const { data: existingAgent } = await supabase
              .from('agent_profiles')
              .select('id')
              .eq('user_id', demoUserId)
              .single();
            
            if (!existingAgent) {
              // Create an agent profile for the demo user
              const { error: createError } = await supabase
                .from('agent_profiles')
                .insert({
                  id: demoUserId,
                  user_id: demoUserId,
                  name: 'Demo User',
                  email: 'demo@example.com',
                  phone_number: '1234567890',
                  company_name: 'Demo Company',
                  experience: 1,
                  specialization: 'Residential'
                });
              
              if (createError) {
                console.error("Error creating demo agent profile:", createError);
                toast.error("Unable to set up demo profile");
                return;
              }
            }
            
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
