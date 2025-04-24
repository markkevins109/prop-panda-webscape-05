
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleUser, Upload } from "lucide-react";

export default function Profile() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const navigate = useNavigate();

  // Demo user data - would come from your database in a real app
  const [userData, setUserData] = useState({
    name: "Demo User",
    email: "user@example.com",
    avatar: "",
  });

  useEffect(() => {
    const checkAuthAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setIsAuthenticated(true);

      // Fetch profile to check completion status
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_profile_complete')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
        return;
      }

      // If profile is not complete, redirect to setup
      if (!profile?.is_profile_complete) {
        navigate("/profile/setup");
        return;
      }

      setIsProfileComplete(true);
    };
    
    checkAuthAndProfile();
  }, [navigate]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // File size validation (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("Please select an image under 2MB");
        return;
      }
      
      // Create a URL for the image to display it
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          // Fixed: Ensuring the avatar is always a string
          setUserData(prev => ({
            ...prev,
            avatar: reader.result as string
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Not authenticated");
        return;
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_profile_complete: true 
        })
        .eq('id', user.id);

      if (error) throw error;

      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset any unsaved changes
  };

  if (!isAuthenticated || !isProfileComplete) {
    return null;
  }

  return (
    <div className="container-custom py-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Manage your personal details and account preferences
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-24 w-24 border-2 border-[#28A745]">
                  {userData.avatar ? (
                    <AvatarImage src={userData.avatar} alt="User profile" />
                  ) : null}
                  <AvatarFallback>
                    <CircleUser className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                
                {isEditing && (
                  <label 
                    htmlFor="avatar-upload" 
                    className="absolute bottom-0 right-0 bg-accent-blue text-white p-1 rounded-full cursor-pointer hover:bg-accent-blue/90"
                  >
                    <Upload className="h-4 w-4" />
                    <input 
                      id="avatar-upload" 
                      type="file" 
                      className="hidden" 
                      accept="image/png,image/jpeg" 
                      onChange={handleAvatarChange}
                    />
                  </label>
                )}
              </div>
              
              {!isEditing && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={userData.name} 
                  onChange={(e) => setUserData({...userData, name: e.target.value})} 
                  disabled={!isEditing} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={userData.email} 
                  disabled 
                />
              </div>
            </div>
          </CardContent>
          
          {isEditing && (
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSaveChanges}>
                Save Changes
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
