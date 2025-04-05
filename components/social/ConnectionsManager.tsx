
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TabsContent } from '@/components/ui/tabs';
import { 
  getUserConnections, 
  getPendingFriendRequests,
  respondToFriendRequest,
  removeFriend
} from '@/services/socialService';
import { useToast } from '@/hooks/use-toast';
import { FriendRequest, Connection } from '@/types/social';
import { Check, X, UserX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUserById, getCurrentUserSync } from '@/services/authService';

const ConnectionsManager: React.FC = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [users, setUsers] = useState<Record<string, any>>({});
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Load initial data
  useEffect(() => {
    loadConnections();
    loadPendingRequests();
    
    // Listen for profile updates
    const handleProfileUpdate = () => {
      loadConnections();
      loadPendingRequests();
    };
    
    window.addEventListener('user-profile-updated', handleProfileUpdate);
    window.addEventListener('new-notification', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('user-profile-updated', handleProfileUpdate);
      window.removeEventListener('new-notification', handleProfileUpdate);
    };
  }, []);
  
  const loadConnections = () => {
    const userConnections = getUserConnections();
    setConnections(userConnections);
    
    // Preload user data for connections
    userConnections.forEach(async connection => {
      const userData = await getUserById(connection.friendId);
      if (userData) {
        setUsers(prev => ({
          ...prev,
          [connection.friendId]: userData
        }));
      }
    });
  };
  
  const loadPendingRequests = () => {
    const requests = getPendingFriendRequests();
    setPendingRequests(requests);
  };
  
  const handleAcceptRequest = (requestId: string) => {
    respondToFriendRequest(requestId, true);
    toast({
      title: "Friend request accepted",
      description: "You are now connected!"
    });
    loadConnections();
    loadPendingRequests();
  };
  
  const handleRejectRequest = (requestId: string) => {
    respondToFriendRequest(requestId, false);
    toast({
      title: "Friend request rejected",
      description: "The request has been declined"
    });
    loadPendingRequests();
  };
  
  const handleRemoveFriend = (friendId: string, friendName: string) => {
    removeFriend(friendId);
    toast({
      title: "Connection removed",
      description: `You are no longer connected with ${friendName}`
    });
    loadConnections();
  };
  
  const viewUserProfile = (userId: string) => {
    navigate(`/user-profile?id=${userId}`);
  };

  return (
    <TabsContent value="connections" className="space-y-8">
      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
            <CardDescription>People who want to connect with you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {request.senderName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <p className="font-medium">{request.senderName}</p>
                      <p className="text-sm text-gray-500">
                        {request.senderRole === 'tutor' ? 'Tutor' : 'Student'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1 text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300"
                      onClick={() => handleAcceptRequest(request.id)}
                    >
                      <Check size={16} />
                      Accept
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                      onClick={() => handleRejectRequest(request.id)}
                    >
                      <X size={16} />
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>My Connections</CardTitle>
          <CardDescription>People you've connected with</CardDescription>
        </CardHeader>
        <CardContent>
          {connections.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">You haven't connected with anyone yet</p>
              <Button variant="link" onClick={() => navigate('/tutors')}>
                Find tutors to connect with
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {connections.map((connection) => {
                const user = users[connection.friendId];
                return (
                  <div key={connection.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div 
                      className="flex items-center gap-3 cursor-pointer" 
                      onClick={() => viewUserProfile(connection.friendId)}
                    >
                      <Avatar>
                        <AvatarImage src={user?.profileImage} />
                        <AvatarFallback>
                          {connection.friendName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <p className="font-medium">{connection.friendName}</p>
                        <p className="text-sm text-gray-500">
                          {connection.friendRole === 'tutor' ? 'Tutor' : 'Student'}
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1 text-gray-600 hover:text-red-600 hover:border-red-200"
                      onClick={() => handleRemoveFriend(connection.friendId, connection.friendName)}
                    >
                      <UserX size={16} />
                      Remove
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default ConnectionsManager;
