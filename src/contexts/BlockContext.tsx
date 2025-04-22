
import React, { createContext, useState, useContext, useEffect } from "react";
import { User } from "@/lib/types";
import { BLOCKED_USERS, USERS } from "@/lib/mock-data";
import { useAuth } from "./AuthContext";
import { toast } from "@/components/ui/use-toast";

interface BlockContextType {
  blockedUsers: User[];
  isUserBlocked: (userId: string) => boolean;
  blockUser: (userId: string) => Promise<boolean>;
  unblockUser: (userId: string) => Promise<boolean>;
  reportUser: (userId: string, reason: string) => Promise<boolean>;
}

const BlockContext = createContext<BlockContextType | undefined>(undefined);

export const BlockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);
  
  useEffect(() => {
    // Load blocked users when user changes
    if (user) {
      fetchBlockedUsers();
    } else {
      setBlockedUserIds([]);
    }
  }, [user]);

  const fetchBlockedUsers = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, we would fetch blocked users from the backend
      setBlockedUserIds(BLOCKED_USERS);
    } catch (error) {
      console.error("Failed to fetch blocked users:", error);
    }
  };

  const blockUser = async (userId: string): Promise<boolean> => {
    try {
      if (!user) return false;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      setBlockedUserIds(prev => [...prev, userId]);
      
      toast({
        title: "User blocked",
        description: "You will no longer see this user or receive messages from them.",
      });
      
      return true;
    } catch (error) {
      console.error("Failed to block user:", error);
      toast({
        title: "Error",
        description: "Failed to block user. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const unblockUser = async (userId: string): Promise<boolean> => {
    try {
      if (!user) return false;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      setBlockedUserIds(prev => prev.filter(id => id !== userId));
      
      toast({
        title: "User unblocked",
        description: "You can now see and receive messages from this user again.",
      });
      
      return true;
    } catch (error) {
      console.error("Failed to unblock user:", error);
      toast({
        title: "Error",
        description: "Failed to unblock user. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const reportUser = async (userId: string, reason: string): Promise<boolean> => {
    try {
      if (!user) return false;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 700));
      
      toast({
        title: "User reported",
        description: "Thank you for your report. We'll review it shortly.",
      });
      
      return true;
    } catch (error) {
      console.error("Failed to report user:", error);
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const isUserBlocked = (userId: string): boolean => {
    return blockedUserIds.includes(userId);
  };

  const blockedUsers = USERS.filter(user => blockedUserIds.includes(user.id));

  return (
    <BlockContext.Provider
      value={{
        blockedUsers,
        isUserBlocked,
        blockUser,
        unblockUser,
        reportUser,
      }}
    >
      {children}
    </BlockContext.Provider>
  );
};

export const useBlock = () => {
  const context = useContext(BlockContext);
  if (context === undefined) {
    throw new Error("useBlock must be used within a BlockProvider");
  }
  return context;
};
