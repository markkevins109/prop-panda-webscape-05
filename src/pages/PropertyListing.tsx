
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

type PropertyFormData = {
  property_address: string;
  rent_per_month: number;
  property_type: 'HDB' | 'LANDED' | 'CONDOMINIUM' | 'SHOP';
  available_date: string;
  preferred_nationality: string;
  preferred_profession: 'RETIRED' | 'STUDENT' | 'PROFESSIONAL' | 'ANY';
  preferred_race: 'INDIAN' | 'CHINESE' | 'MALAY' | 'ANY';
  pets_allowed: boolean;
};

const PropertyListing = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<PropertyFormData>();

  const onSubmit = async (data: PropertyFormData) => {
    try {
      const { error } = await supabase.from('property_listings').insert({
        ...data,
        user_id: user?.id,
        rent_per_month: parseFloat(data.rent_per_month.toString())
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Property listing created successfully",
      });

      navigate('/property-listings');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create Property Listing</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="property_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Address</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter property address" />
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
                    <FormLabel>Rent per Month</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} placeholder="Enter rent amount" />
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
                        <SelectItem value="LANDED">Landed Property</SelectItem>
                        <SelectItem value="CONDOMINIUM">Condominium</SelectItem>
                        <SelectItem value="SHOP">Shop Property</SelectItem>
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
                  <FormItem>
                    <FormLabel>Available Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferred_nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Nationality</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Any nationality" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferred_profession"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Profession</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select preferred profession" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="RETIRED">Retired</SelectItem>
                        <SelectItem value="STUDENT">Student</SelectItem>
                        <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                        <SelectItem value="ANY">Any</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferred_race"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Race</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select preferred race" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="INDIAN">Indian</SelectItem>
                        <SelectItem value="CHINESE">Chinese</SelectItem>
                        <SelectItem value="MALAY">Malay</SelectItem>
                        <SelectItem value="ANY">Any</SelectItem>
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
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Pets Allowed</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Create Listing</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyListing;
