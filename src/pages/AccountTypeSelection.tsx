
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function AccountTypeSelection() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleTypeSelection = async (type: 'individual' | 'company') => {
    try {
      const { error } = await supabase
        .from('user_account_types')
        .insert([
          { account_type: type }
        ]);

      if (error) throw error;

      if (type === 'individual') {
        navigate('/individual-profile');
      } else {
        // For now, just redirect to home for company
        navigate('/');
      }
    } catch (error) {
      console.error('Error setting account type:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to set account type. Please try again.",
      });
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Select Account Type</h1>
        <p className="text-muted-foreground">Choose how you want to use our platform</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Button
          variant="outline"
          size="lg"
          className="h-32 flex flex-col gap-2"
          onClick={() => handleTypeSelection('individual')}
        >
          <span className="text-xl">Individual</span>
          <span className="text-sm text-muted-foreground">Looking for properties</span>
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="h-32 flex flex-col gap-2"
          onClick={() => handleTypeSelection('company')}
        >
          <span className="text-xl">Company</span>
          <span className="text-sm text-muted-foreground">Property management business</span>
        </Button>
      </div>
    </div>
  );
}
