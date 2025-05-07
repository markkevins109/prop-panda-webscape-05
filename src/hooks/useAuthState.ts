
import { useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        toast({
          title: 'Sign in failed',
          description: error.message,
          variant: 'destructive',
        });
        return { error };
      }

      // Navigate to property listings page on successful sign in
      navigate('/property-listings');
      
      return { error: null };
    } catch (error: any) {
      console.error('Unexpected sign in error:', error);
      toast({
        title: 'Sign in failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, metadata?: { fullName: string; phone?: string }) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: metadata?.fullName,
            phone: metadata?.phone || null,
          },
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        toast({
          title: 'Sign up failed',
          description: error.message,
          variant: 'destructive',
        });
        return { error };
      }

      toast({
        title: 'Account created',
        description: 'Please check your email to verify your account.',
      });

      return { error: null };
    } catch (error: any) {
      console.error('Unexpected sign up error:', error);
      toast({
        title: 'Sign up failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    session,
    setSession,
    user,
    setUser,
    loading,
    setLoading,
    initialLoadComplete,
    setInitialLoadComplete,
    signIn,
    signUp,
    signOut,
    toast,
    navigate,
  };
};
