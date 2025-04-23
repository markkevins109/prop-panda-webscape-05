
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

type UserFormData = {
  name: string;
  email: string;
  phone?: string;
  property_interest?: string;
};

export default function UserRegistrationForm({ onSuccess }: { onSuccess: (userId: string) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>();

  const onSubmit = async (data: UserFormData) => {
    try {
      setIsSubmitting(true);
      const { data: user, error } = await supabase
        .from('community_users')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      
      toast.success("Welcome to the community!");
      onSuccess(user.id);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to join. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            {...register("name", { required: "Name is required" })}
            className="mt-1"
            placeholder="Your name"
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
            className="mt-1"
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">Phone Number (Optional)</Label>
          <Input
            id="phone"
            {...register("phone", {
              pattern: {
                value: /^\+65\s?[689]\d{3}\s?\d{4}$/,
                message: "Please enter a valid Singapore phone number (+65 XXXX XXXX)"
              }
            })}
            className="mt-1"
            placeholder="+65 9123 4567"
          />
          {errors.phone && (
            <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="property_interest">Property Interest (Optional)</Label>
          <select
            id="property_interest"
            {...register("property_interest")}
            className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="">Select your interest</option>
            <option value="HDB">HDB</option>
            <option value="Condominium">Condominium</option>
            <option value="Commercial">Commercial</option>
          </select>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-accent-blue hover:bg-accent-blue/90"
        disabled={isSubmitting}
      >
        Join Community
      </Button>
    </form>
  );
}
