
import React, { createContext, useContext, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';
import { useAuthState } from '@/hooks/useAuthState';
import { checkUserProfile } from '@/utils/profileUtils';

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
  const {
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
    navigate
  } = useAuthState();
  
  const location = useLocation();

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

        // We don't need to call checkUserProfile here as we're handling navigation 
        // directly in the signIn function
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
        
        // Don't redirect automatically on first load
        // This allows our manual redirect to /account-type to work properly
        
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
  }, [toast, navigate, location.pathname, setSession, setUser, setLoading, setInitialLoadComplete]);

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
