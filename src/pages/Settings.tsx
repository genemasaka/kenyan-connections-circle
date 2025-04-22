
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBlock } from "@/contexts/BlockContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Ban, User, Eye, Settings as SettingsIcon } from "lucide-react";
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

const Settings = () => {
  const { user, updateUser, logout, isLoading } = useAuth();
  const { blockedUsers, unblockUser } = useBlock();
  const navigate = useNavigate();
  
  const [showPhoto, setShowPhoto] = useState(user?.profilePrivacy.showPhoto || true);
  const [showProfession, setShowProfession] = useState(user?.profilePrivacy.showProfession || true);
  const [settingsUpdated, setSettingsUpdated] = useState(false);
  const [userToUnblock, setUserToUnblock] = useState<string | null>(null);

  React.useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      setShowPhoto(user.profilePrivacy.showPhoto);
      setShowProfession(user.profilePrivacy.showProfession);
    }
  }, [user, navigate]);

  const handlePrivacyChange = async () => {
    if (!user) return;
    
    if (showPhoto === user.profilePrivacy.showPhoto && 
        showProfession === user.profilePrivacy.showProfession) {
      return; // No changes
    }
    
    const success = await updateUser({
      profilePrivacy: {
        showPhoto,
        showProfession,
      },
    });
    
    if (success) {
      setSettingsUpdated(true);
      setTimeout(() => setSettingsUpdated(false), 3000);
    }
  };

  const handleUnblockUser = async () => {
    if (userToUnblock) {
      await unblockUser(userToUnblock);
      setUserToUnblock(null);
    }
  };

  const handleDeleteAccount = () => {
    // In a real app, this would make an API call to delete the account
    logout();
    navigate("/");
  };

  if (!user) {
    return null; // Redirect handled in useEffect
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 flex items-center">
            <SettingsIcon className="mr-2 h-6 w-6" />
            Settings
          </h1>

          <div className="space-y-6">
            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Control what information is visible to other users.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="showPhoto">Show Profile Photo</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow others to see your profile photo
                    </p>
                  </div>
                  <Switch
                    id="showPhoto"
                    checked={showPhoto}
                    onCheckedChange={(checked) => {
                      setShowPhoto(checked);
                      setSettingsUpdated(false);
                    }}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="showProfession">Show Profession</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow others to see your profession
                    </p>
                  </div>
                  <Switch
                    id="showProfession"
                    checked={showProfession}
                    onCheckedChange={(checked) => {
                      setShowProfession(checked);
                      setSettingsUpdated(false);
                    }}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                {settingsUpdated && (
                  <p className="text-sm text-green-600">Settings updated successfully!</p>
                )}
                <div className="ml-auto">
                  <Button onClick={handlePrivacyChange} disabled={isLoading}>
                    Save Changes
                  </Button>
                </div>
              </CardFooter>
            </Card>

            {/* Blocked Users */}
            <Card>
              <CardHeader>
                <CardTitle>Blocked Users</CardTitle>
                <CardDescription>
                  Manage users you've blocked. Blocked users cannot see your profile or send you messages.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {blockedUsers.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <Ban className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>You haven't blocked any users.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {blockedUsers.map((blockedUser) => (
                      <div key={blockedUser.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            {blockedUser.profilePhoto ? (
                              <AvatarImage src={blockedUser.profilePhoto} alt={blockedUser.name} />
                            ) : (
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {blockedUser.name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{blockedUser.name}</h4>
                            <p className="text-sm text-gray-500">{blockedUser.profession}</p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setUserToUnblock(blockedUser.id)}
                        >
                          Unblock
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences and data.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => navigate("/profile")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button variant="outline" className="w-full" onClick={logout}>
                  Log Out
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteAccount}
                        className="bg-destructive text-destructive-foreground"
                      >
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <AlertDialog open={!!userToUnblock} onOpenChange={(open) => !open && setUserToUnblock(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unblock this user?</AlertDialogTitle>
            <AlertDialogDescription>
              This user will be able to see your profile and send you messages again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnblockUser}>
              Unblock User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Settings;
