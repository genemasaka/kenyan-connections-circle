
/**
 * Supabase Database Schema
 * 
 * This file documents the database tables needed for the application.
 * Run these SQL commands in the Supabase SQL Editor to set up your database.
 * 
 * Table: profiles
 * Description: Stores user profile information
 */

/*
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name VARCHAR NOT NULL,
  age INT NOT NULL,
  profession VARCHAR,
  interests TEXT[] DEFAULT '{}',
  looking_for TEXT,
  profile_photo VARCHAR,
  show_photo BOOLEAN DEFAULT TRUE,
  show_profession BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a secure RLS policy
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own profile
CREATE POLICY "Users can view own profile" 
  ON profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- Create policy for users to update their own profile
CREATE POLICY "Users can update own profile" 
  ON profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Create policy for users to insert their own profile
CREATE POLICY "Users can insert own profile" 
  ON profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create policy to allow users to view other profiles
CREATE POLICY "Users can view other profiles" 
  ON profiles 
  FOR SELECT 
  USING (true);  -- Everyone can view profiles

-- Create matches table
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id UUID REFERENCES profiles(id) NOT NULL,
  user2_id UUID REFERENCES profiles(id) NOT NULL,
  status VARCHAR NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

-- Create a secure RLS policy for matches
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own matches
CREATE POLICY "Users can view own matches" 
  ON matches 
  FOR SELECT 
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Create policy for users to create match requests
CREATE POLICY "Users can create match requests" 
  ON matches 
  FOR INSERT 
  WITH CHECK (auth.uid() = user1_id);

-- Create policy for users to update match status
CREATE POLICY "Users can update match status" 
  ON matches 
  FOR UPDATE 
  USING (auth.uid() = user2_id);  -- Only the recipient can accept/reject

-- Create messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES profiles(id) NOT NULL,
  receiver_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a secure RLS policy for messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own messages
CREATE POLICY "Users can view own messages" 
  ON messages 
  FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Create policy for users to send messages
CREATE POLICY "Users can send messages" 
  ON messages 
  FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);

-- Create policy for users to mark messages as read
CREATE POLICY "Users can mark messages as read" 
  ON messages 
  FOR UPDATE 
  USING (auth.uid() = receiver_id);

-- Create blocks table to track blocked users
CREATE TABLE blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blocker_id UUID REFERENCES profiles(id) NOT NULL,
  blocked_id UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(blocker_id, blocked_id)
);

-- Create a secure RLS policy for blocks
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own blocks
CREATE POLICY "Users can view own blocks" 
  ON blocks 
  FOR SELECT 
  USING (auth.uid() = blocker_id);

-- Create policy for users to create blocks
CREATE POLICY "Users can create blocks" 
  ON blocks 
  FOR INSERT 
  WITH CHECK (auth.uid() = blocker_id);

-- Create policy for users to delete blocks
CREATE POLICY "Users can delete blocks" 
  ON blocks 
  FOR DELETE 
  USING (auth.uid() = blocker_id);

-- Create storage buckets for profile photos
INSERT INTO storage.buckets (id, name) VALUES ('profile-photos', 'Profile Photos');

-- Set up storage permissions
CREATE POLICY "Anyone can view profile photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-photos');

CREATE POLICY "Authenticated users can upload profile photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-photos' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update own profile photos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'profile-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own profile photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'profile-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
*/
