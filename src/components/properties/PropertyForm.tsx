import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const propertySchema = z.object({
  address: z.string().min(1, "Address is required"),
  rent_per_month: z.string().min(1, "Rent is required").refine(val => !isNaN(Number(val)), "Must be a valid number"),
  property_type: z.enum(["HDB", "Landed Property", "Condominium", "Shop Property"]),
  available_date: z.date(),
  nationality: z.string(),
  profession: z.enum(["Any", "Retired", "Student", "Professionals"]),
  race: z.enum(["Any", "Indian", "Chinese", "Malay"]),
  pets_allowed: z.enum(["true", "false"]).transform(val => val === "true"),
});

type PropertyFormData = z.infer<typeof propertySchema>;

interface PropertyFormProps {
  onSuccess?: () => void;
  initialData?: PropertyFormData & { id: string };
}

// Generate a valid UUID for demo purposes
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, 
        v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default function PropertyForm({ onSuccess, initialData }: PropertyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Get current authenticated user
  useEffect(() => {
    async function getUserId() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUserId(session.user.id);
        } else {
          // Check for demo authentication
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

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: initialData || {
      address: "",
      rent_per_month: "",
      property_type: "HDB",
      available_date: new Date(),
      nationality: "Any",
      profession: "Any",
      race: "Any",
      pets_allowed: false,
    },
  });

  const onSubmit = async (data: PropertyFormData) => {
    try {
      setIsSubmitting(true);
      
      // Check if user is authenticated
      if (!userId) {
        toast.error("You must be logged in to add properties");
        setIsSubmitting(false);
        return;
      }
      
      const formattedData = {
        ...data,
        rent_per_month: Number(data.rent_per_month),
        agent_id: userId, // Use the userId as agent_id
      };

      console.log("Submitting property with data:", formattedData);

      if (initialData?.id) {
        const { error } = await supabase
          .from('properties')
          .update(formattedData)
          .eq('id', initialData.id);

        if (error) throw error;
        toast.success("Property updated successfully!");
      } else {
        const { error } = await supabase
          .from('properties')
          .insert([formattedData]);

        if (error) throw error;
        toast.success("Property added successfully!");
      }

      onSuccess?.();
      form.reset();
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to save property");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show a loading message while checking authentication
  if (isLoading) {
    return <div className="p-4 text-center">Loading user information...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter property address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rent_per_month"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monthly Rent</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter monthly rent" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="property_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="HDB">HDB</SelectItem>
                  <SelectItem value="Landed Property">Landed Property</SelectItem>
                  <SelectItem value="Condominium">Condominium</SelectItem>
                  <SelectItem value="Shop Property">Shop Property</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="available_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Available Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date()
                    }
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Nationality</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select nationality preference" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Any">Any</SelectItem>
                  <SelectItem value="Singaporean">Singaporean</SelectItem>
                  <SelectItem value="Malaysian">Malaysian</SelectItem>
                  <SelectItem value="Chinese">Chinese</SelectItem>
                  <SelectItem value="Indian">Indian</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="profession"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Profession</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select profession preference" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Any">Any</SelectItem>
                  <SelectItem value="Retired">Retired</SelectItem>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Professionals">Professionals</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="race"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Race</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select race preference" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Any">Any</SelectItem>
                  <SelectItem value="Indian">Indian</SelectItem>
                  <SelectItem value="Chinese">Chinese</SelectItem>
                  <SelectItem value="Malay">Malay</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pets_allowed"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Pets Allowed</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value.toString()}
                  className="flex flex-row space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="true" />
                    </FormControl>
                    <FormLabel className="font-normal">Yes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="false" />
                    </FormControl>
                    <FormLabel className="font-normal">No</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData ? "Update Property" : "Add Property"}
        </Button>
      </form>
    </Form>
  );
}
