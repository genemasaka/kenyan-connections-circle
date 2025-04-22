
import React, { createContext, useState, useContext, useEffect } from "react";
import { Match, User } from "@/lib/types";
import { MATCHES, USERS, CURRENT_USER_ID } from "@/lib/mock-data";
import { useAuth } from "./AuthContext";
import { toast } from "@/components/ui/use-toast";

interface MatchContextType {
  matches: Match[];
  pendingMatches: Match[];
  acceptedMatches: Match[];
  suggestedUsers: User[];
  isLoading: boolean;
  sendMatchRequest: (userId: string) => Promise<boolean>;
  acceptMatchRequest: (matchId: string) => Promise<boolean>;
  rejectMatchRequest: (matchId: string) => Promise<boolean>;
  getMatchedUsers: () => User[];
  getPendingUsers: () => User[];
  getSuggestedUsers: () => User[];
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filter matches based on status
  const pendingMatches = matches.filter(match => match.status === "pending");
  const acceptedMatches = matches.filter(match => match.status === "accepted");

  useEffect(() => {
    // Load matches when user changes
    if (user) {
      fetchMatches();
      fetchSuggestedUsers();
    } else {
      setMatches([]);
      setSuggestedUsers([]);
      setIsLoading(false);
    }
  }, [user]);

  const fetchMatches = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to fetch matches
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, we would fetch matches from the backend
      if (user) {
        const userMatches = MATCHES.filter(
          match => match.userId1 === user.id || match.userId2 === user.id
        );
        setMatches(userMatches);
      }
    } catch (error) {
      console.error("Failed to fetch matches:", error);
      toast({
        title: "Error",
        description: "Failed to load matches. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedUsers = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to fetch suggested users
      await new Promise(resolve => setTimeout(resolve, 700));
      
      if (user) {
        // Filter out already matched and current user
        const matchedUserIds = MATCHES
          .filter(m => m.userId1 === user.id || m.userId2 === user.id)
          .map(m => m.userId1 === user.id ? m.userId2 : m.userId1);
        
        // Basic matching algorithm:
        // 1. Not the current user
        // 2. Not already matched
        // 3. Age within 5 years
        // 4. At least one common interest
        const suggested = USERS.filter(otherUser => {
          if (otherUser.id === user.id) return false;
          if (matchedUserIds.includes(otherUser.id)) return false;
          
          // Check age range (within 5 years)
          const ageDiff = Math.abs(otherUser.age - user.age);
          if (ageDiff > 5) return false;
          
          // Check for at least one common interest
          const hasCommonInterest = otherUser.interests.some(interest => 
            user.interests.includes(interest)
          );
          
          return hasCommonInterest;
        });
        
        setSuggestedUsers(suggested);
      }
    } catch (error) {
      console.error("Failed to fetch suggested users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMatchRequest = async (userId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (user) {
        // In a real app, we would send a match request to the backend
        const newMatch: Match = {
          id: `m${Date.now()}`,
          userId1: user.id,
          userId2: userId,
          status: "pending",
          createdAt: new Date().toISOString(),
        };
        
        // Update local state
        setMatches(prev => [...prev, newMatch]);
        
        toast({
          title: "Match request sent!",
          description: "They'll be notified of your interest.",
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to send match request:", error);
      toast({
        title: "Error",
        description: "Failed to send match request. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const acceptMatchRequest = async (matchId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, we would send an accept request to the backend
      setMatches(prev => 
        prev.map(match => 
          match.id === matchId ? { ...match, status: "accepted" } : match
        )
      );
      
      toast({
        title: "Match accepted!",
        description: "You can now message each other.",
      });
      
      return true;
    } catch (error) {
      console.error("Failed to accept match:", error);
      toast({
        title: "Error",
        description: "Failed to accept match. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const rejectMatchRequest = async (matchId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, we would send a reject request to the backend
      setMatches(prev => 
        prev.map(match => 
          match.id === matchId ? { ...match, status: "rejected" } : match
        )
      );
      
      toast({
        title: "Match declined",
        description: "The request has been declined.",
      });
      
      return true;
    } catch (error) {
      console.error("Failed to reject match:", error);
      toast({
        title: "Error",
        description: "Failed to decline match. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions to get users from match IDs
  const getMatchedUsers = (): User[] => {
    if (!user) return [];
    
    return acceptedMatches
      .map(match => {
        const matchedUserId = match.userId1 === user.id ? match.userId2 : match.userId1;
        return USERS.find(u => u.id === matchedUserId);
      })
      .filter((user): user is User => user !== undefined);
  };

  const getPendingUsers = (): User[] => {
    if (!user) return [];
    
    return pendingMatches
      .filter(match => match.userId2 === user.id) // Only show requests TO this user
      .map(match => {
        const requestingUserId = match.userId1;
        return USERS.find(u => u.id === requestingUserId);
      })
      .filter((user): user is User => user !== undefined);
  };

  const getSuggestedUsers = (): User[] => {
    return suggestedUsers;
  };

  return (
    <MatchContext.Provider
      value={{
        matches,
        pendingMatches,
        acceptedMatches,
        suggestedUsers,
        isLoading,
        sendMatchRequest,
        acceptMatchRequest,
        rejectMatchRequest,
        getMatchedUsers,
        getPendingUsers,
        getSuggestedUsers,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
};

export const useMatch = () => {
  const context = useContext(MatchContext);
  if (context === undefined) {
    throw new Error("useMatch must be used within a MatchProvider");
  }
  return context;
};
