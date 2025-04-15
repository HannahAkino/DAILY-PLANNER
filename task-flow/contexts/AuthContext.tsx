// @ts-nocheck
"use client";

import { createContext, useState, useContext, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, SupabaseUser } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

type Profile = {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
};

type AuthError = {
  message: string;
  status?: number;
};

type AuthContextType = {
  user: SupabaseUser | null;
  profile: Profile | null;
  loading: boolean;
  sessionChecked: boolean;
  authToken: string | null;
  setUser: Dispatch<SetStateAction<SupabaseUser | null>>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  setSession: (session: Session | null) => void;
  loadUserProfile: (id: string) => Promise<void>;
  getAuthToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  sessionChecked: false,
  authToken: null,
  setUser: () => {},
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => ({ error: null }),
  setSession: () => {},
  loadUserProfile: async () => {},
  getAuthToken: async () => null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [session, setSessionState] = useState<Session | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const router = useRouter();

  // Update token when session changes
  const setSession = (newSession: Session | null) => {
    setSessionState(newSession);
    setAuthToken(newSession?.access_token || null);
  };

  // Utility function to get current auth token
  const getAuthToken = async (): Promise<string | null> => {
    // If we already have a token, return it
    if (authToken) {
      return authToken;
    }
    
    // Otherwise try to get a fresh token
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token || null;
      setAuthToken(token);
      return token;
    } catch (error) {
      console.error("Error getting auth token:", error);
      return null;
    }
  };

  useEffect(() => {
    console.log("AuthContext: Checking for existing session...");

    // Check for existing session
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("AuthContext: Session check error:", error);
        } else if (data.session) {
          console.log("AuthContext: Existing session found, setting user", data.session.user.id);
          
          // Set the session state and token
          setSession(data.session);
          
          // Set the user state
          setUser(data.session.user as unknown as SupabaseUser);
          
          // Fetch user profile
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single();
            
          if (profileError) {
            console.error("AuthContext: Error fetching profile:", profileError);
          } else if (profileData) {
            console.log("AuthContext: Profile data loaded", profileData);
            setProfile(profileData);
          }
        } else {
          console.log("AuthContext: No existing session found");
        }
      } catch (err) {
        console.error("AuthContext: Error checking session:", err);
      } finally {
        setLoading(false);
        setSessionChecked(true);
      }
    };

    checkSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("AuthContext: Auth state change detected:", event);

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
          if (currentSession) {
            console.log("AuthContext: Session detected in auth change:", currentSession.user.id);
            setUser(currentSession.user as unknown as SupabaseUser);
            setSession(currentSession);
            
            // Fetch profile data
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', currentSession.user.id)
              .single();
              
            if (profileError) {
              console.error("AuthContext: Error fetching profile:", profileError);
            } else if (profileData) {
              console.log("AuthContext: Profile data loaded", profileData);
              setProfile(profileData);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          console.log("AuthContext: User signed out");
          setUser(null);
          setProfile(null);
          setSession(null);
        }
      }
    );

    // Cleanup on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (id: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
        
      if (profileError) {
        console.error("AuthContext: Error fetching profile:", profileError);
      } else if (profileData) {
        console.log("AuthContext: Profile data loaded", profileData);
        setProfile(profileData);
      }
    } catch (error) {
      console.error("AuthContext: Error loading user profile:", error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("AuthContext: Signing in user with email:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("AuthContext: Sign in error:", error);
        return { error };
      }
      
      // Force refresh session info and store token after login
      if (data.session) {
        console.log("AuthContext: Session created after login:", data.session.user.id);
        setSession(data.session);
        setUser(data.session.user as unknown as SupabaseUser);
        await loadUserProfile(data.session.user.id);
      }

      return { error: null };
    } catch (err) {
      console.error("AuthContext: Unexpected sign in error:", err);
      return { error: { message: 'An unexpected error occurred during sign in' } };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // Validate email format
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        return { error: { message: 'Invalid email format' } };
      }
      
      // Create user with Supabase
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      // Once signed up, create a profile for the user
      if (data?.user) {
        // Insert user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ id: data.user.id, name, email }]);

        if (profileError) {
          return { error: profileError };
        }
      }

      return { error: null };
    } catch (err) {
      console.error("Sign up error:", err);
      return { error: { message: 'An unexpected error occurred during sign up' } };
    }
  };

  const signOut = async () => {
    try {
      console.log("AuthContext: Signing out user");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("AuthContext: Sign out error:", error);
        return { error };
      }
      
      // Reset state
      setUser(null);
      setProfile(null);
      setSession(null);
      router.push('/');
      
      return { error: null };
    } catch (err) {
      console.error("AuthContext: Unexpected sign out error:", err);
      return { error: { message: 'An unexpected error occurred during sign out' } };
    }
  };

  const value = {
    user,
    profile,
    loading,
    sessionChecked,
    authToken,
    setUser,
    signIn,
    signUp,
    signOut,
    setSession,
    loadUserProfile,
    getAuthToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
