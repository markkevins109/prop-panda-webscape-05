
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
import { generateUUID } from "@/utils/uuid";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserRound,
  Building,
  Phone,
  Mail,
  Clock,
  Award,
} from "lucide-react";

// Form schema with validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone_number: z.string().min(10, { message: "Please enter a valid phone number." }),
  company_name: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  experience: z.string().refine((val) => !val || !isNaN(parseInt(val)), {
    message: "Experience must be a valid number.",
  }),
  specialization: z.string({
    required_error: "Please select a specialization.",
  }),
});

type AgentProfile = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone_number: string;
  company_name: string;
  experience: number;
  specialization: string;
  created_at: string;
  updated_at: string;
};

export default function UserProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [existingData, setExistingData] = useState<AgentProfile | null>(null);

  // Initialize form with empty values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
      company_name: "",
      experience: "",
      specialization: "",
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user.id) {
        setUserId(data.session.user.id);
        fetchAgentData(data.session.user.id);
      } else {
        toast.error("Please sign in to update your profile");
        navigate("/auth");
      }
    };
    
    checkAuth();
  }, [navigate]);

  const fetchAgentData = async (uid: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('agent_profiles')
        .select('*')
        .eq('user_id', uid)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setExistingData(data as AgentProfile);
        // Populate form with existing data
        form.reset({
          name: data.name || "",
          email: data.email || "",
          phone_number: data.phone_number || "",
          company_name: data.company_name || "",
          experience: data.experience ? String(data.experience) : "",
          specialization: data.specialization || "",
        });
      }
    } catch (error) {
      console.error("Error fetching agent data:", error);
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
      const profileId = existingData?.id || generateUUID();
      
      const formattedData = {
        id: profileId,
        user_id: userId,
        name: values.name,
        email: values.email,
        phone_number: values.phone_number,
        company_name: values.company_name,
        experience: parseInt(values.experience),
        specialization: values.specialization,
      };

      if (existingData) {
        // Update existing record
        const { error } = await supabase
          .from('agent_profiles')
          .update(formattedData)
          .eq('id', existingData.id);
        
        if (error) throw error;
        toast.success("Profile updated successfully!");
        navigate("/"); // Redirect to home page after successful update
      } else {
        // Insert new record
        const { error } = await supabase
          .from('agent_profiles')
          .insert([formattedData]);
        
        if (error) throw error;
        toast.success("Profile created successfully!");
        navigate("/"); // Redirect to home page after successful creation
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
            Agent Profile
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Complete your profile to get started
          </p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-2xl">Personal Information</CardTitle>
            <CardDescription>
              Please provide your professional details below
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
                        <Input placeholder="Your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Mail className="h-4 w-4" /> Email
                        </FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Your email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="h-4 w-4" /> Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Your phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Building className="h-4 w-4" /> Company Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Your company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Clock className="h-4 w-4" /> Years of Experience
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Years of experience"
                            min="0"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="specialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Award className="h-4 w-4" /> Specialization
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your specialization" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="residence_agent">Residence Agent</SelectItem>
                            <SelectItem value="rental_agent">Rental Agent</SelectItem>
                            <SelectItem value="purchasing_agent">Purchasing Agent</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose your area of specialization in real estate
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
