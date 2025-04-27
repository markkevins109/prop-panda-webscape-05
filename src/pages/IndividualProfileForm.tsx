import React, { useState } from 'react';
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const SPECIALIZATIONS = [
  'Residential',
  'Commercial', 
  'Rentals', 
  'Luxury', 
  'Industrial',
  'Land',
] as const;

const individualProfileSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  phone_number: z.string().min(10, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  agency_name: z.string().optional(),
  years_experience: z.coerce.number().min(0, "Years of experience must be a positive number").optional(),
  specializations: z.array(z.enum(SPECIALIZATIONS)).optional(),
  operating_areas: z.string().optional(),
  office_address: z.string().optional(),
  working_hours: z.string().optional(),
  website: z.string().url("Invalid URL").optional(),
  profile_purpose: z.enum(['buying', 'selling', 'both'], { 
    required_error: "Please select your profile purpose" 
  })
});

const IndividualProfileForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof individualProfileSchema>>({
    resolver: zodResolver(individualProfileSchema),
    defaultValues: {
      full_name: '',
      phone_number: '',
      email: user?.email || '',
      agency_name: '',
      years_experience: undefined,
      specializations: [],
      operating_areas: '',
      office_address: '',
      working_hours: '',
      website: '',
      profile_purpose: undefined
    }
  });

  const onSubmit = async (values: z.infer<typeof individualProfileSchema>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase.from('individual_profiles').insert({
        user_id: user.id,
        ...values,
        specializations: values.specializations || []
      });

      if (error) throw error;

      toast({
        title: "Profile Created",
        description: "Your individual profile has been created successfully.",
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
      <h1 className="text-3xl font-bold mb-6 text-center">Individual Profile</h1>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-center">
        <p className="text-blue-800 font-semibold">
          Are you here to buy or sell properties? Let us help you connect with the right opportunities!
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
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
                  <Input placeholder="Enter your phone number" {...field} />
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
                  <Input placeholder="Enter your email" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="agency_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agency Name (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter agency name" {...field} />
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
                <FormLabel>Years of Experience (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter years of experience" 
                    {...field} 
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
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
                <FormLabel>Specializations (Optional)</FormLabel>
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
                <FormLabel>Operating Areas (Optional)</FormLabel>
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
                <FormLabel>Office Address (Optional)</FormLabel>
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
                <FormLabel>Working Hours (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter working hours" {...field} />
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
                <FormLabel>What is your primary purpose?</FormLabel>
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

export default IndividualProfileForm;
