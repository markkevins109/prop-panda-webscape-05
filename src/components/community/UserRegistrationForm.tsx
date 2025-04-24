
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

type UserFormData = {
  name: string;
  email: string;
};

export default function UserRegistrationForm({ onSuccess }: { onSuccess: (userId: string) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>();

  const onSubmit = async (data: UserFormData) => {
    try {
      setIsSubmitting(true);
      
      // First check if the email already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('community_users')
        .select('id')
        .eq('email', data.email)
        .single();

      if (existingUser) {
        // If user already exists, just log them in with their existing ID
        toast.success("Welcome back to the community!");
        onSuccess(existingUser.id);
        return;
      }

      // If user doesn't exist, create a new user
      const { data: user, error } = await supabase
        .from('community_users')
        .insert([data])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          toast.error("This email is already registered. Please try a different one.");
        } else {
          console.error('Error:', error);
          toast.error("Failed to join. Please try again.");
        }
        return;
      }
      
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
