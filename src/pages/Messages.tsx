
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMatch } from "@/contexts/MatchContext";
import { useMessage } from "@/contexts/MessageContext";
import Layout from "@/components/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, User, Users, ArrowLeft, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { User as UserType, Message } from "@/lib/types";
import { USERS } from "@/lib/mock-data";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Messages = () => {
  const { user } = useAuth();
  const { getMatchedUsers } = useMatch();
  const { messages, sendMessage, getMessagesWithUser } = useMessage();
  const navigate = useNavigate();
  const query = useQuery();
  
  const [newMessage, setNewMessage] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(query.get("user"));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const matchedUsers = getMatchedUsers();
  const selectedUser = selectedUserId 
    ? USERS.find(u => u.id === selectedUserId) || null
    : null;
  const userMessages = selectedUserId 
    ? getMessagesWithUser(selectedUserId)
    : [];

  useEffect(() => {
    // Scroll to bottom of messages
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [userMessages]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    // Set selected user from URL query param
    const userIdFromQuery = query.get("user");
    if (userIdFromQuery) {
      setSelectedUserId(userIdFromQuery);
    }
  }, [query]);

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
    // Update URL without reloading page
    navigate(`/messages?user=${userId}`, { replace: true });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUserId || !newMessage.trim()) return;
    
    const success = await sendMessage(selectedUserId, newMessage);
    if (success) {
      setNewMessage("");
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  if (!user) {
    return null; // Redirect handled in useEffect
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(80vh-100px)]">
          {/* Users List */}
          <div className={cn(
            "bg-white rounded-lg border overflow-hidden md:col-span-1",
            selectedUserId && "hidden md:block"
          )}>
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold flex items-center">
                <Users className="mr-2 h-5 w-5" /> Connections
              </h2>
            </div>
            
            <ScrollArea className="h-[calc(80vh-200px)]">
              {matchedUsers.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  <p>No connections yet.</p>
                  <Button 
                    variant="link" 
                    onClick={() => navigate("/matches")}
                    className="mt-2"
                  >
                    Find people to connect with
                  </Button>
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {matchedUsers.map((matchedUser) => {
                    const unreadCount = 0; // TODO: Implement unread messages
                    const isSelected = selectedUserId === matchedUser.id;
                    
                    return (
                      <div
                        key={matchedUser.id}
                        className={cn(
                          "flex items-center gap-3 rounded-md p-2 cursor-pointer",
                          isSelected 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-gray-100"
                        )}
                        onClick={() => handleSelectUser(matchedUser.id)}
                      >
                        <Avatar className="h-10 w-10">
                          {matchedUser.profilePrivacy.showPhoto && matchedUser.profilePhoto ? (
                            <AvatarImage src={matchedUser.profilePhoto} alt={matchedUser.name} />
                          ) : (
                            <AvatarFallback className={cn(
                              "text-sm",
                              isSelected ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground"
                            )}>
                              {matchedUser.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <span className="font-medium truncate">
                              {matchedUser.name}
                            </span>
                            {unreadCount > 0 && (
                              <Badge variant="destructive" className="ml-auto">
                                {unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className={cn(
                            "text-sm truncate",
                            isSelected ? "text-primary-foreground/80" : "text-gray-500"
                          )}>
                            {matchedUser.profilePrivacy.showProfession ? matchedUser.profession : "Professional"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Messages View */}
          <div className={cn(
            "bg-white rounded-lg border flex flex-col md:col-span-3",
            !selectedUserId && "hidden md:flex"
          )}>
            {!selectedUserId || !selectedUser ? (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-medium mb-2">No conversation selected</h3>
                  <p>Choose a connection to start messaging</p>
                </div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="md:hidden mr-1"
                      onClick={() => setSelectedUserId(null)}
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <Avatar className="h-10 w-10">
                      {selectedUser.profilePrivacy.showPhoto && selectedUser.profilePhoto ? (
                        <AvatarImage src={selectedUser.profilePhoto} alt={selectedUser.name} />
                      ) : (
                        <AvatarFallback className="text-sm bg-primary text-primary-foreground">
                          {selectedUser.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <h2 className="font-semibold">{selectedUser.name}</h2>
                      <p className="text-sm text-gray-500">
                        {selectedUser.profilePrivacy.showProfession ? selectedUser.profession : "Professional"}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate(`/profile/${selectedUser.id}`)}
                  >
                    <User className="h-4 w-4 mr-1" /> View Profile
                  </Button>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  {userMessages.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="font-medium mb-2">No messages yet</h3>
                        <p className="text-sm">Start the conversation with {selectedUser.name.split(" ")[0]}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userMessages.map((message, index) => {
                        const isCurrentUser = message.senderId === user.id;
                        const messageDate = new Date(message.timestamp);
                        const showDate = index === 0 || 
                          new Date(userMessages[index - 1].timestamp).toDateString() !== messageDate.toDateString();
                        
                        return (
                          <React.Fragment key={message.id}>
                            {showDate && (
                              <div className="flex justify-center my-4">
                                <Badge variant="outline" className="bg-gray-100">
                                  {new Date(message.timestamp).toLocaleDateString()}
                                </Badge>
                              </div>
                            )}
                            <div className={cn(
                              "flex",
                              isCurrentUser ? "justify-end" : "justify-start"
                            )}>
                              <div className={cn(
                                "max-w-[75%] rounded-lg px-4 py-2",
                                isCurrentUser 
                                  ? "bg-primary text-primary-foreground" 
                                  : "bg-gray-100 text-gray-800"
                              )}>
                                <p>{message.content}</p>
                                <p className={cn(
                                  "text-xs mt-1 text-right",
                                  isCurrentUser ? "text-primary-foreground/80" : "text-gray-500"
                                )}>
                                  {formatTime(message.timestamp)}
                                </p>
                              </div>
                            </div>
                          </React.Fragment>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
                  <Input
                    placeholder={`Message ${selectedUser.name.split(" ")[0]}...`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4 mr-1" /> Send
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
