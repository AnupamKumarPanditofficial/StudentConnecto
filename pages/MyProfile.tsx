import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Edit2, Save, Clock, Award, Book, Calendar, Users, Bookmark, FileText, Flame, CreditCard, CheckCircle, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUserSync, updateUserProfile, getUserById } from '@/services/authService';
import { useNavigate } from 'react-router-dom';
import ProfileImageUploader from '@/components/common/ProfileImageUploader';
import ConnectionsManager from '@/components/social/ConnectionsManager';
import ChatInterface from '@/components/social/ChatInterface';
import { getUserConnections, type Connection } from '@/services/socialService';
import { User } from '@/types/user';
import { useAuthState } from '@/hooks/useAuthState';

interface ProfileDataState {
  name: string;
  nickname: string;
  email: string;
  bio: string;
  education: string;
  subjects: string[];
  role: string;
  social: {
    instagram: string;
    twitter: string;
    linkedin: string;
  };
}

const MyProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeChatWithUser, setActiveChatWithUser] = useState<Connection | null>(null);
  const { user } = useAuthState();
  
  const [userStats, setUserStats] = useState({
    streak: 0,
    points: 0,
    tasksCompleted: 0,
    earnings: 0
  });
  
  const [connections, setConnections] = useState<Connection[]>([]);

  const [profileData, setProfileData] = useState<ProfileDataState>({
    name: '',
    nickname: '',
    email: '',
    bio: '',
    education: 'High School',
    subjects: ['Mathematics', 'Physics', 'Chemistry'],
    role: 'student',
    social: {
      instagram: '',
      twitter: '',
      linkedin: ''
    }
  });
  
  const [transactions, setTransactions] = useState([
    { id: 'tx1', date: '2023-10-15', amount: 750, status: 'completed', taskTitle: 'Physics Assignment Solution' },
    { id: 'tx2', date: '2023-09-28', amount: 500, status: 'completed', taskTitle: 'Mathematics Homework Help' },
    { id: 'tx3', date: '2023-09-05', amount: 1200, status: 'completed', taskTitle: 'Chemistry Lab Report' },
  ]);
  
  const loadConnections = () => {
    const userConnections = getUserConnections();
    setConnections(userConnections);
  };
  
  const startChat = (connection: Connection) => {
    setActiveChatWithUser(connection);
  };
  
  const closeChat = () => {
    setActiveChatWithUser(null);
  };
  
  useEffect(() => {
    const currentUser = getCurrentUserSync();
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view your profile",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    setCurrentUser(currentUser);
    
    setProfileData(prev => {
      const updatedSocial = {
        instagram: currentUser.social?.instagram || '',
        twitter: currentUser.social?.twitter || '',
        linkedin: currentUser.social?.linkedin || ''
      };

      return {
        ...prev,
        name: currentUser.name || prev.name,
        email: currentUser.email || prev.email,
        nickname: currentUser.nickname || currentUser.name?.split(' ')[0] || prev.nickname,
        role: currentUser.role || prev.role,
        education: currentUser.education || prev.education,
        bio: currentUser.bio || prev.bio,
        social: updatedSocial
      };
    });

    try {
      const statsData = localStorage.getItem(`user_stats_${currentUser.id}`);
      if (statsData) {
        setUserStats(JSON.parse(statsData));
      } else {
        const initialStats = {
          streak: 0,
          points: 0,
          tasksCompleted: 0,
          earnings: 0
        };
        localStorage.setItem(`user_stats_${currentUser.id}`, JSON.stringify(initialStats));
        setUserStats(initialStats);
      }
    } catch (error) {
      console.error("Error loading user stats:", error);
    }
    
    loadConnections();

    const handleProfileUpdated = () => {
      const updatedUser = getCurrentUserSync();
      setCurrentUser(updatedUser);
      loadConnections();
    };

    window.addEventListener('user-profile-updated', handleProfileUpdated);
    window.addEventListener('new-notification', handleProfileUpdated);

    return () => {
      window.removeEventListener('user-profile-updated', handleProfileUpdated);
      window.removeEventListener('new-notification', handleProfileUpdated);
    };
  }, [navigate, toast]);
  
  const handleSaveProfile = () => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      name: profileData.name,
      nickname: profileData.nickname,
      bio: profileData.bio,
      education: profileData.education,
      social: profileData.social
    };

    updateUserProfile(updatedUser);

    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
    });

    setIsEditing(false);
    setCurrentUser(updatedUser);

    window.dispatchEvent(new CustomEvent('user-profile-updated'));
  };
  
  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSocialChange = (platform: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      social: {
        ...prev.social,
        [platform]: value
      }
    }));
  };
  
  const handlePaymentSubmit = () => {
    if (!upiId) {
      toast({
        title: "Missing UPI ID",
        description: "Please enter your UPI ID to continue",
        variant: "destructive"
      });
      return;
    }
    
    if (!paymentAmount || Number(paymentAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }
    
    const platformFee = Number(paymentAmount) * 0.018; // 1.8% platform fee
    const finalAmount = Number(paymentAmount) - platformFee;
    
    toast({
      title: "Payment Initiated",
      description: `₹${finalAmount.toFixed(2)} will be transferred to your UPI ID after a platform fee of ₹${platformFee.toFixed(2)}`,
    });
    
    const newTransaction = {
      id: `tx${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      amount: Number(paymentAmount),
      status: 'processing',
      taskTitle: 'Recent Withdrawal'
    };
    
    setTransactions([newTransaction, ...transactions]);
    
    setShowPaymentDialog(false);
    setUpiId('');
    setPaymentAmount('');
  };
  
  const toggleTransactionHistory = () => {
    setShowTransactionHistory(!showTransactionHistory);
  };
  
  const streakGoal = 30; // Days
  const streakProgress = Math.min(100, (userStats.streak / streakGoal) * 100);

  if (!currentUser) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <div className="text-center">Loading profile...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout neomorphicBackground>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center md:text-left relative">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-education-600 to-education-800">My Profile</span>
          <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-education-500 to-education-700 rounded-full md:block hidden"></div>
        </h1>
        
        {activeChatWithUser ? (
          <div className="mb-8">
            <ChatInterface 
              friendId={activeChatWithUser.friendId}
              friendName={activeChatWithUser.friendName}
              onClose={closeChat}
            />
          </div>
        ) : null}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <Card neomorphic variant="primary" className="overflow-hidden transform hover:translate-y-[-5px] transition-all duration-300">
              <CardHeader className="text-center pb-2 relative">
                <div className="mx-auto mb-4 relative group">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-education-300 to-education-500 blur-md opacity-70 group-hover:opacity-100 transition-opacity"></div>
                  <ProfileImageUploader 
                    currentImage={currentUser?.profileImage} 
                    name={currentUser?.name || 'User'} 
                    size="lg"
                  />
                </div>
                <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-education-700 to-education-500">{profileData.name}</CardTitle>
                <CardDescription className="text-education-600 font-medium">@{profileData.nickname}</CardDescription>
                <div className="mt-3">
                  <Badge variant="outline" className="bg-gradient-to-r from-education-50 to-education-100 text-education-700 border-education-200">
                    {profileData.role === 'student' ? 'Student' : 'Tutor'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mt-4 space-y-6">
                  <div className="text-center">
                    <p className="text-gray-600 italic">{profileData.bio || 'No bio yet. Edit your profile to add one!'}</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center pt-4">
                    <div className="flex flex-col items-center transform hover:scale-105 transition-transform">
                      <div className="flex items-center text-xl text-gray-800">
                        <Flame size={20} className="mr-1 text-orange-500 animate-pulse" />
                        <span className="font-bold">{userStats.streak}</span>
                      </div>
                      <div className="text-sm text-gray-500">Day Streak</div>
                    </div>
                    <div className="transform hover:scale-105 transition-transform">
                      <div className="font-bold text-xl text-gray-800">{userStats.points}</div>
                      <div className="text-sm text-gray-500">Points</div>
                    </div>
                    <div className="transform hover:scale-105 transition-transform">
                      <div className="font-bold text-xl text-gray-800">{userStats.tasksCompleted}</div>
                      <div className="text-sm text-gray-500">Tasks</div>
                    </div>
                  </div>
                  
                  <div className="px-2">
                    <div className="flex justify-between mb-1 text-xs font-medium">
                      <span>Streak Progress</span>
                      <span>{userStats.streak}/{streakGoal} days</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${streakProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5">
                      Keep your daily streak to earn bonus points!
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-600 mb-2.5 hover:text-education-600 transition-colors">
                      <Calendar size={16} className="mr-2 text-education-400" />
                      <span>Joined {currentUser?.joinDate ? new Date(currentUser?.joinDate).toLocaleDateString() : "Recently"}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2.5 hover:text-education-600 transition-colors">
                      <Book size={16} className="mr-2 text-education-400" />
                      <span>{profileData.education}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 hover:text-education-600 transition-colors">
                      <Users size={16} className="mr-2 text-education-400" />
                      <span>{profileData.role === 'student' ? 'Student' : 'Tutor'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card neomorphic className="transform hover:translate-y-[-5px] transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg text-education-700">Subjects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profileData.subjects.map((subject, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="px-3 py-1.5 bg-gradient-to-r from-education-100 to-education-200 text-education-700 border border-education-200 hover:bg-education-200 transition-colors transform hover:scale-105"
                    >
                      {subject}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card neomorphic variant="accent" className="transform hover:translate-y-[-5px] transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-emerald-700">
                  <CreditCard size={18} className="mr-2 text-emerald-600" />
                  Payment & Earnings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-5 rounded-lg text-center shadow-sm transform hover:scale-105 transition-transform">
                  <div className="text-2xl font-bold text-emerald-700">₹{userStats.earnings.toLocaleString()}</div>
                  <div className="text-sm text-emerald-600">Total Earnings</div>
                </div>
                
                <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all duration-300 border-none text-white">
                      Withdraw to Google Pay
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white rounded-xl p-6 shadow-2xl border-none max-w-md w-full">
                    <DialogHeader className="text-center">
                      <div className="flex justify-center mb-4">
                        <div className="relative w-24 h-24">
                          <div className="absolute inset-0 bg-blue-500 rounded-full opacity-10 animate-pulse"></div>
                          <svg className="w-full h-full" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#4285F4" d="M24.4 23h16.2c.2 1.1.4 2.2.4 3.5 0 7-4.7 12.2-11.6 12.2-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.2l-3.3 3.2c-1.3-1.2-2.9-1.9-4.7-1.9-3.9 0-7.2 3.2-7.2 7.4s3.2 7.4 7.2 7.4c3.3 0 5.7-2 6.8-4.8h-6.8V23z" />
                          </svg>
                        </div>
                        <div className="flex flex-col justify-center ml-2">
                          <span className="text-3xl font-bold text-blue-600">Pay</span>
                        </div>
                      </div>
                      <DialogTitle className="text-xl text-gray-800">Withdraw Your Earnings</DialogTitle>
                      <DialogDescription className="text-gray-600">
                        Enter your UPI ID and amount to withdraw via Google Pay
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-5 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="upi-id" className="text-gray-700">UPI ID or Mobile Number</Label>
                        <Input 
                          id="upi-id" 
                          placeholder="username@upi" 
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          neomorphic
                          className="transition-all duration-300 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="amount" className="text-gray-700">Amount (₹)</Label>
                        <Input 
                          id="amount" 
                          type="number" 
                          placeholder="Enter amount" 
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          neomorphic
                          className="transition-all duration-300 focus:ring-blue-500"
                        />
                      </div>
                      
                      {paymentAmount && Number(paymentAmount) > 0 && (
                        <Alert className="bg-blue-50 border border-blue-200 text-blue-800">
                          <AlertTitle>Payment Summary</AlertTitle>
                          <AlertDescription className="space-y-2 mt-2">
                            <div className="flex justify-between">
                              <span>Amount:</span>
                              <span>₹{Number(paymentAmount).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-blue-600">
                              <span>Platform Fee (1.8%):</span>
                              <span>-₹{(Number(paymentAmount) * 0.018).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold pt-1 border-t border-blue-200">
                              <span>You'll Receive:</span>
                              <span>₹{(Number(paymentAmount) - Number(paymentAmount) * 0.018).toFixed(2)}</span>
                            </div>
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                    
                    <DialogFooter className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:space-x-3">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowPaymentDialog(false)}
                        className="border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors w-full sm:w-auto"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handlePaymentSubmit} 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 w-full sm:w-auto"
                      >
                        Confirm Payment
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <div className="flex justify-between items-center">
                  <div className="text-xs text-emerald-600">
                    A 1.8% platform fee applies to all withdrawals.
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={toggleTransactionHistory}
                    className="text-xs bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  >
                    {showTransactionHistory ? "Hide History" : "View History"}
                  </Button>
                </div>
                
                {showTransactionHistory && (
                  <div className="mt-4 space-y-3 max-h-60 overflow-y-auto pr-1">
                    <h4 className="text-sm font-medium text-emerald-800">Recent Transactions</h4>
                    {transactions.length > 0 ? (
                      transactions.map(tx => (
                        <div 
                          key={tx.id} 
                          className="bg-white rounded-lg p-3 shadow-sm border border-emerald-100 text-sm"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{tx.taskTitle}</div>
                              <div className="text-xs text-gray-500">{tx.date}</div>
                            </div>
                            <div className="font-semibold text-emerald-700">
                              ₹{tx.amount.toLocaleString()}
                            </div>
                          </div>
                          <div className="mt-1 flex items-center">
                            <span className={`inline-block w-2 h-2 rounded-full ${tx.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'} mr-1.5`}></span>
                            <span className="text-xs capitalize text-gray-600">{tx.status}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-3 text-gray-500 text-sm">
                        No transactions yet
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Tabs defaultValue="activity" className="w-full">
              <TabsList className="grid grid-cols-4 mb-8 bg-white shadow-neomorphic p-1 rounded-lg">
                <TabsTrigger 
                  value="activity" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-education-500 data-[state=active]:to-education-600 data-[state=active]:text-white rounded-md transition-all duration-300 data-[state=active]:shadow-md"
                >
                  Activity
                </TabsTrigger>
                <TabsTrigger 
                  id="connections-tab-trigger"
                  value="connections" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-education-500 data-[state=active]:to-education-600 data-[state=active]:text-white rounded-md transition-all duration-300 data-[state=active]:shadow-md"
                >
                  Connections
                </TabsTrigger>
                <TabsTrigger 
                  value="saved" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-education-500 data-[state=active]:to-education-600 data-[state=active]:text-white rounded-md transition-all duration-300 data-[state=active]:shadow-md"
                >
                  Saved
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-education-500 data-[state=active]:to-education-600 data-[state=active]:text-white rounded-md transition-all duration-300 data-[state=active]:shadow-md"
                >
                  Settings
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="activity" className="space-y-6 mt-2">
                <Card neomorphic className="transform hover:translate-y-[-5px] transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl text-education-700">Recent Activity</CardTitle>
                    <CardDescription>Your latest interactions on StudentConnect</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userStats.tasksCompleted > 0 ? (
                      <div className="space-y-6">
                        <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="mt-1 bg-blue-100 p-2 rounded-full">
                            <Clock size={20} className="text-blue-500" />
                          </div>
                          <div>
                            <h4 className="text-base font-medium text-gray-800">Completed Task: Calculus Quiz</h4>
                            <p className="text-sm text-gray-500">Yesterday at 3:45 PM • Scored 92%</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="mt-1 bg-yellow-100 p-2 rounded-full">
                            <Award size={20} className="text-yellow-500" />
                          </div>
                          <div>
                            <h4 className="text-base font-medium text-gray-800">Earned Badge: 10-Day Streak</h4>
                            <p className="text-sm text-gray-500">3 days ago • +100 points</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Clock className="h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-xl font-medium text-gray-600 mb-2">No Recent Activity</h3>
                        <p className="text-gray-500 max-w-sm">
                          Complete tasks, participate in discussions, and earn points to see your activity here.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <ConnectionsManager />
              
              <TabsContent value="saved" className="space-y-6 mt-2">
                <Card neomorphic className="transform hover:translate-y-[-5px] transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl text-education-700">Saved Items</CardTitle>
                    <CardDescription>Your bookmarked resources and content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Bookmark className="h-16 w-16 text-gray-300 mb-4" />
                      <h3 className="text-xl font-medium text-gray-600 mb-2">No Saved Items</h3>
                      <p className="text-gray-500 max-w-sm">
                        Bookmark articles, videos, and resources to access them quickly later.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings" className="mt-2">
                <Card neomorphic className="transform hover:translate-y-[-5px] transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-xl text-education-700">Profile Settings</CardTitle>
                      <CardDescription>Update your profile information</CardDescription>
                    </div>
                    <Button 
                      variant={isEditing ? "default" : "outline"} 
                      onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                      className={
                        isEditing 
                          ? "bg-gradient-to-r from-education-500 to-education-600 hover:from-education-600 hover:to-education-700 transition-all duration-300 shadow-md hover:shadow-lg" 
                          : "border-education-200 text-education-700 hover:bg-education-50 transition-colors"
                      }
                    >
                      {isEditing ? (
                        <><Save size={16} className="mr-2" /> Save</>
                      ) : (
                        <><Edit2 size={16} className="mr-2" /> Edit</>
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                          <Input 
                            id="name" 
                            value={profileData.name} 
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            disabled={!isEditing}
                            neomorphic={isEditing}
                            className="transition-all duration-300 focus:ring-education-500"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="nickname" className="text-gray-700">Nickname</Label>
                          <Input 
                            id="nickname" 
                            value={profileData.nickname} 
                            onChange={(e) => handleInputChange('nickname', e.target.value)}
                            disabled={!isEditing}
                            neomorphic={isEditing}
                            className="transition-all duration-300 focus:ring-education-500"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={profileData.email} 
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={true}
                          className="transition-all duration-300 focus:ring-education-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio" className="text-gray-700">Bio</Label>
                        <Textarea 
                          id="bio" 
                          value={profileData.bio} 
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          disabled={!isEditing}
                          className={`transition-all duration-300 focus:ring-education-500 ${isEditing ? 'shadow-neomorphic-inset bg-gray-50 border-none' : ''}`}
                          rows={3}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="education" className="text-gray-700">Education</Label>
                        <Select 
                          disabled={!isEditing} 
                          value={profileData.education}
                          onValueChange={(value) => handleInputChange('education', value)}
                        >
                          <SelectTrigger className={`transition-all duration-300 ${isEditing ? 'shadow-neomorphic bg-white hover:shadow-neomorphic-hover border-none' : ''}`}>
                            <SelectValue placeholder="Select education level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="High School">High School</SelectItem>
                            <SelectItem value="Higher Secondary">Higher Secondary</SelectItem>
                            <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                            <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                            <SelectItem value="Ph.D">Ph.D</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="pt-5 border-t border-gray-100">
                        <h4 className="text-base font-medium text-gray-800 mb-4">Social Media</h4>
                        <div className="space-y-5">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="space-y-2">
                              <Label htmlFor="instagram" className="text-gray-700">Instagram</Label>
                              <Input 
                                id="instagram" 
                                value={profileData.social.instagram} 
                                onChange={(e) => handleSocialChange('instagram', e.target.value)}
                                disabled={!isEditing}
                                neomorphic={isEditing}
                                placeholder="Username"
                                className="transition-all duration-300 focus:ring-education-500"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="twitter" className="text-gray-700">Twitter</Label>
                              <Input 
                                id="twitter" 
                                value={profileData.social.twitter} 
                                onChange={(e) => handleSocialChange('twitter', e.target.value)}
                                disabled={!isEditing}
                                neomorphic={isEditing}
                                placeholder="Username"
                                className="transition-all duration-300 focus:ring-education-500"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="linkedin" className="text-gray-700">LinkedIn</Label>
                              <Input 
                                id="linkedin" 
                                value={profileData.social.linkedin} 
                                onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                                disabled={!isEditing}
                                neomorphic={isEditing}
                                placeholder="Username"
                                className="transition-all duration-300 focus:ring-education-500"
                              />
                            </div>
                          </div>
                        </div>
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

export default MyProfile;
