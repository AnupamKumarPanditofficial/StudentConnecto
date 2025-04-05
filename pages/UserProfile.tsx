
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, GraduationCap, Clock, BookOpen, MessageSquare, UserPlus, UserCheck } from 'lucide-react';
import { getUserById, getCurrentUserSync, User } from '@/services/authService';
import { getUserConnections, sendFriendRequest, removeFriend } from '@/services/socialService';
import { Connection } from '@/types/social';
import { useToast } from '@/hooks/use-toast';
import { useAuthCheck } from '@/hooks/useAuthCheck';

const UserProfile: React.FC = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('id');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'pending' | 'connected'>('none');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuth } = useAuthCheck();

  useEffect(() => {
    const loadUserData = async () => {
      if (!userId) {
        setError("User ID is required");
        setIsLoading(false);
        return;
      }

      // Load user data
      const userData = await getUserById(userId);
      
      if (userData) {
        setUser(userData);
        
        // Check if we are connected to this user
        const currentUser = getCurrentUserSync();
        if (currentUser) {
          const connections = getUserConnections();
          const isConnected = connections.some(conn => conn.friendId === userId);
          
          if (isConnected) {
            setConnectionStatus('connected');
          } else {
            // In a real app, we would check for pending requests here
            setConnectionStatus('none');
          }
        }
        
        setIsLoading(false);
      } else {
        setError("User not found");
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [userId]);

  const handleConnect = () => {
    const success = checkAuth('connect with this user', () => {
      if (!user) return;
      
      const result = sendFriendRequest(user.id, user.name);
      
      if (result) {
        toast({
          title: "Connection request sent",
          description: `A connection request has been sent to ${user.name}`
        });
        
        setConnectionStatus('pending');
      } else {
        toast({
          title: "Request failed",
          description: "Could not send connection request. You might already have a pending request or connection.",
          variant: "destructive"
        });
      }
    });
    
    if (!success) {
      // The auth check handles showing the appropriate message/modal
    }
  };
  
  const handleDisconnect = () => {
    if (!user) return;
    
    const result = removeFriend(user.id);
    
    if (result) {
      toast({
        title: "Connection removed",
        description: `You are no longer connected with ${user.name}`
      });
      
      setConnectionStatus('none');
    } else {
      toast({
        title: "Action failed",
        description: "Could not remove the connection",
        variant: "destructive"
      });
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4 min-h-screen">
          <div className="text-center">Loading user profile...</div>
        </div>
      </Layout>
    );
  }
  
  if (error || !user) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4 min-h-screen">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-red-600">{error || "Error loading user profile"}</h2>
                <Button 
                  className="mt-4" 
                  onClick={() => navigate(-1)}
                >
                  Go Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{user.name}'s Profile</h1>
          <p className="text-lg text-gray-600">
            {user.role === 'tutor' ? 'Tutor' : 'Student'} Profile
          </p>
        </div>
        
        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="mb-4">
                  <Avatar className="h-32 w-32 border-4 border-white shadow-md">
                    <AvatarImage src={user.profileImage || undefined} />
                    <AvatarFallback className="text-4xl bg-education-100 text-education-600">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-gray-600 text-sm">{user.email}</p>
                
                <div className="w-full mt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-education-600" />
                      <span className="text-gray-600">Joined</span>
                    </div>
                    <span className="font-medium">
                      {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  
                  {user.location && (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-education-600" />
                        <span className="text-gray-600">Location</span>
                      </div>
                      <span className="font-medium">{user.location}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm">
                      <GraduationCap className="h-4 w-4 mr-2 text-education-600" />
                      <span className="text-gray-600">Role</span>
                    </div>
                    <span className="font-medium capitalize">{user.role}</span>
                  </div>
                </div>
                
                {/* Connection Button - only show if looking at another user's profile */}
                {getCurrentUserSync()?.id !== user.id && (
                  <div className="w-full mt-6">
                    {connectionStatus === 'none' && (
                      <Button 
                        variant="outline" 
                        className="w-full border-education-200 text-education-700 hover:bg-education-50"
                        onClick={handleConnect}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    )}
                    
                    {connectionStatus === 'pending' && (
                      <Button 
                        variant="outline" 
                        className="w-full border-gray-200 text-gray-500" 
                        disabled
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Request Pending
                      </Button>
                    )}
                    
                    {connectionStatus === 'connected' && (
                      <Button 
                        variant="outline" 
                        className="w-full border-green-200 text-green-700 hover:bg-green-50"
                        onClick={handleDisconnect}
                      >
                        <UserCheck className="h-4 w-4 mr-2" />
                        Connected
                      </Button>
                    )}
                  </div>
                )}
                
                {/* Message Button - for future implementation */}
                <Button 
                  variant="default" 
                  className="w-full mt-3 bg-education-600 hover:bg-education-700"
                  disabled={true} // Disabled until messaging is implemented
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div>
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About {user.name}</CardTitle>
                    <CardDescription>
                      {user.role === 'tutor' ? 'Tutor profile and expertise' : 'Student profile and interests'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-2">Bio</h3>
                        <p className="text-gray-600">
                          {user.bio || (
                            user.role === 'tutor'
                              ? `${user.name} is a tutor on StudentConnect.`
                              : `${user.name} is a student on StudentConnect.`
                          )}
                        </p>
                      </div>
                      
                      {user.role === 'tutor' && (
                        <>
                          <div>
                            <h3 className="font-medium mb-2">Expertise</h3>
                            <div className="flex flex-wrap gap-2">
                              <span className="bg-education-100 text-education-700 px-3 py-1 rounded-full text-sm">Mathematics</span>
                              <span className="bg-education-100 text-education-700 px-3 py-1 rounded-full text-sm">Physics</span>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="font-medium mb-2">Education</h3>
                            <div className="space-y-2">
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="font-medium">M.Sc in Mathematics</p>
                                <p className="text-sm text-gray-600">Delhi University, 2018-2020</p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="activities" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                    <CardDescription>
                      {user.name}'s recent activities on StudentConnect
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="text-center py-8">
                        <BookOpen className="h-12 w-12 mx-auto text-gray-300" />
                        <p className="mt-2 text-gray-500">No recent activities to show</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
