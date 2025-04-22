
import React, { createContext, useState, useContext, useEffect } from "react";
import { User } from "@/lib/types";
import { USERS, CURRENT_USER_ID } from "@/lib/mock-data";
import { toast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User>, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate checking for stored auth token
    const checkAuth = async () => {
      try {
        // In a real app, we'd verify a token here
        const storedUserId = localStorage.getItem("userId");
        
        if (storedUserId) {
          // Simulate API call to get user data
          const foundUser = USERS.find(u => u.id === storedUserId);
          if (foundUser) {
            setUser(foundUser);
          } else {
            localStorage.removeItem("userId");
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("userId");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate login API request with a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, we would validate credentials against the backend
      const foundUser = USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (foundUser) {
        // In a real app, we'd verify the password hash here
        setUser(foundUser);
        localStorage.setItem("userId", foundUser.id);
        toast({
          title: "Login successful",
          description: `Welcome back, ${foundUser.name}!`,
        });
        return true;
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password.",
          variant: "destructive",
        });
        return false;
      }
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
      // Simulate registration API request with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, we would send registration data to the backend
      // and receive a newly created user
      const emailExists = USERS.some(u => u.email.toLowerCase() === userData.email?.toLowerCase());
      
      if (emailExists) {
        toast({
          title: "Registration failed",
          description: "An account with this email already exists.",
          variant: "destructive",
        });
        return false;
      }
      
      // For this mock implementation, we'll just fake success
      toast({
        title: "Registration successful",
        description: "Your account has been created!",
      });
      
      // In a real app, we would log the user in after registration
      // or ask them to verify their email
      return true;
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userId");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API request with a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, we would send updated data to the backend
      if (user) {
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
        });
        return true;
      }
      return false;
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
