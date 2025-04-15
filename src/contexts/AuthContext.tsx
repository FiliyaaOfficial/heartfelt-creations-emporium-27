
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: { first_name?: string; last_name?: string }) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<void>;
  signInWithOtp: (email: string) => Promise<{ error: any }>;
  verifyOtp: (email: string, token: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state change', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, metadata?: { first_name?: string; last_name?: string }) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log('Starting Google sign-in process...');
      
      // Get the current URL to use as the site URL for redirects
      const siteUrl = window.location.origin;
      console.log('Current site URL:', siteUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${siteUrl}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) {
        console.error("Google sign-in error:", error);
        toast.error('Google sign in failed', { 
          description: error.message 
        });
      } else {
        console.log('Google sign-in initiated successfully', data);
      }
    } catch (error) {
      console.error("Unexpected error during Google sign-in:", error);
      toast.error('An unexpected error occurred during Google sign in');
    }
  };

  const signInWithOtp = async (email: string) => {
    try {
      console.log("Sending OTP to:", email);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        }
      });
      
      if (error) {
        console.error("OTP send error:", error);
      } else {
        console.log("OTP sent successfully");
      }
      
      return { error };
    } catch (error) {
      console.error("Unexpected error sending OTP:", error);
      return { error };
    }
  };

  const verifyOtp = async (email: string, token: string) => {
    try {
      console.log("Verifying OTP for:", email);
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'magiclink'
      });
      
      if (error) {
        console.error("OTP verification error:", error);
      } else {
        console.log("OTP verified successfully");
      }
      
      return { error };
    } catch (error) {
      console.error("Unexpected error verifying OTP:", error);
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    isAuthenticated: !!user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithOtp,
    verifyOtp,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
