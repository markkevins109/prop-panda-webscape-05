
import { supabase } from '@/integrations/supabase/client';
import { NavigateFunction } from 'react-router-dom';

export const checkUserProfile = async (userId: string, navigate: NavigateFunction, currentPath: string) => {
  // Only redirect from login page to home
  if (currentPath === '/login') {
    navigate('/');
  }
  
  // Don't redirect from the account-type page
  // This ensures users can access the account type page directly
};
