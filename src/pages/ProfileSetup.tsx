
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
import { Phone, Building, MapPin, User } from "lucide-react";

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
  const [initialData, setInitialData] = useState<ProfileFormData | null>(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileFormData>();
  
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
            // Load demo profile data if it exists
            const demoProfileStr = localStorage.getItem("prop-panda-demo-profile");
            if (demoProfileStr) {
              const demoProfile = JSON.parse(demoProfileStr);
              setInitialData(demoProfile);
              Object.entries(demoProfile).forEach(([key, value]) => {
                setValue(key as keyof ProfileFormData, value as string);
              });
            }
          } else {
            navigate("/auth");
          }
        } else {
          setIsAuthenticated(true);
          // Fetch existing profile data
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (profile) {
            const formData = {
              phone: profile.phone || '',
              organization: profile.organization || '',
              bio: profile.bio || '',
              location: profile.location || ''
            };
            setInitialData(formData);
            Object.entries(formData).forEach(([key, value]) => {
              setValue(key as keyof ProfileFormData, value as string);
            });
          }
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
  }, [navigate, setValue]);

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
          avatar_url: avatarUrl || undefined,
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-50">
        <div className="animate-pulse text-accent-blue font-medium">
          Checking authentication status...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 py-12 px-4">
      <div className="container max-w-3xl mx-auto">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-accent-blue/10 to-blue-400/20 rounded-bl-full -z-10"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-accent-blue/10 to-blue-400/20 rounded-tr-full -z-10"></div>
          
          <CardHeader className="text-center pb-6 border-b">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-accent-blue to-blue-600 bg-clip-text text-transparent">
              Let's get started!
            </CardTitle>
            <CardDescription className="text-base">
              Complete your profile to unlock Prop Panda's features
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-accent-blue to-blue-500 rounded-full blur"></div>
                  <div className="relative">
                    <ImageUpload onChange={(file) => setAvatarFile(file)} />
                    <p className="text-center text-sm text-muted-foreground mt-2">
                      Click to upload profile picture
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-accent-blue" /> Phone Number
                  </Label>
                  <Input
                    id="phone"
                    placeholder="+6581234567"
                    className="border-blue-100 focus:border-accent-blue bg-white"
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
                  <Label htmlFor="organization" className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-accent-blue" /> Organization
                  </Label>
                  <Input
                    id="organization"
                    placeholder="Enter your organization"
                    className="border-blue-100 focus:border-accent-blue bg-white"
                    {...register("organization", { required: "Organization is required" })}
                  />
                  {errors.organization && (
                    <p className="text-sm text-red-500">{errors.organization.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-accent-blue" /> Bio (Optional)
                </Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself"
                  maxLength={200}
                  className="resize-none border-blue-100 focus:border-accent-blue bg-white h-24"
                  {...register("bio")}
                />
                <p className="text-xs text-muted-foreground text-right">Max 200 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent-blue" /> Preferred Location (Optional)
                </Label>
                <Select
                  onValueChange={(value) => register("location").onChange({ target: { value } })}
                >
                  <SelectTrigger className="border-blue-100 focus:border-accent-blue bg-white">
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
                className="w-full bg-gradient-to-r from-accent-blue to-blue-600 hover:from-accent-blue/90 hover:to-blue-600/90 h-12 transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  "Save and Continue"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
