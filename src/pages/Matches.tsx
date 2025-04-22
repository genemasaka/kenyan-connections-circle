
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMatch } from "@/contexts/MatchContext";
import { useBlock } from "@/contexts/BlockContext";
import Layout from "@/components/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User, Users, Heart, Ban, MessageSquare } from "lucide-react";
import { User as UserType } from "@/lib/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Matches = () => {
  const { user } = useAuth();
  const { 
    isLoading, 
    acceptedMatches,
    pendingMatches,
    sendMatchRequest, 
    acceptMatchRequest, 
    rejectMatchRequest, 
    getMatchedUsers, 
    getPendingUsers,
    getSuggestedUsers
  } = useMatch();
  const { isUserBlocked, blockUser } = useBlock();
  const navigate = useNavigate();

  const [expandedUsers, setExpandedUsers] = useState<string[]>([]);
  const [userToBlock, setUserToBlock] = useState<UserType | null>(null);

  React.useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const matchedUsers = getMatchedUsers();
  const pendingRequests = getPendingUsers();
  const suggestedUsers = getSuggestedUsers();

  const toggleUserExpanded = (userId: string) => {
    if (expandedUsers.includes(userId)) {
      setExpandedUsers(expandedUsers.filter(id => id !== userId));
    } else {
      setExpandedUsers([...expandedUsers, userId]);
    }
  };

  const isUserExpanded = (userId: string) => {
    return expandedUsers.includes(userId);
  };

  const handleAcceptMatch = async (matchId: string) => {
    await acceptMatchRequest(matchId);
  };

  const handleRejectMatch = async (matchId: string) => {
    await rejectMatchRequest(matchId);
  };

  const handleSendMatchRequest = async (userId: string) => {
    await sendMatchRequest(userId);
  };

  const handleBlockUser = async () => {
    if (userToBlock) {
      await blockUser(userToBlock.id);
      setUserToBlock(null);
    }
  };

  const openMessageWithUser = (userId: string) => {
    navigate(`/messages?user=${userId}`);
  };

  const renderUserCard = (user: UserType, type: "matched" | "pending" | "suggested") => {
    if (isUserBlocked(user.id)) {
      return null;
    }

    const isExpanded = isUserExpanded(user.id);
    const matchForUser = [...acceptedMatches, ...pendingMatches].find(
      match => (match.userId1 === user.id || match.userId2 === user.id)
    );
    
    return (
      <Card key={user.id} className="card-hover overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-2 border-primary/10">
                {user.profilePrivacy.showPhoto && user.profilePhoto ? (
                  <AvatarImage src={user.profilePhoto} alt={user.name} />
                ) : (
                  <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                    {user.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <CardTitle className="text-xl">{user.name}</CardTitle>
                <CardDescription>
                  {user.age} years old {user.profilePrivacy.showProfession && user.profession ? `• ${user.profession}` : ''}
                </CardDescription>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => toggleUserExpanded(user.id)}
              className="text-gray-500"
            >
              {isExpanded ? "Show less" : "Show more"}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pb-0">
          <div className="flex flex-wrap gap-1 mb-3">
            {user.interests.map((interest, index) => (
              <Badge key={index} variant="secondary" className="mr-1">
                {interest}
              </Badge>
            ))}
          </div>
          
          {isExpanded && (
            <div className="mt-3">
              <Separator className="my-2" />
              <h4 className="font-medium mb-1">Looking For</h4>
              <p className="text-gray-700 text-sm">{user.lookingFor}</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between pt-4">
          {type === "matched" && (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setUserToBlock(user)}
              >
                <Ban className="h-4 w-4 mr-1" /> Block
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => openMessageWithUser(user.id)}
                className="bg-primary"
              >
                <MessageSquare className="h-4 w-4 mr-1" /> Message
              </Button>
            </>
          )}
          
          {type === "pending" && matchForUser && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRejectMatch(matchForUser.id)}
              >
                Decline
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleAcceptMatch(matchForUser.id)}
                className="bg-primary"
              >
                <Heart className="h-4 w-4 mr-1" /> Accept
              </Button>
            </>
          )}
          
          {type === "suggested" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUserToBlock(user)}
              >
                <Ban className="h-4 w-4 mr-1" /> Block
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleSendMatchRequest(user.id)}
                className="bg-primary"
              >
                <Heart className="h-4 w-4 mr-1" /> Connect
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    );
  };

  if (!user) {
    return null; // Redirect handled in useEffect
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Find Connections</h1>

        <Tabs defaultValue="suggested" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="suggested" className="flex items-center">
              <Users className="h-4 w-4 mr-2" /> Suggested ({suggestedUsers.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center">
              <Heart className="h-4 w-4 mr-2" /> Pending ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="matched" className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" /> Matched ({matchedUsers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="suggested">
            {isLoading ? (
              <div className="text-center py-8">Loading suggested connections...</div>
            ) : suggestedUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-medium mb-2">No suggestions yet</h3>
                <p>Check back later for new connection suggestions.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suggestedUsers.map((suggestedUser) => 
                  renderUserCard(suggestedUser, "suggested")
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending">
            {isLoading ? (
              <div className="text-center py-8">Loading pending requests...</div>
            ) : pendingRequests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Heart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-medium mb-2">No pending requests</h3>
                <p>You don't have any pending connection requests at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingRequests.map((pendingUser) => 
                  renderUserCard(pendingUser, "pending")
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="matched">
            {isLoading ? (
              <div className="text-center py-8">Loading matches...</div>
            ) : matchedUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-medium mb-2">No matches yet</h3>
                <p>Start connecting with people to build your network.</p>
                <Button 
                  className="mt-4" 
                  onClick={() => {
                    const tabTrigger = document.querySelector('[data-state="inactive"][value="suggested"]') as HTMLButtonElement;
                    if (tabTrigger) tabTrigger.click();
                  }}
                >
                  Find People
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchedUsers.map((matchedUser) => 
                  renderUserCard(matchedUser, "matched")
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <AlertDialog open={!!userToBlock} onOpenChange={(open) => !open && setUserToBlock(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Block this user?</AlertDialogTitle>
            <AlertDialogDescription>
              {userToBlock?.name} will no longer be able to see your profile or send you messages.
              You can unblock them later from your settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBlockUser} className="bg-destructive text-destructive-foreground">
              Block User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Matches;
