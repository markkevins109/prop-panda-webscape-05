
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Building2, Phone, Mail, Clock, Award, Map, Clock3, UserRound, Briefcase } from "lucide-react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
      console.log("Submitting company profile:", values);
      console.log("User ID:", user.id);
      
      const { error } = await supabase.from('company_profiles').insert({
        user_id: user.id,
        agency_name: values.agency_name,
        contact_person_name: values.contact_person_name,
        phone_number: values.phone_number,
        email: values.email,
        years_experience: values.years_experience,
        specializations: values.specializations,
        operating_areas: values.operating_areas,
        office_address: values.office_address,
        working_hours: values.working_hours,
        profile_purpose: values.profile_purpose
      });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      toast({
        title: "Profile Created",
        description: "Your company profile has been created successfully.",
      });

      navigate('/login');
    } catch (error: any) {
      console.error("Profile creation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50 py-12 px-4">
      <div className="container max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Side - Image & Info */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <Card className="overflow-hidden shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <AspectRatio ratio={1/1} className="bg-gradient-to-br from-green-600 to-accent-blue">
                  <div className="flex flex-col items-center justify-center p-6 text-white h-full">
                    <Building2 size={80} className="mb-4" />
                    <h2 className="text-2xl font-bold">Company Profile</h2>
                    <p className="text-white/80 mt-2 text-center">Establish your company's presence and highlight your expertise</p>
                  </div>
                </AspectRatio>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Building2 className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Company Details</p>
                        <p className="text-xs text-muted-foreground">Establish your business identity</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Award className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Market Expertise</p>
                        <p className="text-xs text-muted-foreground">Highlight your company's specializations</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Map className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Service Areas</p>
                        <p className="text-xs text-muted-foreground">Define your operational territories</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="lg:col-span-8">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="space-y-1 border-b pb-7 mb-2">
                <CardTitle className="text-2xl text-center bg-gradient-to-r from-green-600 to-accent-blue bg-clip-text text-transparent">
                  Complete Your Company Profile
                </CardTitle>
                <CardDescription className="text-center">
                  Please provide your company information to create your business profile
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="bg-green-50/50 p-4 rounded-lg mb-6">
                      <h3 className="font-medium text-green-600 mb-3">Profile Purpose</h3>
                      <FormField
                        control={form.control}
                        name="profile_purpose"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4" /> What is your company's primary purpose?
                            </FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-white">
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
                    </div>

                    <div className="bg-green-50/50 p-4 rounded-lg mb-6">
                      <h3 className="font-medium text-green-600 mb-3">Company Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="agency_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Building2 className="h-4 w-4" /> Agency Name
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter agency name" 
                                  {...field} 
                                  className="bg-white"
                                />
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
                              <FormLabel className="flex items-center gap-2">
                                <UserRound className="h-4 w-4" /> Contact Person
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter contact person name" 
                                  {...field} 
                                  className="bg-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <FormField
                          control={form.control}
                          name="phone_number"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Phone className="h-4 w-4" /> Phone Number
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter company phone" 
                                  {...field} 
                                  className="bg-white"
                                />
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
                              <FormLabel className="flex items-center gap-2">
                                <Mail className="h-4 w-4" /> Email Address
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter company email" 
                                  {...field} 
                                  disabled 
                                  className="bg-white/50"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="bg-green-50/50 p-4 rounded-lg mb-6">
                      <h3 className="font-medium text-green-600 mb-3">Experience & Expertise</h3>
                      <div className="mb-4">
                        <FormField
                          control={form.control}
                          name="years_experience"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Clock className="h-4 w-4" /> Years of Experience
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="Enter years in business" 
                                  {...field} 
                                  className="bg-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="specializations"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Award className="h-4 w-4" /> Company Specializations
                            </FormLabel>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 bg-white rounded-md border">
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
                                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
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
                    </div>

                    <div className="bg-green-50/50 p-4 rounded-lg">
                      <h3 className="font-medium text-green-600 mb-3">Location & Availability</h3>
                      <FormField
                        control={form.control}
                        name="operating_areas"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Map className="h-4 w-4" /> Operating Areas
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter cities or regions served" 
                                {...field} 
                                className="bg-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <FormField
                          control={form.control}
                          name="office_address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Building2 className="h-4 w-4" /> Office Address
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter company address" 
                                  {...field} 
                                  className="bg-white"
                                />
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
                              <FormLabel className="flex items-center gap-2">
                                <Clock3 className="h-4 w-4" /> Business Hours
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="e.g. Mon-Fri, 9am-5pm" 
                                  {...field} 
                                  className="bg-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-green-600 to-accent-blue hover:from-green-700 hover:to-accent-blue/90 transition-all duration-300"
                    >
                      Create Company Profile
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfileForm;
