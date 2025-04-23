
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

type AnswerFormData = {
  answer_text: string;
};

interface AnswerFormProps {
  questionId: string;
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AnswerForm({ questionId, userId, onSuccess, onCancel }: AnswerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<AnswerFormData>();

  const onSubmit = async (data: AnswerFormData) => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('community_answers')
        .insert([{
          question_id: questionId,
          user_id: userId,
          answer_text: data.answer_text
        }]);

      if (error) throw error;
      
      toast.success("Your answer has been posted!");
      onSuccess();
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to post answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Textarea
        {...register("answer_text", {
          required: "Answer text is required",
          maxLength: {
            value: 1000,
            message: "Answer cannot exceed 1000 characters"
          }
        })}
        placeholder="Share your knowledge with the community..."
        className="min-h-[100px]"
      />
      {errors.answer_text && (
        <p className="text-sm text-red-500 mt-1">{errors.answer_text.message}</p>
      )}

      <div className="flex space-x-4">
        <Button 
          type="submit" 
          className="bg-accent-blue hover:bg-accent-blue/90"
          disabled={isSubmitting}
        >
          Submit Answer
        </Button>
        <Button 
          type="button" 
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
