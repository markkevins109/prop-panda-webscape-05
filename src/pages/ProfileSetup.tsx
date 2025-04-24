
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/profile/ImageUpload";

interface ProfileFormData {
  phone: string;
  organization: string;
  bio: string;
  location: string;
}

export default function ProfileSetup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setAuthChecking(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // For demo purposes, check if there's a demo auth in localStorage
          const demoAuth = localStorage.getItem("prop-panda-demo-auth");
          if (demoAuth === "authenticated") {
            setIsAuthenticated(true);
          } else {
            navigate("/auth");
          }
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        toast.error("Failed to verify authentication");
      } finally {
        setAuthChecking(false);
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (!session) {
        // Check for demo auth
        const demoAuth = localStorage.getItem("prop-panda-demo-auth");
        setIsAuthenticated(demoAuth === "authenticated");
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      let userId = null;
      
      if (session) {
        userId = session.user.id;
      } else {
        // For demo purposes
        const demoAuth = localStorage.getItem("prop-panda-demo-auth");
        if (demoAuth === "authenticated") {
          // Generate a demo user ID for local storage only
          userId = "demo-user-" + Date.now();
          // Store profile data in localStorage for demo purposes
          localStorage.setItem("prop-panda-demo-profile", JSON.stringify({
            ...data,
            id: userId
          }));
          
          toast.success("Profile updated successfully (Demo Mode)");
          navigate("/profile");
          return;
        } else {
          toast.error("Not authenticated");
          navigate("/auth");
          return;
        }
      }

      let avatarUrl = null;
      if (avatarFile) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(`${userId}/${Date.now()}.png`, avatarFile);

        if (uploadError) throw uploadError;
        avatarUrl = uploadData.path;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          phone: data.phone,
          organization: data.organization,
          bio: data.bio,
          location: data.location,
          avatar_url: avatarUrl,
          is_profile_complete: true,
        })
        .eq("id", userId);

      if (updateError) throw updateError;

      toast.success("Profile updated successfully");
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const validatePhone = (value: string) => {
    const phoneRegex = /^\+65[6-9]\d{7}$/;
    return phoneRegex.test(value) || "Please enter a valid Singapore phone number (+658XXXXXXX)";
  };

  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Checking authentication status...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/placeholder.svg')] bg-cover bg-center bg-no-repeat py-20">
      <div className="container-custom max-w-2xl">
        <Card className="border-[#28A745] shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Let's get started!</CardTitle>
            <CardDescription>
              Complete your profile to unlock Prop Panda's features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex justify-center">
                <ImageUpload
                  onChange={(file) => setAvatarFile(file)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+6581234567"
                  {...register("phone", {
                    required: "Phone number is required",
                    validate: validatePhone
                  })}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  placeholder="Enter your organization (if applicable)"
                  {...register("organization", { required: "Organization is required" })}
                />
                {errors.organization && (
                  <p className="text-sm text-red-500">{errors.organization.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio (Optional)</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself"
                  maxLength={200}
                  {...register("bio")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Preferred Location (Optional)</Label>
                <Select
                  onValueChange={(value) => register("location").onChange({ target: { value } })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your preferred location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Central">Central</SelectItem>
                    <SelectItem value="North">North</SelectItem>
                    <SelectItem value="East">East</SelectItem>
                    <SelectItem value="West">West</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#28A745] hover:bg-[#28A745]/90"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save and Continue"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
