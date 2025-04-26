
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Selection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const checkExistingSelection = async () => {
      if (!user) {
        navigate('/login');
        return;
      }
      
      const { data } = await supabase
        .from('user_account_types')
        .select('account_type')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        navigate('/');
      }
    };

    checkExistingSelection();
  }, [user, navigate]);

  const handleSelection = async (accountType: 'individual' | 'company') => {
    if (!user) {
      toast.error('Please sign in to continue');
      navigate('/login');
      return;
    }

    const { error } = await supabase
      .from('user_account_types')
      .insert({
        user_id: user.id,
        account_type: accountType
      });

    if (error) {
      toast.error('Failed to save your selection. Please try again.');
      return;
    }

    toast.success('Account type saved successfully!');
    navigate('/');
  };

  if (!user) {
    return null; // The useEffect will handle redirecting to login
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Our Platform</h1>
        <p className="text-muted-foreground mb-8">
          Please select your account type to continue. This selection cannot be changed later.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" 
                onClick={() => handleSelection('individual')}>
            <h2 className="text-xl font-semibold mb-4">Individual</h2>
            <p className="text-muted-foreground mb-6">
              Perfect for personal property listings and individual property seekers
            </p>
            <Button className="w-full">Select Individual</Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleSelection('company')}>
            <h2 className="text-xl font-semibold mb-4">Company</h2>
            <p className="text-muted-foreground mb-6">
              Ideal for real estate agencies and property management companies
            </p>
            <Button className="w-full">Select Company</Button>
          </Card>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Note: This selection is permanent and cannot be changed after submission
        </p>
      </div>
    </div>
  );
};

export default Selection;
