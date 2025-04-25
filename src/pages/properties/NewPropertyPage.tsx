
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PropertyForm from "@/components/properties/PropertyForm";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export default function NewPropertyPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Also check for demo auth
      const demoAuth = localStorage.getItem("prop-panda-demo-auth");
      
      if (session || demoAuth === "authenticated") {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        toast.error("Please sign in to add properties");
        navigate('/auth');
      }
    };
    
    checkAuth();
  }, [navigate]);

  if (isAuthenticated === null) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New Property</CardTitle>
        </CardHeader>
        <CardContent>
          <PropertyForm onSuccess={() => navigate('/properties')} />
        </CardContent>
      </Card>
    </div>
  );
}
