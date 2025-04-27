
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, UserRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AccountTypeSelection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAccountTypeSelection = async (accountType: 'individual' | 'company') => {
    try {
      const { error } = await supabase
        .from('user_account_types')
        .insert({
          user_id: user?.id,
          account_type: accountType
        });

      if (error) throw error;

      toast({
        title: "Account type selected",
        description: "Your account type has been set successfully.",
      });

      // Navigate to the corresponding profile form
      navigate(accountType === 'individual' ? '/profile/individual' : '/profile/company');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set account type. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container max-w-xl mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Choose Account Type</h1>
        <p className="text-muted-foreground">Select the type of account you want to create</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card 
          className="p-6 cursor-pointer hover:border-primary transition-colors" 
          onClick={() => handleAccountTypeSelection('individual')}
        >
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <UserRound className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Individual</h2>
            <p className="text-muted-foreground text-sm mb-4">Create a personal account to browse and rent properties</p>
            <Button className="w-full">Individual</Button>
          </div>
        </Card>

        <Card 
          className="p-6 cursor-pointer hover:border-primary transition-colors" 
          onClick={() => handleAccountTypeSelection('company')}
        >
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Company</h2>
            <p className="text-muted-foreground text-sm mb-4">List and manage properties as a business entity</p>
            <Button className="w-full">Company</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AccountTypeSelection;
