
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Edit, User, Upload, Trash2 } from "lucide-react";
import { uploadProfilePhoto, deleteProfilePhoto } from "@/lib/fileUpload";
import { toast } from "@/components/ui/use-toast";

const Profile = () => {
  const { user, updateUser, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [age, setAge] = useState(user?.age.toString() || "");
  const [profession, setProfession] = useState(user?.profession || "");
  const [interests, setInterests] = useState(user?.interests.join(", ") || "");
  const [lookingFor, setLookingFor] = useState(user?.lookingFor || "");
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || "");
  const [showPhoto, setShowPhoto] = useState(user?.profilePrivacy.showPhoto || false);
  const [showProfession, setShowProfession] = useState(user?.profilePrivacy.showProfession || false);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  React.useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      // Initialize form with user data
      setName(user.name);
      setAge(user.age.toString());
      setProfession(user.profession);
      setInterests(user.interests.join(", "));
      setLookingFor(user.lookingFor);
      setProfilePhoto(user.profilePhoto || "");
      setShowPhoto(user.profilePrivacy.showPhoto);
      setShowProfession(user.profilePrivacy.showProfession);
    }
  }, [user, navigate]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Reset form to original values
    if (user) {
      setName(user.name);
      setAge(user.age.toString());
      setProfession(user.profession);
      setInterests(user.interests.join(", "));
      setLookingFor(user.lookingFor);
      setProfilePhoto(user.profilePhoto || "");
      setShowPhoto(user.profilePrivacy.showPhoto);
      setShowProfession(user.profilePrivacy.showProfession);
    }
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    const ageNum = parseInt(age, 10);
    const interestArray = interests.split(",").map(interest => interest.trim());
    
    const success = await updateUser({
      name,
      age: ageNum,
      profession,
      interests: interestArray,
      lookingFor,
      profilePhoto,
      profilePrivacy: {
        showPhoto,
        showProfession,
      },
    });
    
    if (success) {
      setIsEditing(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user) return;
    
    const file = e.target.files[0];
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    try {
      const photoUrl = await uploadProfilePhoto(file, user.id);
      setProfilePhoto(photoUrl);
    } catch (error) {
      console.error("Failed to upload photo:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload profile photo",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePhoto = async () => {
    if (!profilePhoto || !user) return;
    
    try {
      // Only try to delete from storage if it's a Supabase URL
      if (profilePhoto.includes('supabase')) {
        await deleteProfilePhoto(profilePhoto);
      }
      setProfilePhoto("");
    } catch (error) {
      console.error("Failed to delete photo:", error);
      toast({
        title: "Error",
        description: "Failed to remove profile photo",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return null; // Redirect handled in useEffect
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">My Profile</h1>
            {!isEditing && (
              <Button onClick={handleEdit} variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="relative group">
                  <Avatar className="w-24 h-24 border-2 border-primary/10">
                    {profilePhoto ? (
                      <AvatarImage src={profilePhoto} alt={user.name} />
                    ) : (
                      <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {isEditing && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-black/60 rounded-full w-full h-full flex flex-col items-center justify-center">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handlePhotoUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-white p-1"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                        {profilePhoto && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-white p-1"
                            onClick={handleRemovePhoto}
                            disabled={isUploading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <CardDescription>
                    {user.profession} • {user.age} years old
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        min="18"
                        max="100"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profession">Profession</Label>
                      <Input
                        id="profession"
                        value={profession}
                        onChange={(e) => setProfession(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="interests">Interests (comma-separated)</Label>
                      <Input
                        id="interests"
                        value={interests}
                        onChange={(e) => setInterests(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lookingFor">What are you looking for?</Label>
                    <Textarea
                      id="lookingFor"
                      value={lookingFor}
                      onChange={(e) => setLookingFor(e.target.value)}
                      required
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Privacy Settings</h3>
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
                        onCheckedChange={setShowPhoto}
                      />
                    </div>
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
                        onCheckedChange={setShowProfession}
                      />
                    </div>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.interests.map((interest, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Looking For</h3>
                    <p className="text-gray-700">{user.lookingFor}</p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-2">Privacy Settings</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${user.profilePrivacy.showPhoto ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span>Profile Photo: {user.profilePrivacy.showPhoto ? 'Visible to others' : 'Hidden from others'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${user.profilePrivacy.showProfession ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span>Profession: {user.profilePrivacy.showProfession ? 'Visible to others' : 'Hidden from others'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            {isEditing && (
              <CardFooter className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading || isUploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading || isUploading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
