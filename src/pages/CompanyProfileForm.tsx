
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SPECIALIZATIONS = [
  "Residential",
  "Commercial", 
  "Rentals",
  "Luxury",
  "Industrial",
  "Property Management",
  "Investment Properties",
  "New Construction"
];

const companyProfileSchema = z.object({
  agency_name: z.string().min(2, "Agency name is required"),
  contact_person_name: z.string().min(2, "Contact person name is required"),
  phone_number: z.string().min(10, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  years_experience: z.coerce.number().min(0, "Years of experience is required"),
  specializations: z.array(z.string()).min(1, "Select at least one specialization"),
  operating_areas: z.string().min(2, "Operating areas are required"),
  office_address: z.string().min(2, "Office address is required"),
  working_hours: z.string().min(2, "Working hours are required"),
  profile_purpose: z.enum(['buying', 'selling', 'both'], { 
    required_error: "Please select your company's profile purpose" 
  })
});

const CompanyProfileForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof companyProfileSchema>>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: {
      agency_name: '',
      contact_person_name: '',
      phone_number: '',
      email: user?.email || '',
      years_experience: undefined,
      specializations: [],
      operating_areas: '',
      office_address: '',
      working_hours: '',
      profile_purpose: undefined
    }
  });

  const onSubmit = async (values: z.infer<typeof companyProfileSchema>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase.from('company_profiles').insert({
        user_id: user.id,
        ...values
      });

      if (error) throw error;

      toast({
        title: "Profile Created",
        description: "Your company profile has been created successfully.",
      });

      // Redirect to login page after successful profile creation
      navigate('/login');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container max-w-xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Company Profile</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="profile_purpose"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What is your company's primary purpose?</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your purpose" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="buying">Buying Property</SelectItem>
                    <SelectItem value="selling">Selling Property</SelectItem>
                    <SelectItem value="both">Both Buying and Selling</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="agency_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agency Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter agency name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contact_person_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Person Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter contact person name" {...field} />
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
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email address" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="years_experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years of Experience</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter years of experience" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="specializations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specializations</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {SPECIALIZATIONS.map((spec) => (
                    <div key={spec} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`spec-${spec}`}
                        checked={field.value?.includes(spec)}
                        onChange={(e) => {
                          const updatedSpecializations = e.target.checked
                            ? [...(field.value || []), spec]
                            : (field.value || []).filter((s) => s !== spec);
                          field.onChange(updatedSpecializations);
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor={`spec-${spec}`} className="text-sm font-medium leading-none">
                        {spec}
                      </label>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="operating_areas"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Operating Areas</FormLabel>
                <FormControl>
                  <Input placeholder="Enter cities or neighborhoods" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="office_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Office Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter office address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="working_hours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Working Hours</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Monday-Friday, 9am-5pm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">Create Profile</Button>
        </form>
      </Form>
    </div>
  );
};

export default CompanyProfileForm;
