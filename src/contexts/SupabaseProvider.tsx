
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface SupabaseContextType {
  session: Session | null;
  isLoading: boolean;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        // Use setTimeout to prevent any potential deadlocks with Supabase client
        setTimeout(() => {
          console.log("Auth state changed:", { event: _event, hasSession: !!newSession });
          setSession(newSession);
        }, 0);
      }
    );

    // Then check for existing session
    const getInitialSession = async () => {
      try {
        console.log("Checking for initial session...");
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting initial session:", error);
          throw error;
        }
        console.log("Initial session:", { hasSession: !!data.session });
        setSession(data.session);
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initialize by getting the user's session
    getInitialSession();

    // Cleanup on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    isLoading,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
