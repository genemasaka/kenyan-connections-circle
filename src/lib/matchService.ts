
import { supabase } from "./supabase";
import { Match, User } from "./types";

export interface MatchResponse {
  id: string;
  user1_id: string;
  user2_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export const getMatches = async (): Promise<Match[]> => {
  const { data: currentUser } = await supabase.auth.getUser();
  if (!currentUser.user) {
    throw new Error('No authenticated user');
  }

  const userId = currentUser.user.id;

  // Get all matches where the current user is involved
  const { data: matchesData, error } = await supabase
    .from('matches')
    .select('*')
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

  if (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }

  // Transform to our Match type
  return (matchesData as MatchResponse[]).map(match => ({
    id: match.id,
    userId1: match.user1_id,
    userId2: match.user2_id,
    status: match.status,
    createdAt: match.created_at
  }));
};

export const getSuggestedUsers = async (): Promise<User[]> => {
  const { data: currentUser } = await supabase.auth.getUser();
  if (!currentUser.user) {
    throw new Error('No authenticated user');
  }

  const userId = currentUser.user.id;

  // Get current user profile to access interests and age
  const { data: myProfile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileError) {
    console.error('Error fetching user profile:', profileError);
    throw profileError;
  }

  // Get existing matches and blocks to exclude them
  const { data: existingMatches, error: matchError } = await supabase
    .from('matches')
    .select('user1_id, user2_id')
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

  if (matchError) {
    console.error('Error fetching existing matches:', matchError);
    throw matchError;
  }

  const { data: blocks, error: blockError } = await supabase
    .from('blocks')
    .select('blocked_id')
    .eq('blocker_id', userId);

  if (blockError) {
    console.error('Error fetching blocks:', blockError);
    throw blockError;
  }

  // Users who I've blocked
  const blockedIds = blocks ? blocks.map(block => block.blocked_id) : [];
  
  // Users who have blocked me
  const { data: blockedBy, error: blockedByError } = await supabase
    .from('blocks')
    .select('blocker_id')
    .eq('blocked_id', userId);
    
  if (blockedByError) {
    console.error('Error fetching users who blocked me:', blockedByError);
    throw blockedByError;
  }
  
  const blockedByIds = blockedBy ? blockedBy.map(block => block.blocker_id) : [];
  
  // Combine all IDs to exclude from suggestions
  let excludeIds = [userId]; // Exclude self
  
  // Add matched users to exclude list
  if (existingMatches) {
    existingMatches.forEach(match => {
      if (match.user1_id === userId) {
        excludeIds.push(match.user2_id);
      } else {
        excludeIds.push(match.user1_id);
      }
    });
  }
  
  // Add blocked users and users who blocked me
  excludeIds = [...excludeIds, ...blockedIds, ...blockedByIds];
  
  // 5-year age range
  const minAge = myProfile.age - 5;
  const maxAge = myProfile.age + 5;
  
  // Query for potential matches based on age range and not already matched
  const { data: suggestedProfiles, error: suggestedError } = await supabase
    .from('profiles')
    .select('*')
    .gte('age', minAge)
    .lte('age', maxAge)
    .not('id', 'in', `(${excludeIds.join(',')})`);
    
  if (suggestedError) {
    console.error('Error fetching suggested profiles:', suggestedError);
    throw suggestedError;
  }
  
  // Convert to User type
  const suggestedUsers: User[] = suggestedProfiles.map(profile => ({
    id: profile.id,
    name: profile.name,
    email: '', // We don't expose emails
    age: profile.age,
    profession: profile.profession,
    interests: profile.interests,
    lookingFor: profile.looking_for,
    profilePhoto: profile.profile_photo,
    profilePrivacy: {
      showPhoto: profile.show_photo,
      showProfession: profile.show_profession,
    }
  }));
  
  // Filter for users with at least one common interest
  return suggestedUsers.filter(user => {
    const commonInterests = user.interests.filter(interest => 
      myProfile.interests.includes(interest)
    );
    
    return commonInterests.length > 0;
  });
};

export const sendMatchRequest = async (toUserId: string): Promise<void> => {
  const { data: currentUser } = await supabase.auth.getUser();
  if (!currentUser.user) {
    throw new Error('No authenticated user');
  }

  const fromUserId = currentUser.user.id;

  const { error } = await supabase
    .from('matches')
    .insert({
      user1_id: fromUserId,
      user2_id: toUserId,
      status: 'pending'
    });

  if (error) {
    console.error('Error sending match request:', error);
    throw error;
  }
};

export const acceptMatchRequest = async (matchId: string): Promise<void> => {
  const { error } = await supabase
    .from('matches')
    .update({ status: 'accepted' })
    .eq('id', matchId);

  if (error) {
    console.error('Error accepting match request:', error);
    throw error;
  }
};

export const rejectMatchRequest = async (matchId: string): Promise<void> => {
  const { error } = await supabase
    .from('matches')
    .update({ status: 'rejected' })
    .eq('id', matchId);

  if (error) {
    console.error('Error rejecting match request:', error);
    throw error;
  }
};

export const blockUser = async (userId: string): Promise<void> => {
  const { data: currentUser } = await supabase.auth.getUser();
  if (!currentUser.user) {
    throw new Error('No authenticated user');
  }

  const blockerId = currentUser.user.id;

  const { error } = await supabase
    .from('blocks')
    .insert({
      blocker_id: blockerId,
      blocked_id: userId
    });

  if (error) {
    console.error('Error blocking user:', error);
    throw error;
  }
};

export const unblockUser = async (userId: string): Promise<void> => {
  const { data: currentUser } = await supabase.auth.getUser();
  if (!currentUser.user) {
    throw new Error('No authenticated user');
  }

  const blockerId = currentUser.user.id;

  const { error } = await supabase
    .from('blocks')
    .delete()
    .eq('blocker_id', blockerId)
    .eq('blocked_id', userId);

  if (error) {
    console.error('Error unblocking user:', error);
    throw error;
  }
};

export const getBlockedUsers = async (): Promise<string[]> => {
  const { data: currentUser } = await supabase.auth.getUser();
  if (!currentUser.user) {
    return [];
  }

  const blockerId = currentUser.user.id;

  const { data, error } = await supabase
    .from('blocks')
    .select('blocked_id')
    .eq('blocker_id', blockerId);

  if (error) {
    console.error('Error fetching blocked users:', error);
    throw error;
  }

  return data.map(block => block.blocked_id);
};
