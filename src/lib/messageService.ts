
import { supabase } from "./supabase";
import { Message } from "./types";

export interface MessageResponse {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export const getMessages = async (otherUserId: string): Promise<Message[]> => {
  const { data: currentUser } = await supabase.auth.getUser();
  if (!currentUser.user) {
    throw new Error('No authenticated user');
  }

  const userId = currentUser.user.id;

  // Get all messages between current user and other user
  const { data: messagesData, error } = await supabase
    .from('messages')
    .select('*')
    .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }

  // Mark messages as read if I'm the receiver
  const unreadMessages = (messagesData as MessageResponse[])
    .filter(msg => msg.receiver_id === userId && !msg.is_read)
    .map(msg => msg.id);

  if (unreadMessages.length > 0) {
    const { error: updateError } = await supabase
      .from('messages')
      .update({ is_read: true })
      .in('id', unreadMessages);

    if (updateError) {
      console.error('Error marking messages as read:', updateError);
    }
  }

  // Transform to our Message type
  return (messagesData as MessageResponse[]).map(message => ({
    id: message.id,
    senderId: message.sender_id,
    receiverId: message.receiver_id,
    content: message.content,
    timestamp: message.created_at
  }));
};

export const sendMessage = async (receiverId: string, content: string): Promise<Message> => {
  const { data: currentUser } = await supabase.auth.getUser();
  if (!currentUser.user) {
    throw new Error('No authenticated user');
  }

  const senderId = currentUser.user.id;

  // First check if these users are matched
  const { data: matchData, error: matchError } = await supabase
    .from('matches')
    .select('*')
    .or(`and(user1_id.eq.${senderId},user2_id.eq.${receiverId}),and(user1_id.eq.${receiverId},user2_id.eq.${senderId})`)
    .eq('status', 'accepted')
    .maybeSingle();

  if (matchError) {
    console.error('Error checking match status:', matchError);
    throw matchError;
  }

  if (!matchData) {
    throw new Error('Cannot send message: users are not matched');
  }

  // Send the message
  const { data: messageData, error } = await supabase
    .from('messages')
    .insert({
      sender_id: senderId,
      receiver_id: receiverId,
      content,
      is_read: false
    })
    .select()
    .single();

  if (error) {
    console.error('Error sending message:', error);
    throw error;
  }

  // Transform to our Message type
  return {
    id: messageData.id,
    senderId: messageData.sender_id,
    receiverId: messageData.receiver_id,
    content: messageData.content,
    timestamp: messageData.created_at
  };
};

export const getUnreadMessageCount = async (): Promise<number> => {
  const { data: currentUser } = await supabase.auth.getUser();
  if (!currentUser.user) {
    return 0;
  }

  const userId = currentUser.user.id;

  // Get count of unread messages
  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('receiver_id', userId)
    .eq('is_read', false);

  if (error) {
    console.error('Error fetching unread message count:', error);
    return 0;
  }

  return count || 0;
};

export const getConversations = async (): Promise<{
  userId: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  profilePhoto?: string;
}[]> => {
  const { data: currentUser } = await supabase.auth.getUser();
  if (!currentUser.user) {
    return [];
  }

  const userId = currentUser.user.id;

  // First get all users I've exchanged messages with
  const { data: sentMessages, error: sentError } = await supabase
    .from('messages')
    .select('receiver_id')
    .eq('sender_id', userId)
    .order('created_at', { ascending: false });

  if (sentError) {
    console.error('Error fetching sent messages:', sentError);
    throw sentError;
  }

  const { data: receivedMessages, error: receivedError } = await supabase
    .from('messages')
    .select('sender_id')
    .eq('receiver_id', userId)
    .order('created_at', { ascending: false });

  if (receivedError) {
    console.error('Error fetching received messages:', receivedError);
    throw receivedError;
  }

  // Get unique user IDs
  const uniqueUserIds = Array.from(new Set([
    ...sentMessages.map(msg => msg.receiver_id),
    ...receivedMessages.map(msg => msg.sender_id)
  ]));

  // Get user profile information
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, name, profile_photo, show_photo')
    .in('id', uniqueUserIds);

  if (profilesError) {
    console.error('Error fetching profiles:', profilesError);
    throw profilesError;
  }

  // Build conversations data
  const conversations = await Promise.all(uniqueUserIds.map(async (otherUserId) => {
    // Get the last message between users
    const { data: lastMessageData, error: lastMessageError } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (lastMessageError) {
      console.error('Error fetching last message:', lastMessageError);
      return null;
    }

    // Get unread count
    const { count, error: countError } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('sender_id', otherUserId)
      .eq('receiver_id', userId)
      .eq('is_read', false);

    if (countError) {
      console.error('Error fetching unread count:', countError);
      return null;
    }

    // Find the profile information
    const profile = profiles.find(p => p.id === otherUserId);
    if (!profile) return null;

    return {
      userId: otherUserId,
      name: profile.name,
      lastMessage: lastMessageData.content,
      timestamp: lastMessageData.created_at,
      unreadCount: count || 0,
      profilePhoto: profile.show_photo ? profile.profile_photo : undefined
    };
  }));

  // Filter out null values and sort by timestamp
  return conversations
    .filter(convo => convo !== null) as any[]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};
