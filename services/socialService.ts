
import { v4 as uuidv4 } from 'uuid';
import { getCurrentUserSync } from './authService';
import type { Connection, FriendRequest, ChatMessage, Notification } from '@/types/social';

// Get current user's connections
export const getUserConnections = (): Connection[] => {
  const currentUser = getCurrentUserSync();
  if (!currentUser) return [];
  
  const connectionsStr = localStorage.getItem('user_connections');
  if (!connectionsStr) return [];
  
  const allConnections: Connection[] = JSON.parse(connectionsStr);
  return allConnections.filter(conn => conn.status === 'accepted');
};

// Send friend request
export const sendFriendRequest = (friendId: string, friendName: string): boolean => {
  try {
    const currentUser = getCurrentUserSync();
    if (!currentUser) return false;
    
    // Check if already connected or request pending
    const connections = getAllConnections();
    const existingConnection = connections.find(
      conn => 
        (conn.friendId === friendId && conn.status === 'pending') ||
        (conn.friendId === friendId && conn.status === 'accepted')
    );
    
    if (existingConnection) return false;
    
    // Create new connection request
    const newConnection: Connection = {
      id: uuidv4(),
      friendId,
      friendName,
      status: 'pending',
      requestedAt: new Date().toISOString()
    };
    
    // Save to localStorage
    connections.push(newConnection);
    localStorage.setItem('user_connections', JSON.stringify(connections));
    
    // Create friend request notification for the other user
    const newRequest: FriendRequest = {
      id: uuidv4(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      status: 'pending',
      timestamp: Date.now()
    };
    
    // Save to localStorage (in a real app, this would go to a database)
    const requestsStr = localStorage.getItem('friend_requests') || '[]';
    const requests: FriendRequest[] = JSON.parse(requestsStr);
    requests.push(newRequest);
    localStorage.setItem('friend_requests', JSON.stringify(requests));
    
    return true;
  } catch (error) {
    console.error('Error sending friend request:', error);
    return false;
  }
};

// Get all connections (for internal use)
export const getAllConnections = (): Connection[] => {
  const connectionsStr = localStorage.getItem('user_connections');
  return connectionsStr ? JSON.parse(connectionsStr) : [];
};

// Check connection status
export const getConnectionStatus = (friendId: string): 'none' | 'pending' | 'connected' => {
  const currentUser = getCurrentUserSync();
  if (!currentUser) return 'none';
  
  const connections = getAllConnections();
  const connection = connections.find(conn => conn.friendId === friendId);
  
  if (!connection) return 'none';
  return connection.status === 'accepted' ? 'connected' : 'pending';
};

// Remove friend
export const removeFriend = (friendId: string): boolean => {
  try {
    const currentUser = getCurrentUserSync();
    if (!currentUser) return false;
    
    const connections = getAllConnections();
    const updatedConnections = connections.filter(conn => conn.friendId !== friendId);
    
    localStorage.setItem('user_connections', JSON.stringify(updatedConnections));
    return true;
  } catch (error) {
    console.error('Error removing friend:', error);
    return false;
  }
};

// Get pending friend requests
export const getPendingFriendRequests = (): FriendRequest[] => {
  const currentUser = getCurrentUserSync();
  if (!currentUser) return [];
  
  const requestsStr = localStorage.getItem('friend_requests') || '[]';
  const allRequests: FriendRequest[] = JSON.parse(requestsStr);
  
  return allRequests.filter(req => req.status === 'pending');
};

// Respond to friend request
export const respondToFriendRequest = (
  requestId: string,
  accept: boolean
): boolean => {
  try {
    const currentUser = getCurrentUserSync();
    if (!currentUser) return false;
    
    // Get the request
    const requestsStr = localStorage.getItem('friend_requests') || '[]';
    const requests: FriendRequest[] = JSON.parse(requestsStr);
    
    const requestIndex = requests.findIndex(r => r.id === requestId);
    if (requestIndex === -1) return false;
    
    const request = requests[requestIndex];
    
    if (accept) {
      // Create connection
      const newConnection: Connection = {
        id: uuidv4(),
        friendId: request.senderId,
        friendName: request.senderName,
        friendRole: request.senderRole,
        status: 'accepted',
        requestedAt: new Date(request.timestamp).toISOString(),
        acceptedAt: new Date().toISOString()
      };
      
      // Save to connections
      const connections = getAllConnections();
      connections.push(newConnection);
      localStorage.setItem('user_connections', JSON.stringify(connections));
    }
    
    // Remove request
    requests.splice(requestIndex, 1);
    localStorage.setItem('friend_requests', JSON.stringify(requests));
    
    return true;
  } catch (error) {
    console.error('Error responding to friend request:', error);
    return false;
  }
};

// Get messages with a specific user
export const getChatMessages = (friendId: string): ChatMessage[] => {
  const currentUser = getCurrentUserSync();
  if (!currentUser) return [];
  
  // Generate a unique chat ID based on both user IDs (sorted to ensure consistency)
  const chatId = [currentUser.id, friendId].sort().join('_');
  
  const messagesStr = localStorage.getItem(`chat_${chatId}`) || '[]';
  return JSON.parse(messagesStr);
};

// Send a message to a user
export const sendChatMessage = (
  friendId: string,
  content: string
): ChatMessage | null => {
  try {
    const currentUser = getCurrentUserSync();
    if (!currentUser) return null;
    
    // Generate a unique chat ID based on both user IDs (sorted to ensure consistency)
    const chatId = [currentUser.id, friendId].sort().join('_');
    
    const newMessage: ChatMessage = {
      id: uuidv4(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      content,
      timestamp: Date.now()
    };
    
    // Get existing messages
    const messagesStr = localStorage.getItem(`chat_${chatId}`) || '[]';
    const messages: ChatMessage[] = JSON.parse(messagesStr);
    
    // Add new message
    messages.push(newMessage);
    
    // Save updated messages
    localStorage.setItem(`chat_${chatId}`, JSON.stringify(messages));
    
    return newMessage;
  } catch (error) {
    console.error('Error sending message:', error);
    return null;
  }
};

// Get user notifications
export const getUserNotifications = (): Notification[] => {
  const currentUser = getCurrentUserSync();
  if (!currentUser) return [];
  
  // Get notifications for the current user specifically
  const notificationsStr = localStorage.getItem(`notifications_${currentUser.id}`);
  if (!notificationsStr) return [];
  
  const notifications: Notification[] = JSON.parse(notificationsStr);
  
  // Only return notifications that belong to this user
  const userNotifications = notifications.filter(n => n.userId === currentUser.id);
  
  return userNotifications.sort((a, b) => b.timestamp - a.timestamp);
};

// Mark a notification as read
export const markNotificationAsRead = (notificationId: string): boolean => {
  try {
    const currentUser = getCurrentUserSync();
    if (!currentUser) return false;
    
    const notificationsStr = localStorage.getItem(`notifications_${currentUser.id}`);
    if (!notificationsStr) return false;
    
    const notifications: Notification[] = JSON.parse(notificationsStr);
    
    const updatedNotifications = notifications.map(notif => {
      if (notif.id === notificationId && notif.userId === currentUser.id) {
        return { ...notif, read: true };
      }
      return notif;
    });
    
    localStorage.setItem(`notifications_${currentUser.id}`, JSON.stringify(updatedNotifications));
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
};

// Subscribe to notifications (in a real app, this would use WebSockets or similar)
export const subscribeToNotifications = (
  callback: (notifications: Notification[]) => void
): (() => void) => {
  // Create event handler
  const handleNotificationUpdate = () => {
    const notifications = getUserNotifications();
    callback(notifications);
  };
  
  // Add event listener
  window.addEventListener('notification-update', handleNotificationUpdate);
  
  // Return unsubscribe function
  return () => {
    window.removeEventListener('notification-update', handleNotificationUpdate);
  };
};

// Export all types for use in other modules
export type { Connection, FriendRequest, ChatMessage, Notification };
