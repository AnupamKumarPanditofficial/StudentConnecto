
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import geminiConfig, { hasGeminiApiKey } from '@/config/gemini';
import { useToast } from '@/hooks/use-toast';

const ChatbotButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ sender: 'user' | 'bot', text: string }[]>([
    { sender: 'bot', text: 'Hi there! 👋 I\'m your StudentConnect assistant. How can I help you today?' }
  ]);
  const { toast } = useToast();
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Add user message to chat
    setChatHistory(prev => [...prev, { sender: 'user', text: message }]);
    
    // Clear input
    const userMessage = message;
    setMessage('');
    
    // Show typing indicator
    setIsTyping(true);
    
    // Use Gemini API for response if available, otherwise use fallback
    try {
      if (hasGeminiApiKey()) {
        console.log("Using Gemini API for chat response");
        
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + geminiConfig.apiKey, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are a helpful AI assistant for an educational platform called StudentConnect. 
                    Answer the following query in a helpful, friendly and educational manner: ${userMessage}`
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: geminiConfig.temperature,
              topK: geminiConfig.topK,
              topP: geminiConfig.topP,
              maxOutputTokens: geminiConfig.maxOutputTokens,
            }
          })
        });
        
        console.log("Gemini API response status:", response.status);
        const data = await response.json();
        console.log("Gemini API response data:", data);
        
        setIsTyping(false);
        
        if (data.candidates && data.candidates[0]?.content?.parts) {
          const botResponse = data.candidates[0].content.parts[0].text;
          setChatHistory(prev => [...prev, { sender: 'bot', text: botResponse }]);
        } else if (data.error) {
          console.error("Gemini API error:", data.error);
          setChatHistory(prev => [...prev, { 
            sender: 'bot', 
            text: `I'm sorry, I encountered an error: ${data.error.message || 'Unknown error'}`
          }]);
          
          toast({
            title: "Error",
            description: "Sorry, I couldn't process your request. Please try again later.",
            variant: "destructive"
          });
        } else {
          // Fallback if API response is unexpected
          console.error("Unexpected Gemini API response format:", data);
          setChatHistory(prev => [...prev, { 
            sender: 'bot', 
            text: "I'm sorry, I couldn't process that request. Could you try asking in a different way?"
          }]);
        }
      } else {
        console.log("No Gemini API key available, using fallback response");
        // Fallback if no API key is available
        setTimeout(() => {
          setIsTyping(false);
          setChatHistory(prev => [...prev, { 
            sender: 'bot', 
            text: getSmartResponse(userMessage)
          }]);
        }, 1500);
        
        toast({
          title: "Gemini API Key Missing",
          description: "The chatbot is using fallback responses because the Gemini API key is not configured.",
          variant: "default"  // Changed from "warning" to "default"
        });
      }
    } catch (error) {
      console.error("Error with Gemini API:", error);
      setIsTyping(false);
      setChatHistory(prev => [...prev, { 
        sender: 'bot', 
        text: "I'm sorry, I encountered an error. Please try again later."
      }]);
      
      toast({
        title: "Chatbot Error",
        description: "There was an error connecting to the Gemini API.",
        variant: "destructive"
      });
    }
  };

  // Fallback response generator if API is unavailable
  const getSmartResponse = (userMessage: string) => {
    const lowerCase = userMessage.toLowerCase();
    
    if (lowerCase.includes('hello') || lowerCase.includes('hi')) {
      return "Hello there! How can I assist you with your studies today?";
    } else if (lowerCase.includes('tutor') || lowerCase.includes('teacher')) {
      return "We have many qualified tutors available! Would you like to browse tutors by subject or see our top-rated ones?";
    } else if (lowerCase.includes('course') || lowerCase.includes('class')) {
      return "We offer a variety of courses across different subjects. What specific area are you interested in learning more about?";
    } else if (lowerCase.includes('exam') || lowerCase.includes('test')) {
      return "Need help preparing for an exam? We have study materials, practice tests, and tutors who can help you prepare effectively.";
    } else if (lowerCase.includes('thank')) {
      return "You're welcome! Feel free to ask if you need anything else.";
    } else {
      return "I'm here to help with your educational needs! You can ask about tutors, courses, study materials, or any other aspect of StudentConnect.";
    }
  };

  // Chat bubble animation variants
  const bubbleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
  };

  // Suggestions for quick replies
  const suggestions = [
    "Find a tutor",
    "Study resources",
    "Upcoming exams",
    "My courses"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="pointer-events-auto" 
      >
        <Button
          className="rounded-full w-16 h-16 shadow-lg p-0 bg-education-600 hover:bg-education-700 transition-all duration-300"
          onClick={toggleChat}
        >
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </Button>
      </motion.div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-24 right-0 w-80 sm:w-96 z-50 pointer-events-auto"
          >
            <Card className="shadow-xl border border-gray-200 rounded-2xl overflow-hidden bg-white">
              <CardHeader className="bg-gradient-to-r from-education-600 to-education-700 text-white py-4 px-4 flex flex-row items-center space-y-0 gap-2">
                <Bot size={22} className="text-white" />
                <CardTitle className="text-lg font-medium">AI Study Assistant</CardTitle>
              </CardHeader>
              
              <CardContent className="h-96 overflow-y-auto p-4 bg-gray-50">
                <div className="flex flex-col space-y-4">
                  {chatHistory.map((msg, index) => (
                    <motion.div
                      key={index}
                      variants={bubbleVariants}
                      initial="hidden"
                      animate="visible"
                      className={`max-w-[85%] ${
                        msg.sender === 'user' ? 'self-end' : 'self-start'
                      }`}
                    >
                      <div
                        className={`p-3 rounded-2xl ${
                          msg.sender === 'user'
                            ? 'bg-education-600 text-white rounded-br-none'
                            : 'bg-white border border-gray-200 shadow-sm text-gray-700 rounded-bl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <div className={`text-xs mt-1 text-gray-500 ${
                        msg.sender === 'user' ? 'text-right' : 'text-left'
                      }`}>
                        {msg.sender === 'user' ? 'You' : 'AI Assistant'}
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      variants={bubbleVariants}
                      initial="hidden"
                      animate="visible"
                      className="self-start"
                    >
                      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl rounded-bl-none p-3 text-gray-700">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                      <div className="text-xs mt-1 text-gray-500 text-left">
                        AI Assistant
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Quick reply suggestions */}
                {chatHistory.length < 3 && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="text-sm bg-white border border-gray-200 hover:border-education-300 text-gray-700 px-3 py-1.5 rounded-full transition-colors"
                          onClick={() => {
                            setMessage(suggestion);
                            setTimeout(() => {
                              handleSendMessage(new Event('click') as unknown as React.FormEvent);
                            }, 100);
                          }}
                        >
                          {suggestion}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="p-3 border-t border-gray-100 bg-white">
                <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-grow h-10 border-gray-300 focus:ring-education-500 focus:border-education-500"
                  />
                  <Button 
                    type="submit" 
                    size="sm" 
                    className="bg-education-600 hover:bg-education-700 h-10 px-3"
                    disabled={!message.trim() || isTyping}
                  >
                    <Send size={18} />
                  </Button>
                </form>
              </CardFooter>
              
              {/* Powered by badge */}
              <div className="bg-gray-50 text-center py-1.5 text-xs text-gray-500 border-t border-gray-100">
                <span className="flex items-center justify-center gap-1">
                  Powered by <Sparkles size={12} className="text-yellow-500" /> Gemini AI
                </span>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatbotButton;
