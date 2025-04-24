
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "@/components/ui/sonner";
import { PandaAvatar } from "@/components/PandaAvatar";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp, MapPin, Home, DollarSign, Briefcase, UserRound } from "lucide-react";

// Form schema with validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  age: z.string().refine((val) => !val || !isNaN(parseInt(val)), {
    message: "Age must be a valid number.",
  }),
  occupation: z.string().min(2, { 
    message: "Please provide your occupation." 
  }),
  property_preferences: z.string().optional(),
  investment_goals: z.string().min(10, { 
    message: "Please provide some details about your investment goals." 
  }),
  budget_range: z.string().min(2, { 
    message: "Please provide your budget range." 
  }),
  preferred_locations: z.string().optional(),
});

export default function UserProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [existingData, setExistingData] = useState<any>(null);

  // Initialize form with existing data if available
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: "",
      occupation: "",
      property_preferences: "",
      investment_goals: "",
      budget_range: "",
      preferred_locations: "",
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user.id) {
        setUserId(data.session.user.id);
        fetchUserData(data.session.user.id);
      } else {
        toast.error("Please sign in to update your profile");
        navigate("/auth");
      }
    };
    
    checkAuth();
  }, [navigate]);

  const fetchUserData = async (uid: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_chatbot_data')
        .select('*')
        .eq('user_id', uid)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setExistingData(data);
        // Populate form with existing data
        form.reset({
          name: data.name || "",
          age: data.age ? String(data.age) : "",
          occupation: data.occupation || "",
          property_preferences: data.property_preferences || "",
          investment_goals: data.investment_goals || "",
          budget_range: data.budget_range || "",
          preferred_locations: Array.isArray(data.preferred_locations) 
            ? data.preferred_locations.join(", ") 
            : data.preferred_locations || "",
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load your profile data");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!userId) {
      toast.error("You must be logged in to save your profile");
      navigate("/auth");
      return;
    }

    setLoading(true);
    
    try {
      const formattedData = {
        user_id: userId,
        name: values.name,
        age: values.age ? parseInt(values.age) : null,
        occupation: values.occupation,
        property_preferences: values.property_preferences,
        investment_goals: values.investment_goals,
        budget_range: values.budget_range,
        preferred_locations: values.preferred_locations 
          ? values.preferred_locations.split(',').map(loc => loc.trim())
          : [],
      };

      if (existingData) {
        // Update existing record
        const { error } = await supabase
          .from('user_chatbot_data')
          .update(formattedData)
          .eq('id', existingData.id);
        
        if (error) throw error;
        toast.success("Profile updated successfully!");
      } else {
        // Insert new record
        const { error } = await supabase
          .from('user_chatbot_data')
          .insert([formattedData]);
        
        if (error) throw error;
        toast.success("Profile created successfully!");
      }
      
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save your profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <PandaAvatar />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-blue to-primary">
            Your Property AI Profile
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Help us understand your preferences so our AI can provide personalized assistance
          </p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-2xl">Personal Information</CardTitle>
            <CardDescription>
              This information helps our AI assistant provide more relevant responses to your queries.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <UserRound className="h-4 w-4" /> Full Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Your age" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="occupation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4" /> Occupation
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Your occupation" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="budget_range"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" /> Budget Range
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., $500,000 - $800,000" {...field} />
                      </FormControl>
                      <FormDescription>
                        The price range you're considering for property investment
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferred_locations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> Preferred Locations
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Central District, East Coast, River Valley" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter locations separated by commas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="property_preferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Home className="h-4 w-4" /> Property Preferences
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="e.g., Condo with pool, 2-bedroom apartment, proximity to MRT"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        What type of properties are you interested in?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="investment_goals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" /> Investment Goals
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="e.g., Long-term rental income, capital appreciation, own stay"
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        What are you hoping to achieve with your property investment?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-accent-blue hover:bg-accent-blue/90"
                  disabled={loading}
                >
                  {loading ? "Saving..." : existingData ? "Update Profile" : "Save Profile"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
