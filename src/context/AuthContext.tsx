import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  checkAdminStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const checkAdminStatus = useCallback(async (): Promise<boolean> => {
    if (!user) {
      setIsAdmin(false);
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        setIsAdmin(false);
        return false;
      }
      
      const adminStatus = data?.is_admin || false;
      setIsAdmin(adminStatus);
      return adminStatus;
    } catch (err) {
      console.error('Error checking admin status:', err);
      setIsAdmin(false);
      return false;
    }
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        // Wait a bit for session to restore
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        setSession(session);
        
        if (session?.user) {
          setUser(session.user);
          
          // Check admin status with retry logic
          let adminStatus = false;
          for (let i = 0; i < 3; i++) {
            try {
              const { data, error } = await supabase
                .from('profiles')
                .select('is_admin')
                .eq('id', session.user.id)
                .maybeSingle();

              if (!isMounted) return;
              
              if (!error && data) {
                adminStatus = data.is_admin || false;
                break;
              } else if (!error) {
                // Profile doesn't exist, create it as admin
                await supabase.from('profiles').insert({
                  id: session.user.id,
                  email: session.user.email,
                  full_name: session.user.user_metadata?.full_name || 'Admin',
                  is_admin: true
                });
                adminStatus = true;
                break;
              }
            } catch (e) {
              console.error('Profile fetch attempt', i + 1, 'failed');
              await new Promise(resolve => setTimeout(resolve, 300));
            }
          }
          
          if (isMounted) {
            setIsAdmin(adminStatus);
          }
        }
      } catch (err) {
        console.error('Auth init error:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', session.user.id)
            .maybeSingle();

          if (!error && data) {
            setIsAdmin(data.is_admin || false);
          } else if (!error) {
            await supabase.from('profiles').insert({
              id: session.user.id,
              email: session.user.email,
              full_name: session.user.user_metadata?.full_name || 'Admin',
              is_admin: true
            });
            setIsAdmin(true);
          }
        } else {
          setIsAdmin(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        
        // Check admin status after login
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', data.user.id)
          .maybeSingle();

        if (!profileError && profileData) {
          setIsAdmin(profileData.is_admin || false);
        } else if (!profileError) {
          // Profile doesn't exist, create it as admin
          await supabase.from('profiles').insert({
            id: data.user.id,
            email: data.user.email,
            full_name: data.user.user_metadata?.full_name || 'Admin',
            is_admin: true
          });
          setIsAdmin(true);
        }
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { error: error.message || 'Error al iniciar sesión' };
    }
  };

  const signUp = async (email: string, password: string, fullName: string): Promise<{ error: string | null }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { error: error.message || 'Error al registrarse' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isAdmin,
      isLoading,
      signIn,
      signUp,
      signOut,
      checkAdminStatus,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
