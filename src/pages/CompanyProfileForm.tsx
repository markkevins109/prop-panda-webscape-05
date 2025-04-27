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
  website: z.string().optional(),
  profile_purpose: z.enum(['buying', 'selling', 'both'], { 
    required_error: "Please select your company's profile purpose" 
  })
});

const specializations = [
  "Residential", 
  "Commercial", 
  "Rentals", 
  "Luxury", 
  "Industrial"
];

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
      years_experience: 0,
      specializations: [],
      operating_areas: '',
      office_address: '',
      working_hours: '',
      website: '',
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

      navigate('/');
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
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-center">
        <p className="text-blue-800 font-semibold">
          Are you here to buy or sell properties? Let us help you connect with the right opportunities!
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                <Select 
                  onValueChange={(value) => {
                    const currentSpecializations = field.value || [];
                    const newSpecializations = currentSpecializations.includes(value)
                      ? currentSpecializations.filter(spec => spec !== value)
                      : [...currentSpecializations, value];
                    field.onChange(newSpecializations);
                  }}
                  value=""
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select specializations" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {specializations.map(spec => (
                      <SelectItem key={spec} value={spec}>
                        {spec} {field.value?.includes(spec) ? "✓" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
                {field.value && field.value.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {field.value.map(spec => (
                      <span key={spec} className="bg-primary/10 px-2 py-1 rounded-md text-sm">
                        {spec}
                        <button 
                          type="button" 
                          onClick={() => field.onChange(field.value.filter(s => s !== spec))}
                          className="ml-2 text-destructive"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
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

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website or Portfolio Link (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter website URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <Button type="submit" className="w-full">Create Profile</Button>
        </form>
      </Form>
    </div>
  );
};

export default CompanyProfileForm;
