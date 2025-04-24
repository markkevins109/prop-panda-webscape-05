
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfileSetup() {
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    organization: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }
    };
    
    checkAuthAndProfile();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Not authenticated");
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          phone: profileData.phoneNumber,
          organization: profileData.organization,
          is_profile_complete: true
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success("Profile setup complete!");
      navigate("/");
    } catch (error) {
      console.error("Profile setup error:", error);
      toast.error("Failed to complete profile setup");
    }
  };

  return (
    <div className="container-custom py-20 flex justify-center items-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName">First Name</label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName">Last Name</label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="phoneNumber">Phone Number</label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={profileData.phoneNumber}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="organization">Organization</label>
              <Input
                id="organization"
                name="organization"
                value={profileData.organization}
                onChange={handleInputChange}
              />
            </div>

            <Button type="submit" className="w-full">
              Complete Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
