
import { supabase } from '@/lib/supabase';
import { Message, User } from '@/lib/types';

export interface MessageData {
  id?: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at?: string;
  is_read?: boolean;
}

export interface ConversationSummary {
  userId: string;
  userName: string;
  userPhoto: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

/**
 * Sends a message from one user to another
 */
export const sendMessage = async (
  senderId: string,
  receiverId: string,
  content: string
): Promise<Message | null> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        content,
        is_read: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      return null;
    }

    return {
      id: data.id,
      senderId: data.sender_id,
      receiverId: data.receiver_id,
      content: data.content,
      timestamp: new Date(data.created_at).toISOString(),
      read: data.is_read,
    };
  } catch (error) {
    console.error('Error sending message:', error);
    return null;
  }
};

/**
 * Gets all messages between two users
 */
export const getConversation = async (
  userId1: string,
  userId2: string
): Promise<Message[]> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId1},sender_id.eq.${userId2}`)
      .or(`receiver_id.eq.${userId1},receiver_id.eq.${userId2}`)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching conversation:', error);
      return [];
    }

    // Filter to only include messages between these two users
    const filteredMessages = data.filter(
      (msg) =>
        (msg.sender_id === userId1 && msg.receiver_id === userId2) ||
        (msg.sender_id === userId2 && msg.receiver_id === userId1)
    );

    return filteredMessages.map((msg) => ({
      id: msg.id,
      senderId: msg.sender_id,
      receiverId: msg.receiver_id,
      content: msg.content,
      timestamp: new Date(msg.created_at).toISOString(),
      read: msg.is_read,
    }));
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return [];
  }
};

/**
 * Marks all messages from a specific sender to a specific receiver as read
 */
export const markMessagesAsRead = async (
  senderId: string,
  receiverId: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('sender_id', senderId)
      .eq('receiver_id', receiverId)
      .eq('is_read', false);

    if (error) {
      console.error('Error marking messages as read:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return false;
  }
};

/**
 * Gets all conversations for a user with the last message and unread count
 */
export const getConversationList = async (
  userId: string
): Promise<ConversationSummary[]> => {
  try {
    // Get all messages where the user is either sender or receiver
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
      return [];
    }

    // Get unique conversation partners
    const conversationPartners = new Set<string>();
    messages.forEach((msg) => {
      if (msg.sender_id === userId) {
        conversationPartners.add(msg.receiver_id);
      } else {
        conversationPartners.add(msg.sender_id);
      }
    });

    // Get user details for all conversation partners
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, name, profile_photo')
      .in('id', Array.from(conversationPartners));

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return [];
    }

    // Create a map of user IDs to user details
    const userMap = new Map<string, { name: string; photo: string }>();
    profiles.forEach((profile) => {
      userMap.set(profile.id, {
        name: profile.name || 'Unknown User',
        photo: profile.profile_photo || '',
      });
    });

    // Create conversation summaries
    const conversations: ConversationSummary[] = [];
    const processedPartners = new Set<string>();

    for (const partnerId of conversationPartners) {
      // Skip if already processed
      if (processedPartners.has(partnerId)) continue;
      processedPartners.add(partnerId);

      // Get all messages between user and this partner
      const conversationMessages = messages.filter(
        (msg) =>
          (msg.sender_id === userId && msg.receiver_id === partnerId) ||
          (msg.sender_id === partnerId && msg.receiver_id === userId)
      );

      if (conversationMessages.length === 0) continue;

      // Get the last message
      const lastMessage = conversationMessages[0]; // Already sorted by created_at desc

      // Count unread messages from partner to user
      const unreadCount = conversationMessages.filter(
        (msg) => msg.sender_id === partnerId && msg.receiver_id === userId && !msg.is_read
      ).length;

      const partnerDetails = userMap.get(partnerId) || {
        name: 'Unknown User',
        photo: '',
      };

      conversations.push({
        userId: partnerId,
        userName: partnerDetails.name,
        userPhoto: partnerDetails.photo,
        lastMessage: lastMessage.content,
        lastMessageTime: new Date(lastMessage.created_at).toISOString(),
        unreadCount,
      });
    }

    // Sort by last message time (newest first)
    return conversations.sort((a, b) =>
      new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
    );
  } catch (error) {
    console.error('Error getting conversation list:', error);
    return [];
  }
};

/**
 * Gets the total number of unread messages for a user
 */
export const getUnreadMessageCount = async (userId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Error counting unread messages:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Error counting unread messages:', error);
    return 0;
  }
};

/**
 * Deletes a message by ID
 */
export const deleteMessage = async (messageId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (error) {
      console.error('Error deleting message:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting message:', error);
    return false;
  }
};

/**
 * Sets up a real-time subscription for new messages
 */
export const subscribeToMessages = (
  userId: string,
  callback: (message: Message) => void
) => {
  const subscription = supabase
    .channel('messages')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${userId}`,
      },
      (payload) => {
        const newMessage = payload.new as MessageData;
        callback({
          id: newMessage.id || '',
          senderId: newMessage.sender_id,
          receiverId: newMessage.receiver_id,
          content: newMessage.content,
          timestamp: new Date(newMessage.created_at || Date.now()).toISOString(),
          read: newMessage.is_read || false,
        });
      }
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(subscription);
  };
};
