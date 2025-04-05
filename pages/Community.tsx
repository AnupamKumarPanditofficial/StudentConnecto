
import React, { useState, useRef, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Send,
  Smile,
  Paperclip,
  Image,
  FileText,
  MoreVertical,
  Search,
  Settings,
  Users,
  ChevronRight,
  ArrowLeft,
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for groups
const groups = [
  {
    id: 'g1',
    name: 'Class 12 - CBSE',
    avatar: 'https://ui-avatars.com/api/?name=12+CBSE&background=36B37E&color=fff',
    members: 345,
    lastMessage: 'Can someone share the Physics notes from today?',
    lastMessageTime: '5:23 PM',
    unreadCount: 3,
    type: 'class',
    category: 'CBSE',
  },
  {
    id: 'g2',
    name: 'JEE Aspirants',
    avatar: 'https://ui-avatars.com/api/?name=JEE&background=6554C0&color=fff',
    members: 678,
    lastMessage: 'Has anyone solved the mock test yet?',
    lastMessageTime: '2:45 PM',
    unreadCount: 0,
    type: 'exam',
    category: 'JEE',
  },
  {
    id: 'g3',
    name: 'Class 10 - ICSE',
    avatar: 'https://ui-avatars.com/api/?name=10+ICSE&background=FF5630&color=fff',
    members: 234,
    lastMessage: 'Math assignment solutions for chapter 5?',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    type: 'class',
    category: 'ICSE',
  },
  {
    id: 'g4',
    name: 'NEET Discussions',
    avatar: 'https://ui-avatars.com/api/?name=NEET&background=6B8A2D&color=fff',
    members: 892,
    lastMessage: 'Biology important diagrams PDF shared',
    lastMessageTime: 'Yesterday',
    unreadCount: 1,
    type: 'exam',
    category: 'NEET',
  },
  {
    id: 'g5',
    name: 'UPSC Preparation',
    avatar: 'https://ui-avatars.com/api/?name=UPSC&background=4A6ACB&color=fff',
    members: 567,
    lastMessage: 'Current affairs compilation for May 2023',
    lastMessageTime: 'Monday',
    unreadCount: 0,
    type: 'exam',
    category: 'UPSC',
  },
  {
    id: 'g6',
    name: 'Class 11 - State Board',
    avatar: 'https://ui-avatars.com/api/?name=11+State&background=E97F40&color=fff',
    members: 125,
    lastMessage: 'Chemistry lab practical details',
    lastMessageTime: 'Monday',
    unreadCount: 0,
    type: 'class',
    category: 'State Board',
  },
];

// Mock message data
const mockMessages = [
  {
    id: 'm1',
    text: 'Hey everyone, can someone share the Physics notes from today?',
    sender: 'Rahul K',
    senderAvatar: 'https://ui-avatars.com/api/?name=Rahul+K&background=random',
    timestamp: '5:23 PM',
    isMine: false,
  },
  {
    id: 'm2',
    text: 'I missed the class too. Would appreciate if someone could share.',
    sender: 'Priya S',
    senderAvatar: 'https://ui-avatars.com/api/?name=Priya+S&background=random',
    timestamp: '5:25 PM',
    isMine: false,
  },
  {
    id: 'm3',
    text: 'I have the notes. Will upload in a few minutes!',
    sender: 'You',
    senderAvatar: 'https://ui-avatars.com/api/?name=You&background=random',
    timestamp: '5:28 PM',
    isMine: true,
  },
  {
    id: 'm4',
    text: 'Here are the notes from today.',
    sender: 'You',
    senderAvatar: 'https://ui-avatars.com/api/?name=You&background=random',
    attachment: {
      type: 'pdf',
      name: 'Physics_Notes_Ch7.pdf',
      size: '2.4 MB',
    },
    timestamp: '5:35 PM',
    isMine: true,
  },
  {
    id: 'm5',
    text: 'Thank you so much! Really appreciate it.',
    sender: 'Rahul K',
    senderAvatar: 'https://ui-avatars.com/api/?name=Rahul+K&background=random',
    timestamp: '5:38 PM',
    isMine: false,
  },
  {
    id: 'm6',
    text: 'Thanks! By the way, does anyone know the syllabus for the upcoming test?',
    sender: 'Priya S',
    senderAvatar: 'https://ui-avatars.com/api/?name=Priya+S&background=random',
    timestamp: '5:40 PM',
    isMine: false,
  },
  {
    id: 'm7',
    text: 'Yes, it covers chapters 6 and 7 from the textbook.',
    sender: 'Aditya M',
    senderAvatar: 'https://ui-avatars.com/api/?name=Aditya+M&background=random',
    timestamp: '5:43 PM',
    isMine: false,
  },
  {
    id: 'm8',
    text: 'Also, focus on the numerical problems. The teacher mentioned there will be at least 15 marks dedicated to them.',
    sender: 'You',
    senderAvatar: 'https://ui-avatars.com/api/?name=You&background=random',
    timestamp: '5:45 PM',
    isMine: true,
  },
];

// Message Component
const Message = ({ message }: { message: typeof mockMessages[0] }) => {
  return (
    <div className={`flex ${message.isMine ? 'justify-end' : 'justify-start'} mb-4`}>
      {!message.isMine && (
        <Avatar className="h-8 w-8 mr-2 mt-1">
          <AvatarImage src={message.senderAvatar} />
          <AvatarFallback>{message.sender[0]}</AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-[70%] ${message.isMine ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'} rounded-lg p-3`}>
        {!message.isMine && (
          <p className="text-xs font-medium mb-1">{message.sender}</p>
        )}
        
        <p className="text-sm">{message.text}</p>
        
        {message.attachment && (
          <div className="mt-2 flex items-center bg-white/10 rounded p-2">
            {message.attachment.type === 'pdf' ? (
              <FileText className="h-4 w-4 mr-2" />
            ) : (
              <Image className="h-4 w-4 mr-2" />
            )}
            <span className="text-xs">{message.attachment.name} ({message.attachment.size})</span>
          </div>
        )}
        
        <div className={`text-xs mt-1 ${message.isMine ? 'text-blue-100' : 'text-gray-500'} flex items-center`}>
          {message.timestamp}
          {message.isMine && <Check className="h-3 w-3 ml-1" />}
        </div>
      </div>
      
      {message.isMine && (
        <Avatar className="h-8 w-8 ml-2 mt-1">
          <AvatarImage src={message.senderAvatar} />
          <AvatarFallback>{message.sender[0]}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

// Group Component
const GroupItem = ({ 
  group, 
  isActive, 
  onClick 
}: { 
  group: typeof groups[0], 
  isActive?: boolean,
  onClick: () => void
}) => {
  return (
    <div 
      className={`flex items-center p-3 cursor-pointer transition-colors ${isActive ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
      onClick={onClick}
    >
      <Avatar className="h-12 w-12 mr-3">
        <AvatarImage src={group.avatar} />
        <AvatarFallback>{group.name.substring(0, 2)}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900 truncate">{group.name}</h3>
          <span className="text-xs text-gray-500">{group.lastMessageTime}</span>
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-gray-600 truncate">{group.lastMessage}</p>
          {group.unreadCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-500 rounded-full">
              {group.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Community Component
const Community = () => {
  const [selectedGroup, setSelectedGroup] = useState<typeof groups[0] | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const [activeTab, setActiveTab] = useState('all');
  const [filteredGroups, setFilteredGroups] = useState(groups);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Filter groups based on active tab
  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredGroups(groups);
    } else if (activeTab === 'class') {
      setFilteredGroups(groups.filter(group => group.type === 'class'));
    } else if (activeTab === 'exam') {
      setFilteredGroups(groups.filter(group => group.type === 'exam'));
    }
  }, [activeTab]);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedGroup]);
  
  const sendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage = {
      id: `m${messages.length + 1}`,
      text: message,
      sender: 'You',
      senderAvatar: 'https://ui-avatars.com/api/?name=You&background=random',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
    
    // Simulate a reply after a delay
    setTimeout(() => {
      const replies = [
        "That's a great point!",
        "Can you explain that in more detail?",
        "I agree with your perspective.",
        "Thanks for sharing that!",
        "Interesting thought, I hadn't considered that."
      ];
      
      const randomReply = {
        id: `m${messages.length + 2}`,
        text: replies[Math.floor(Math.random() * replies.length)],
        sender: 'Study Buddy',
        senderAvatar: 'https://ui-avatars.com/api/?name=Study+Buddy&background=random',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMine: false,
      };
      
      setMessages(prev => [...prev, randomReply]);
    }, 2000);
  };
  
  const handleGroupClick = (group: typeof groups[0]) => {
    setSelectedGroup(group);
  };
  
  const handleBackClick = () => {
    setSelectedGroup(null);
  };
  
  const handleAttachment = () => {
    toast({
      title: "Attachment Feature",
      description: "This would integrate with Google Cloud Storage in the full version",
    });
  };
  
  return (
    <Layout>
      <style>
        {`
          .chat-container {
            height: calc(100vh - 200px);
          }
          
          .messages-container {
            height: calc(100% - 70px);
            overflow-y: auto;
          }
          
          .typing-indicator span {
            animation: typing 1.4s infinite both;
          }
          
          .typing-indicator span:nth-child(2) {
            animation-delay: 0.2s;
          }
          
          .typing-indicator span:nth-child(3) {
            animation-delay: 0.4s;
          }
          
          @keyframes typing {
            0% { opacity: 0.2; }
            20% { opacity: 1; }
            100% { opacity: 0.2; }
          }
        `}
      </style>
      
      <div className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Chat</h1>
          <p className="text-lg text-gray-600">
            Connect with fellow students in your class or competitive exam groups
          </p>
        </div>
        
        {/* Main Chat UI */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 chat-container">
            {/* Sidebar - Hidden on mobile when group is selected */}
            <div className={`border-r border-gray-200 ${selectedGroup && 'hidden md:block'}`}>
              <div className="p-4 border-b border-gray-200">
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input 
                    placeholder="Search groups..." 
                    className="pl-10"
                  />
                </div>
                
                <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3 mb-2">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="class">Class</TabsTrigger>
                    <TabsTrigger value="exam">Exam</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="overflow-y-auto" style={{ height: 'calc(100% - 130px)' }}>
                {filteredGroups.map(group => (
                  <GroupItem 
                    key={group.id} 
                    group={group} 
                    isActive={selectedGroup?.id === group.id}
                    onClick={() => handleGroupClick(group)}
                  />
                ))}
              </div>
            </div>
            
            {/* Chat Area */}
            <div className={`col-span-2 ${!selectedGroup && 'hidden md:block'}`}>
              {selectedGroup ? (
                <>
                  {/* Chat Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="mr-2 md:hidden"
                        onClick={handleBackClick}
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </Button>
                      
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={selectedGroup.avatar} />
                        <AvatarFallback>{selectedGroup.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h3 className="font-medium text-gray-900">{selectedGroup.name}</h3>
                        <p className="text-xs text-gray-500">{selectedGroup.members} members</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Button variant="ghost" size="icon">
                        <Search className="h-5 w-5 text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Users className="h-5 w-5 text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Messages */}
                  <div className="messages-container p-4">
                    {messages.map(msg => (
                      <Message key={msg.id} message={msg} />
                    ))}
                    
                    {/* Typing indicator */}
                    <div className="flex items-center mb-4">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src="https://ui-avatars.com/api/?name=Aditya+M&background=random" />
                        <AvatarFallback>AM</AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
                        <p className="text-xs font-medium mb-1">Aditya M</p>
                        <div className="typing-indicator flex">
                          <span className="h-2 w-2 bg-gray-500 rounded-full mr-1"></span>
                          <span className="h-2 w-2 bg-gray-500 rounded-full mr-1"></span>
                          <span className="h-2 w-2 bg-gray-500 rounded-full"></span>
                        </div>
                      </div>
                    </div>
                    
                    <div ref={messagesEndRef} />
                  </div>
                  
                  {/* Message Input */}
                  <div className="border-t border-gray-200 p-4">
                    <div className="flex items-center">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-gray-500"
                        onClick={handleAttachment}
                      >
                        <Paperclip className="h-5 w-5" />
                      </Button>
                      
                      <Input 
                        placeholder="Type a message..." 
                        className="mx-2"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            sendMessage();
                          }
                        }}
                      />
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-gray-500 mr-2"
                      >
                        <Smile className="h-5 w-5" />
                      </Button>
                      
                      <Button 
                        disabled={!message.trim()} 
                        onClick={sendMessage}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <Users className="h-16 w-16 text-blue-500 mb-4" />
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Community Chat</h2>
                  <p className="text-gray-600 mb-6 max-w-md">
                    Connect with fellow students, share resources, and discuss academic topics in group chats.
                  </p>
                  <Button 
                    onClick={() => handleGroupClick(groups[0])}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Select a group to start chatting
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Community;
