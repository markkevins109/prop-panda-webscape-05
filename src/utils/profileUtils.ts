
import { supabase } from '@/integrations/supabase/client';
import { NavigateFunction } from 'react-router-dom';

export const checkUserProfile = async (userId: string, navigate: NavigateFunction, currentPath: string) => {
  if (currentPath === '/login') {
    navigate('/');
  }
};
