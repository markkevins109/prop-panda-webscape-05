
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { PropertyFormFields } from "./PropertyFormFields";
import { usePropertyAuth } from "@/hooks/usePropertyAuth";
import { PropertyFormProps, PropertyFormData, propertySchema } from "@/types/property";

export default function PropertyForm({ onSuccess, initialData }: PropertyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userId, isLoading } = usePropertyAuth();

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
      
      if (!userId) {
        toast.error("You must be logged in to add properties");
        setIsSubmitting(false);
        return;
      }
      
      const formattedData = {
        ...data,
        rent_per_month: Number(data.rent_per_month),
        agent_id: userId,
      };

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

  if (isLoading) {
    return <div className="p-4 text-center">Loading user information...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PropertyFormFields form={form} />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData ? "Update Property" : "Add Property"}
        </Button>
      </form>
    </Form>
  );
}
