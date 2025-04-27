import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string, metadata?: { fullName: string; phone?: string }) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const checkUserProfile = async (userId: string) => {
    const { data: accountType } = await supabase
      .from('user_account_types')
      .select('account_type')
      .eq('user_id', userId)
      .single();

    if (!accountType) {
      navigate('/account-type');
      return;
    }

    if (accountType.account_type === 'individual') {
      const { data: profile } = await supabase
        .from('individual_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (!profile) {
        navigate('/individual-profile');
        return;
      }
    }

    if (location.pathname === '/login' || 
        location.pathname === '/account-type' || 
        location.pathname === '/individual-profile') {
      navigate('/');
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!isMounted) return;
      
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      if (event === 'SIGNED_IN' && newSession?.user) {
        toast({
          title: 'Sign in successful',
          description: 'You are now logged in.',
        });

        setTimeout(() => {
          if (isMounted && newSession?.user) {
            checkUserProfile(newSession.user.id);
          }
        }, 100);
      }
      
      if (event === 'SIGNED_OUT') {
        toast({
          title: 'Signed out',
          description: 'You have been logged out.',
        });
        navigate('/login');
      }
    });

    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          setTimeout(() => {
            if (isMounted && currentSession?.user) {
              checkUserProfile(currentSession.user.id);
            }
          }, 100);
        }
        
        setLoading(false);
        setInitialLoadComplete(true);
      } catch (error) {
        console.error("Error getting session:", error);
        if (isMounted) {
          setLoading(false);
          setInitialLoadComplete(true);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [toast, navigate, location.pathname]);

  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          // Set cookie expiry based on "remember me" option
          // If rememberMe is true, session lasts longer
          // If false, session is shorter (e.g., expires when browser is closed)
        }
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

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  if (!initialLoadComplete) {
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
