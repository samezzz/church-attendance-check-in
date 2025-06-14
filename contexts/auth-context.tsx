"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { User, supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import { createUserRecord, fetchUserRole, fetchUserData, handleGoogleSignIn } from '@/app/actions/auth';
import { createClient } from '@supabase/supabase-js';
import { Session } from '@supabase/supabase-js';

type UserRole = 'ADMIN' | 'MEMBER';

interface ExtendedUser {
  id: string;
  email?: string;
  phoneNumber?: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

type AuthContextType = {
  user: ExtendedUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string, phone: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode; }) {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { role } = await fetchUserRole(session.user.id);
        const { data: userData } = await fetchUserData(session.user.id);
        
        if (userData) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: userData.name,
            phoneNumber: userData.phoneNumber,
            role: role,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt
          });
        }
      }
      setLoading(false);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { role } = await fetchUserRole(session.user.id);
        const { data: userData } = await fetchUserData(session.user.id);
        
        if (userData) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: userData.name,
            phoneNumber: userData.phoneNumber,
            role: role,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data: { user }, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    
    if (user) {
      const { role } = await fetchUserRole(user.id);
      const { data: userData } = await fetchUserData(user.id);
      
      if (userData) {
        const extendedUser = {
          id: user.id,
          email: user.email,
          name: userData.name,
          phoneNumber: userData.phoneNumber,
          role: role,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt
        };
        setUser(extendedUser);
        
        // Redirect based on role
        if (role === 'ADMIN') {
          router.push('/admin/dashboard');
        } else {
          router.push('/');
        }
      }
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          scopes: 'email profile',
        },
      });

      if (error) throw error;

      // After successful OAuth sign in, we'll handle the user creation in the useEffect
      // that listens for auth state changes
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  // Add this useEffect to handle post-authentication user creation
  useEffect(() => {
    const handleAuthStateChange = async (event: string, session: Session | null) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          console.log('Processing sign in for user:', session.user.id);
          
          // Handle Google sign in using server action
          const { data: userData, error: handleError } = await handleGoogleSignIn(
            session.user.id,
            session.user.email || '',
            session.user.user_metadata
          );

          if (handleError) {
            console.error('Error handling Google sign in:', handleError);
            return;
          }

          if (userData) {
            const extendedUser = {
              id: session.user.id,
              email: session.user.email,
              name: userData.name,
              phoneNumber: userData.phoneNumber,
              role: userData.role,
              createdAt: userData.createdAt,
              updatedAt: userData.updatedAt
            };
            setUser(extendedUser);
            
            // Redirect based on role
            if (userData.role === 'ADMIN') {
              router.push('/admin/dashboard');
            } else {
              router.push('/');
            }
          }
        } catch (error) {
          console.error('Error in auth state change handler:', error);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const signUp = async (email: string, password: string, fullName: string, phone: string) => {
    try {
      console.log('Starting signup process with data:', { email, fullName, phone });
      
      // Step 1: Create auth user
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
          },
        },
      });

      if (signUpError) {
        console.error('Auth signup error:', signUpError);
        throw signUpError;
      }

      if (!user) {
        console.error('No user returned from auth signup');
        throw new Error('Failed to create user');
      }

      console.log('Auth user created successfully:', user);

      // Step 2: Create user record using server action
      console.log('Creating user record in User table with ID:', user.id);
      
      const { data: userData, error: userError } = await createUserRecord(
        user.id,
        email,
        fullName,
        phone
      );

      if (userError) {
        console.error('User creation error:', userError);
        // Remove the attempt to delete the auth user since we don't have permission
        throw new Error(`Failed to create user record: ${userError instanceof Error ? userError.message : 'Unknown error'}`);
      }

      if (!userData) {
        console.error('No user data returned after creation');
        throw new Error('Failed to create user record');
      }

      console.log('User record created successfully:', userData);

      // Redirect to sign in page after successful sign up
      router.push('/signin');
    } catch (error) {
      console.error('Signup process failed:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    router.push('/signin');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signInWithGoogle, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}