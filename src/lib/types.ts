
export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  profession: string;
  interests: string[];
  lookingFor: string;
  profilePhoto?: string;
  profilePrivacy: {
    showPhoto: boolean;
    showProfession: boolean;
  };
}

export interface Match {
  id: string;
  userId1: string;
  userId2: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

export interface BlockedUser {
  blockerId: string;
  blockedId: string;
}
