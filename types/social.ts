
export interface Connection {
  id: string;
  friendId: string;
  friendName: string;
  friendRole?: 'student' | 'tutor' | 'admin';
  status: 'pending' | 'accepted' | 'rejected';
  requestedAt: string;
  acceptedAt?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderRole?: 'student' | 'tutor' | 'admin';
  status: 'pending';
  timestamp: number;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  timestamp: number;
  actionPath?: string;
  type: 'connection' | 'message' | 'system' | 'task';
}
