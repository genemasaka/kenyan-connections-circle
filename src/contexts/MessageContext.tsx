
import React, { createContext, useState, useContext, useEffect } from "react";
import { Message, User } from "@/lib/types";
import { MESSAGES } from "@/lib/mock-data";
import { useAuth } from "./AuthContext";
import { toast } from "@/components/ui/use-toast";

interface MessageContextType {
  messages: Record<string, Message[]>; // User ID -> messages
  isLoading: boolean;
  sendMessage: (receiverId: string, content: string) => Promise<boolean>;
  getMessagesWithUser: (userId: string) => Message[];
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load messages when user changes
    if (user) {
      fetchMessages();
    } else {
      setMessages({});
      setIsLoading(false);
    }
  }, [user]);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to fetch messages
      await new Promise(resolve => setTimeout(resolve, 700));
      
      if (user) {
        // In a real app, we would fetch messages from the backend
        // Filter messages involving the current user
        const userMessages = MESSAGES.filter(
          message => message.senderId === user.id || message.receiverId === user.id
        );
        
        // Group messages by the other user involved
        const groupedMessages: Record<string, Message[]> = {};
        
        userMessages.forEach(message => {
          const otherUserId = message.senderId === user.id ? message.receiverId : message.senderId;
          
          if (!groupedMessages[otherUserId]) {
            groupedMessages[otherUserId] = [];
          }
          
          groupedMessages[otherUserId].push(message);
        });
        
        // Sort messages by timestamp
        Object.keys(groupedMessages).forEach(userId => {
          groupedMessages[userId].sort((a, b) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
        });
        
        setMessages(groupedMessages);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (receiverId: string, content: string): Promise<boolean> => {
    try {
      if (!user || !content.trim()) return false;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Create a new message
      const newMessage: Message = {
        id: `msg${Date.now()}`,
        senderId: user.id,
        receiverId,
        content,
        timestamp: new Date().toISOString(),
      };
      
      // Update local state
      setMessages(prev => {
        const updatedMessages = { ...prev };
        
        if (!updatedMessages[receiverId]) {
          updatedMessages[receiverId] = [];
        }
        
        updatedMessages[receiverId] = [...updatedMessages[receiverId], newMessage];
        
        return updatedMessages;
      });
      
      return true;
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const getMessagesWithUser = (userId: string): Message[] => {
    return messages[userId] || [];
  };

  return (
    <MessageContext.Provider
      value={{
        messages,
        isLoading,
        sendMessage,
        getMessagesWithUser,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error("useMessage must be used within a MessageProvider");
  }
  return context;
};
