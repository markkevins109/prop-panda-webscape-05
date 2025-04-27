
import { supabase } from '@/integrations/supabase/client';
import { NavigateFunction } from 'react-router-dom';

export const checkUserProfile = async (userId: string, navigate: NavigateFunction, currentPath: string) => {
  const { data: accountType } = await supabase
    .from('user_account_types')
    .select('account_type')
    .eq('user_id', userId)
    .single();

  if (!accountType) {
    navigate('/account-type');
    return;
  }

  if (currentPath === '/login' || currentPath === '/account-type') {
    navigate('/');
  }
};
