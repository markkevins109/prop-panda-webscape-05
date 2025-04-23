
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

type QuestionFormData = {
  question_text: string;
};

interface QuestionFormProps {
  userId: string;
  propertyInterest?: string;
  onSuccess: () => void;
}

export default function QuestionForm({ userId, propertyInterest, onSuccess }: QuestionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<QuestionFormData>();

  const onSubmit = async (data: QuestionFormData) => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('community_questions')
        .insert([{
          user_id: userId,
          question_text: data.question_text,
          property_interest: propertyInterest
        }]);

      if (error) throw error;
      
      toast.success("Your question has been posted!");
      reset();
      onSuccess();
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to post question. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Textarea
          {...register("question_text", {
            required: "Question text is required",
            maxLength: {
              value: 500,
              message: "Question cannot exceed 500 characters"
            }
          })}
          placeholder="What would you like to ask the community?"
          className="min-h-[100px]"
        />
        {errors.question_text && (
          <p className="text-sm text-red-500 mt-1">{errors.question_text.message}</p>
        )}
      </div>

      <Button 
        type="submit" 
        className="bg-accent-blue hover:bg-accent-blue/90"
        disabled={isSubmitting}
      >
        Post Question
      </Button>
    </form>
  );
}
