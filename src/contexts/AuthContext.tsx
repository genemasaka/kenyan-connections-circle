
// Only updating the login function to ensure it properly handles loading state and errors
import React, { createContext, useState, useContext, useEffect } from "react";
import { User } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User>, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
  bypassAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is already logged in with Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking auth:", error);
          setIsLoading(false);
          return;
        }
        
        if (session) {
          // Get user profile data from the profiles table
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) {
            console.error("Error fetching profile:", profileError);
            setIsLoading(false);
            return;
          }
          
          if (profileData) {
            // Transform Supabase profile to our User type
            const userData: User = {
              id: profileData.id,
              name: profileData.name || '',
              email: session.user.email || '',
              age: profileData.age || 25,
              profession: profileData.profession || '',
              interests: profileData.interests || [],
              lookingFor: profileData.looking_for || '',
              profilePhoto: profileData.profile_photo || '',
              profilePrivacy: {
                showPhoto: profileData.show_photo || true,
                showProfession: profileData.show_profession || true,
              },
            };
            
            setUser(userData);
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Setup auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null);
        } else if (event === 'SIGNED_IN' && session) {
          setIsLoading(true);
          
          // Get user profile data
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileError && profileError.code !== 'PGRST116') {
            console.error("Error fetching profile:", profileError);
            setIsLoading(false);
            return;
          }
          
          if (profileData) {
            // Transform Supabase profile to our User type
            const userData: User = {
              id: profileData.id,
              name: profileData.name || '',
              email: session.user.email || '',
              age: profileData.age || 25,
              profession: profileData.profession || '',
              interests: profileData.interests || [],
              lookingFor: profileData.looking_for || '',
              profilePhoto: profileData.profile_photo || '',
              profilePrivacy: {
                showPhoto: profileData.show_photo || true,
                showProfession: profileData.show_profession || true,
              },
            };
            
            setUser(userData);
          }
          
          setIsLoading(false);
        }
      }
    );
    
    // Check auth status on component mount
    checkAuth();
    
    // Cleanup listener on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast({
          title: "Login failed",
          description: error.message || "Invalid email or password.",
          variant: "destructive",
        });
        return false;
      }
      
      if (data.user) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        title: "Login failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User>, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Register with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: userData.email || '',
        password: password,
      });
      
      if (error) {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      
      if (data.user) {
        // Create profile in the profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name: userData.name || '',
            age: userData.age || 25,
            profession: userData.profession || '',
            interests: userData.interests || [],
            looking_for: userData.lookingFor || '',
            profile_photo: userData.profilePhoto || '',
            show_photo: userData.profilePrivacy?.showPhoto || true,
            show_profession: userData.profilePrivacy?.showProfession || true,
          });
        
        if (profileError) {
          console.error("Profile creation failed:", profileError);
          toast({
            title: "Profile creation failed",
            description: "Your account was created but setting up your profile failed.",
            variant: "destructive",
          });
          // Even if profile creation fails, the registration still succeeded
        }
        
        toast({
          title: "Registration successful",
          description: "Your account has been created! Please verify your email.",
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Registration failed:", error);
      toast({
        title: "Registration failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Logout failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (!user) return false;
      
      // Update profile in the profiles table
      const { error } = await supabase
        .from('profiles')
        .update({
          name: userData.name,
          age: userData.age,
          profession: userData.profession,
          interests: userData.interests,
          looking_for: userData.lookingFor,
          profile_photo: userData.profilePhoto,
          show_photo: userData.profilePrivacy?.showPhoto,
          show_profession: userData.profilePrivacy?.showProfession,
        })
        .eq('id', user.id);
      
      if (error) {
        console.error("Profile update failed:", error);
        toast({
          title: "Update failed",
          description: "An error occurred. Please try again.",
          variant: "destructive",
        });
        return false;
      }
      
      // Update local user state
      setUser(prev => prev ? { ...prev, ...userData } : null);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      
      return true;
    } catch (error) {
      console.error("Profile update failed:", error);
      toast({
        title: "Update failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Used for testing - create a bypass login
  const bypassAuth = () => {
    // Create a mock user for testing
    const testUser: User = {
      id: "test-user-id",
      name: "Test User",
      email: "test@example.com",
      age: 30,
      profession: "Software Developer",
      interests: ["technology", "reading", "travel"],
      lookingFor: "Looking for networking opportunities",
      profilePhoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      profilePrivacy: {
        showPhoto: true,
        showProfession: true,
      },
    };
    
    setUser(testUser);
    
    toast({
      title: "Test Mode",
      description: "Logged in as Test User for testing",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        bypassAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
