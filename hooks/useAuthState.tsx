
import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import { updateCachedUser } from '@/services/authService';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true);
        
        if (session?.user) {
          const user: User = {
            id: session.user.id,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
            email: session.user.email || '',
            role: session.user.user_metadata?.role || 'student',
            joinDate: session.user.created_at || new Date().toISOString(),
            profileImage: session.user.user_metadata?.profileImage || '',
            nickname: session.user.user_metadata?.nickname || '',
            education: session.user.user_metadata?.education || '',
            bio: session.user.user_metadata?.bio || '',
            social: session.user.user_metadata?.social || {
              instagram: '',
              twitter: '',
              linkedin: ''
            },
            location: session.user.user_metadata?.location || '',
          };
          
          setUser(user);
          updateCachedUser(user);
        } else {
          setUser(null);
          updateCachedUser(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const user: User = {
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
          email: session.user.email || '',
          role: session.user.user_metadata?.role || 'student',
          joinDate: session.user.created_at || new Date().toISOString(),
          profileImage: session.user.user_metadata?.profileImage || '',
          nickname: session.user.user_metadata?.nickname || '',
          education: session.user.user_metadata?.education || '',
          bio: session.user.user_metadata?.bio || '',
          social: session.user.user_metadata?.social || {
            instagram: '',
            twitter: '',
            linkedin: ''
          },
          location: session.user.user_metadata?.location || '',
        };
        
        setUser(user);
        updateCachedUser(user);
      }
      
      setLoading(false);
    };
    
    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isTutor: user?.role === 'tutor',
    isAdmin: user?.role === 'admin',
  };
}
