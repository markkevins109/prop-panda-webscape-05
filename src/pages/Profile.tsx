
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/profile/ImageUpload";
import { CircleUser } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileData {
  name: string;
  email: string;
  avatar_url: string | null;
  phone: string | null;
  organization: string | null;
  bio: string | null;
  location: string | null;
}

export default function Profile() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const [userData, setUserData] = useState<ProfileData>({
    name: "",
    email: "",
    avatar_url: null,
    phone: null,
    organization: null,
    bio: null,
    location: null
  });

  useEffect(() => {
    const checkAuthAndProfile = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // Only redirect if we're on the actual profile page, not during setup
          if (window.location.pathname === "/profile") {
            navigate("/auth");
          }
          setIsLoading(false);
          return;
        }

        setIsAuthenticated(true);

        // Check if we're on the setup page
        if (window.location.pathname === "/profile/setup") {
          setIsLoading(false);
          return; // Don't continue with profile loading if we're on setup
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching profile:", error);
          toast.error("Failed to load profile");
          setIsLoading(false);
          return;
        }

        if (!profile) {
          navigate("/profile/setup");
          return;
        }

        if (!profile.is_profile_complete) {
          navigate("/profile/setup");
          return;
        }

        setIsProfileComplete(true);

        let avatarUrl = null;
        if (profile.avatar_url) {
          try {
            const { data: avatarData } = await supabase.storage
              .from('avatars')
              .createSignedUrl(profile.avatar_url, 3600);

            if (avatarData) {
              avatarUrl = avatarData.signedUrl;
            }
          } catch (avatarError) {
            console.error("Error fetching avatar:", avatarError);
          }
        }

        // Using optional chaining for user_metadata to prevent errors
        // The name comes from user metadata, not from the profile table
        const displayName = session.user.user_metadata?.name || "User";

        setUserData({
          name: displayName,
          email: session.user.email || "",
          avatar_url: avatarUrl,
          phone: profile.phone || "",
          organization: profile.organization || "",
          bio: profile.bio || "",
          location: profile.location || ""
        });
      } catch (err) {
        console.error("Error in profile check:", err);
        toast.error("An error occurred while loading your profile");
      } finally {
        setIsLoading(false);
      }
    };
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAuthAndProfile();
    });
    
    checkAuthAndProfile();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Not authenticated");
        return;
      }

      let avatarUrl = userData.avatar_url;
      if (avatarFile) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(`${user.id}/${Date.now()}.png`, avatarFile);

        if (uploadError) throw uploadError;
        avatarUrl = uploadData.path;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ 
          bio: userData.bio,
          location: userData.location,
          avatar_url: avatarUrl ? avatarUrl.split('?')[0] : null // Remove query params from URL
        })
        .eq('id', user.id);

      if (error) throw error;

      setIsEditing(false);
      toast.success("Profile updated successfully");
      
      // Refresh the profile data after update
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profile) {
        let newAvatarUrl = null;
        if (profile.avatar_url) {
          const { data: avatarData } = await supabase.storage
            .from('avatars')
            .createSignedUrl(profile.avatar_url, 3600);

          if (avatarData) {
            newAvatarUrl = avatarData.signedUrl;
          }
        }

        setUserData(prev => ({
          ...prev,
          avatar_url: newAvatarUrl
        }));
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    const checkAuthAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (profile) {
          let avatarUrl = null;
          if (profile.avatar_url) {
            try {
              const { data: avatarData } = await supabase.storage
                .from('avatars')
                .createSignedUrl(profile.avatar_url, 3600);

              if (avatarData) {
                avatarUrl = avatarData.signedUrl;
              }
            } catch (err) {
              console.error("Error fetching avatar:", err);
            }
          }

          setUserData({
            ...userData,
            avatar_url: avatarUrl,
            phone: profile.phone || "",
            organization: profile.organization || "",
            bio: profile.bio || "",
            location: profile.location || ""
          });
        }
      }
    };
    
    checkAuthAndProfile();
  };

  if (isLoading) {
    return (
      <div className="container-custom py-20">
        <div className="max-w-2xl mx-auto text-center">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  // Only show message if we're on profile page (not setup)
  if (window.location.pathname === "/profile" && (!isAuthenticated || !isProfileComplete)) {
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
              {isEditing ? (
                <ImageUpload 
                  onChange={(file) => setAvatarFile(file)}
                  imageUrl={userData.avatar_url || undefined}
                />
              ) : (
                <div className="relative">
                  <Avatar className="h-24 w-24 border-2 border-[#28A745]">
                    {userData.avatar_url ? (
                      <AvatarImage src={userData.avatar_url} alt="User profile" />
                    ) : null}
                    <AvatarFallback>
                      <CircleUser className="h-12 w-12" />
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
              
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

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  value={userData.phone || ""} 
                  disabled={true}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input 
                  id="organization" 
                  value={userData.organization || ""} 
                  disabled={true}
                />
              </div>

              {isEditing && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input 
                      id="bio" 
                      value={userData.bio || ""} 
                      onChange={(e) => setUserData({...userData, bio: e.target.value})} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Preferred Location</Label>
                    <Input 
                      id="location" 
                      value={userData.location || ""}
                      onChange={(e) => setUserData({...userData, location: e.target.value})} 
                    />
                  </div>
                </>
              )}
            </div>
          </CardContent>
          
          {isEditing && (
            <CardFooter className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveChanges}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
