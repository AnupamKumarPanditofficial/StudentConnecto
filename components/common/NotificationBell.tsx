
import React, { useState, useEffect, useRef } from 'react';
import { BellIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  getUserNotifications, 
  markNotificationAsRead, 
  subscribeToNotifications
} from '@/services/socialService';
import { supabase } from '@/integrations/supabase/client';
import { Notification } from '@/types/social';
import { getCurrentUserSync } from '@/services/authService';

export const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const unreadCount = notifications.filter(n => !n.read).length;
  const notificationCheckRef = useRef<NodeJS.Timeout | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Load initial notifications
  useEffect(() => {
    const initializeUser = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      
      if (user) {
        setCurrentUserId(user.id);
        loadNotifications(user.id);
        
        // Set up periodic checks for new notifications
        notificationCheckRef.current = setInterval(() => loadNotifications(user.id), 30000); // Check every 30 seconds
        
        // Subscribe to real-time notifications
        const unsubscribe = subscribeToNotifications((newNotifications) => {
          // Only set notifications if they belong to the current user
          if (user.id) {
            const userNotifications = newNotifications.filter(n => n.userId === user.id);
            setNotifications(userNotifications);
          }
        });
        
        // Check localStorage for task applications
        checkForTaskNotifications(user.id);
        
        return () => {
          if (notificationCheckRef.current) {
            clearInterval(notificationCheckRef.current);
          }
          unsubscribe();
        };
      }
    };

    initializeUser();
    
    return () => {
      if (notificationCheckRef.current) {
        clearInterval(notificationCheckRef.current);
      }
    };
  }, []);
  
  const loadNotifications = (userId: string) => {
    if (!userId) return;
    
    // Get user-specific notifications
    const userNotifications = getUserNotifications().filter(n => n.userId === userId);
    
    setNotifications(prevNotifications => {
      // Merge new notifications with existing ones
      const updatedNotifications = [...userNotifications];
      
      // Check localStorage for task-related notifications for this user
      const taskNotifications = getTaskNotifications(userId);
      
      return [...updatedNotifications, ...taskNotifications].sort((a, b) => b.timestamp - a.timestamp);
    });
  };
  
  const checkForTaskNotifications = (userId: string) => {
    if (!userId) return;
    
    // This will check for task applications and add notifications for them
    const taskNotifications = getTaskNotifications(userId);
    if (taskNotifications.length > 0) {
      setNotifications(prev => [...prev, ...taskNotifications].sort((a, b) => b.timestamp - a.timestamp));
    }
  };
  
  const getTaskNotifications = (userId: string): Notification[] => {
    if (!userId) return [];
    
    const notifications: Notification[] = [];
    
    // Check for task applications
    const applicationsStr = localStorage.getItem('user_task_applications');
    if (applicationsStr) {
      try {
        const applications = JSON.parse(applicationsStr);
        // Only include applications for the current user
        applications.forEach((app: any) => {
          if (app.userId === userId) {
            notifications.push({
              id: `task-app-${app.taskId}-${Date.now()}`,
              userId: app.userId,
              message: `You applied for task: ${app.task.title}`,
              read: false,
              timestamp: new Date(app.appliedAt).getTime(),
              actionPath: '/tasks',
              type: 'task'
            });
          }
        });
      } catch (error) {
        console.error('Error parsing task applications:', error);
      }
    }
    
    return notifications;
  };
  
  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    markNotificationAsRead(notification.id);
    
    // Update local state
    setNotifications(notifications.map(n => 
      n.id === notification.id ? { ...n, read: true } : n
    ));
    
    // Navigate if there's an action path
    if (notification.actionPath) {
      setOpen(false);
      navigate(notification.actionPath);
    }
  };

  // If not authenticated, don't render
  if (!currentUserId) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Open notifications"
        >
          <BellIcon className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b">
          <h3 className="font-medium">Notifications</h3>
        </div>
        {notifications.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm text-gray-500">No new notifications yet. Start exploring to get updates!</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="flex flex-col divide-y">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  className={`p-3 text-left hover:bg-gray-50 flex flex-col gap-1 ${
                    !notification.read ? 'bg-gray-50' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="text-sm">{notification.message}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(notification.timestamp).toLocaleString()}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
