
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Selection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [hasCheckedSelection, setHasCheckedSelection] = useState(false);

  useEffect(() => {
    const checkExistingSelection = async () => {
      if (!user) {
        return;
      }
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('user_account_types')
          .select('account_type')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error checking account type:', error);
          toast.error('Failed to check your account status');
        } else if (data) {
          // User already has a selection, redirect to home
          navigate('/');
        }
      } catch (error) {
        console.error('Error in checkExistingSelection:', error);
      } finally {
        setIsLoading(false);
        setHasCheckedSelection(true);
      }
    };

    if (user) {
      checkExistingSelection();
    } else {
      setHasCheckedSelection(true);
    }
  }, [user, navigate]);

  const handleSelection = async (accountType: 'individual' | 'company') => {
    if (!user) {
      toast.error('Please sign in to continue');
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_account_types')
        .insert({
          user_id: user.id,
          account_type: accountType
        });

      if (error) {
        console.error('Error saving selection:', error);
        toast.error('Failed to save your selection. Please try again.');
        return;
      }

      toast.success('Account type saved successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error in handleSelection:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking or if not authenticated
  if (isLoading || !hasCheckedSelection) {
    return (
      <div className="container mx-auto py-16 px-4 flex items-center justify-center min-h-[60vh]">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Our Platform</h1>
        <p className="text-muted-foreground mb-8">
          Please select your account type to continue. This selection cannot be changed later.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card 
            className={`p-6 hover:shadow-lg transition-shadow cursor-pointer ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
            onClick={() => !isLoading && handleSelection('individual')}
          >
            <h2 className="text-xl font-semibold mb-4">Individual</h2>
            <p className="text-muted-foreground mb-6">
              Perfect for personal property listings and individual property seekers
            </p>
            <Button className="w-full" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Select Individual'}
            </Button>
          </Card>

          <Card 
            className={`p-6 hover:shadow-lg transition-shadow cursor-pointer ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
            onClick={() => !isLoading && handleSelection('company')}
          >
            <h2 className="text-xl font-semibold mb-4">Company</h2>
            <p className="text-muted-foreground mb-6">
              Ideal for real estate agencies and property management companies
            </p>
            <Button className="w-full" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Select Company'}
            </Button>
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
