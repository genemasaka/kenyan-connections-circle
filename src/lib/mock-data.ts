
import { User, Match, Message } from "./types";

// Sample users
export const USERS: User[] = [
  {
    id: "u1",
    name: "Grace Kimani",
    email: "grace@example.com",
    age: 32,
    profession: "Software Engineer",
    interests: ["tech", "hiking", "reading", "travel"],
    lookingFor: "Looking to connect with like-minded professionals in the tech industry.",
    profilePhoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    profilePrivacy: {
      showPhoto: true,
      showProfession: true,
    },
  },
  {
    id: "u2",
    name: "Michelle Ochieng",
    email: "michelle@example.com",
    age: 29,
    profession: "Marketing Director",
    interests: ["marketing", "yoga", "cooking", "travel"],
    lookingFor: "Looking to expand my professional network in marketing and branding.",
    profilePhoto: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    profilePrivacy: {
      showPhoto: true,
      showProfession: true,
    },
  },
  {
    id: "u3",
    name: "Esther Mwangi",
    email: "esther@example.com",
    age: 35,
    profession: "Finance Analyst",
    interests: ["finance", "running", "cooking", "art"],
    lookingFor: "Seeking mentorship and networking opportunities in finance.",
    profilePhoto: "https://images.unsplash.com/photo-1607503873903-c5e95f80d7b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    profilePrivacy: {
      showPhoto: true,
      showProfession: false,
    },
  },
  {
    id: "u4",
    name: "Sophia Wangari",
    email: "sophia@example.com",
    age: 27,
    profession: "UX Designer",
    interests: ["design", "photography", "travel", "tech"],
    lookingFor: "Looking to collaborate with other designers and creative professionals.",
    profilePhoto: "https://images.unsplash.com/photo-1586298723528-6b82aab797c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    profilePrivacy: {
      showPhoto: true,
      showProfession: true,
    },
  },
  {
    id: "u5",
    name: "Joyce Njoroge",
    email: "joyce@example.com",
    age: 31,
    profession: "Business Consultant",
    interests: ["business", "reading", "hiking", "mentorship"],
    lookingFor: "Seeking to connect with entrepreneurs and business professionals for collaboration.",
    profilePhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    profilePrivacy: {
      showPhoto: false,
      showProfession: true,
    },
  },
];

// Current user - will be used to simulate authentication
export const CURRENT_USER_ID = "u1";

// Sample matches
export const MATCHES: Match[] = [
  {
    id: "m1",
    userId1: "u1",
    userId2: "u2",
    status: "accepted",
    createdAt: "2025-04-15T14:30:00Z",
  },
  {
    id: "m2",
    userId1: "u3",
    userId2: "u1",
    status: "accepted",
    createdAt: "2025-04-14T09:15:00Z",
  },
  {
    id: "m3",
    userId1: "u1",
    userId2: "u4",
    status: "pending",
    createdAt: "2025-04-16T11:45:00Z",
  },
];

// Sample messages
export const MESSAGES: Message[] = [
  {
    id: "msg1",
    senderId: "u1",
    receiverId: "u2",
    content: "Hello Michelle, I saw that you're in marketing. I'd love to chat about potential collaborations.",
    timestamp: "2025-04-15T15:30:00Z",
  },
  {
    id: "msg2",
    senderId: "u2",
    receiverId: "u1",
    content: "Hi Grace! Nice to connect. I'd be happy to discuss collaboration opportunities.",
    timestamp: "2025-04-15T15:45:00Z",
  },
  {
    id: "msg3",
    senderId: "u1",
    receiverId: "u2",
    content: "Great! Are you available for a virtual coffee next week?",
    timestamp: "2025-04-15T16:00:00Z",
  },
  {
    id: "msg4",
    senderId: "u3",
    receiverId: "u1",
    content: "Hi Grace, I noticed we share an interest in hiking. Do you have any favorite trails around Nairobi?",
    timestamp: "2025-04-14T10:00:00Z",
  },
];

// Blocked users
export const BLOCKED_USERS: string[] = [];
