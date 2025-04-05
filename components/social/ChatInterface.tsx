
import React, { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUserSync } from '@/services/authService';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
}

interface ChatInterfaceProps {
  friendId: string;
  friendName: string;
  onClose: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  friendId, 
  friendName,
  onClose
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const currentUser = getCurrentUserSync();
  
  // Load chat messages from localStorage
  useEffect(() => {
    if (!currentUser) return;
    
    const chatId = getChatId(currentUser.id, friendId);
    const storedMessages = localStorage.getItem(`chat_messages_${chatId}`);
    
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    } else {
      // Initialize with a welcome message
      const welcomeMessage: ChatMessage = {
        id: crypto.randomUUID(),
        senderId: 'system',
        senderName: 'System',
        content: `This is the beginning of your conversation with ${friendName}`,
        timestamp: Date.now()
      };
      setMessages([welcomeMessage]);
      localStorage.setItem(`chat_messages_${chatId}`, JSON.stringify([welcomeMessage]));
    }
  }, [currentUser, friendId, friendName]);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);
  
  const getChatId = (userId1: string, userId2: string) => {
    // Create a consistent chat ID regardless of user order
    return [userId1, userId2].sort().join('_');
  };
  
  const handleSendMessage = () => {
    if (!currentUser) return;
    if (!messageText.trim()) return;
    
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: messageText.trim(),
      timestamp: Date.now()
    };
    
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    
    // Save to localStorage
    const chatId = getChatId(currentUser.id, friendId);
    localStorage.setItem(`chat_messages_${chatId}`, JSON.stringify(updatedMessages));
    
    setMessageText('');
  };
  
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  if (!currentUser) return null;

  return (
    <Card className="w-full h-[500px] flex flex-col shadow-lg">
      <CardHeader className="border-b bg-gray-50 flex flex-row items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{friendName[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-lg">{friendName}</CardTitle>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
        >
          Close
        </Button>
      </CardHeader>
      
      <ScrollArea 
        className="flex-1 p-4 max-h-[380px]"
        ref={scrollAreaRef}
      >
        <div className="space-y-4">
          {messages.map((msg) => {
            const isCurrentUser = msg.senderId === currentUser.id;
            const isSystem = msg.senderId === 'system';
            
            return (
              <div key={msg.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                {isSystem ? (
                  <div className="bg-gray-100 text-gray-500 py-2 px-4 rounded-lg max-w-[80%] text-center mx-auto">
                    {msg.content}
                  </div>
                ) : (
                  <div className={`flex items-end gap-2 max-w-[80%] ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                    {!isCurrentUser && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>{msg.senderName[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`space-y-1 ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                      <div 
                        className={`py-2 px-4 rounded-lg ${
                          isCurrentUser 
                            ? 'bg-education-600 text-white rounded-br-none' 
                            : 'bg-gray-100 rounded-bl-none'
                        }`}
                      >
                        {msg.content}
                      </div>
                      <p className="text-xs text-gray-500">
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
      
      <CardFooter className="border-t p-4">
        <form 
          className="flex w-full items-center gap-2" 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" size="sm" disabled={!messageText.trim()}>
            <Send size={16} />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default ChatInterface;
