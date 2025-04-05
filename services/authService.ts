
import { User } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
};

// Helper to get the current user
export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  // Get additional user profile information from public.profiles if needed
  // For now, we'll construct a User object from the auth user
  return {
    id: user.id,
    name: user.user_metadata?.name || user.email?.split('@')[0] || '',
    email: user.email || '',
    role: user.user_metadata?.role || 'student',
    joinDate: user.created_at || new Date().toISOString(),
    profileImage: user.user_metadata?.profileImage || '',
    nickname: user.user_metadata?.nickname || '',
    education: user.user_metadata?.education || '',
    bio: user.user_metadata?.bio || '',
    social: user.user_metadata?.social || {
      instagram: '',
      twitter: '',
      linkedin: ''
    },
    location: user.user_metadata?.location || '',
  };
};

// Create a synchronous version of getCurrentUser that returns cached data
// This helps with components that need immediate access to user data
let cachedUser: User | null = null;

// Function to update cached user
export const updateCachedUser = (user: User | null) => {
  cachedUser = user;
};

// Sync version that returns immediately available data
export const getCurrentUserSync = (): User | null => {
  return cachedUser;
};

// Initialize user cache on module load
supabase.auth.onAuthStateChange((event, session) => {
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
    updateCachedUser(user);
  } else {
    updateCachedUser(null);
  }
});

// Update user profile
export const updateUserProfile = async (updatedUser: User): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.updateUser({
      data: {
        name: updatedUser.name,
        role: updatedUser.role,
        profileImage: updatedUser.profileImage,
        nickname: updatedUser.nickname,
        education: updatedUser.education,
        bio: updatedUser.bio,
        social: updatedUser.social,
      }
    });
    
    if (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
    
    // Update cached user
    updateCachedUser(updatedUser);
    
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('user-profile-updated'));
    
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
};

// Get user by ID (for profile viewing)
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const { data: { user }, error } = await supabase.auth.admin.getUserById(userId);
    
    if (error || !user) {
      console.error('Error fetching user by ID:', error);
      return null;
    }
    
    return {
      id: user.id,
      name: user.user_metadata?.name || user.email?.split('@')[0] || '',
      email: user.email || '',
      role: user.user_metadata?.role || 'student',
      joinDate: user.created_at || new Date().toISOString(),
      profileImage: user.user_metadata?.profileImage || '',
      nickname: user.user_metadata?.nickname || '',
      education: user.user_metadata?.education || '',
      bio: user.user_metadata?.bio || '',
      social: user.user_metadata?.social || {
        instagram: '',
        twitter: '',
        linkedin: ''
      },
      location: user.user_metadata?.location || '',
    };
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
};

// Check if user is a tutor
export const isTutor = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return user !== null && user.role === 'tutor';
};

// Synchronous version of isTutor
export const isTutorSync = (): boolean => {
  const user = getCurrentUserSync();
  return user !== null && user.role === 'tutor';
};

// Check if user is an admin
export const isAdmin = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return user !== null && user.role === 'admin';
};

// Synchronous version of isAdmin
export const isAdminSync = (): boolean => {
  const user = getCurrentUserSync();
  return user !== null && user.role === 'admin';
};

// Login function 
export const login = async (email: string, password: string): Promise<{ success: boolean, user?: User, error?: string }> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
    
    if (!data.user) {
      return { 
        success: false, 
        error: 'User not found' 
      };
    }
    
    const user: User = {
      id: data.user.id,
      name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || '',
      email: data.user.email || '',
      role: data.user.user_metadata?.role || 'student',
      joinDate: data.user.created_at || new Date().toISOString(),
      profileImage: data.user.user_metadata?.profileImage || '',
      nickname: data.user.user_metadata?.nickname || '',
      education: data.user.user_metadata?.education || '',
      bio: data.user.user_metadata?.bio || '',
      social: data.user.user_metadata?.social || {
        instagram: '',
        twitter: '',
        linkedin: ''
      },
      location: data.user.user_metadata?.location || '',
    };
    
    // Update cached user
    updateCachedUser(user);
    
    // Dispatch auth state changed event
    window.dispatchEvent(new Event('auth-state-changed'));
    
    return { success: true, user };
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      error: 'Invalid credentials' 
    };
  }
};

// Register function
export const register = async (
  email: string, 
  password: string, 
  name: string, 
  role: 'user' | 'tutor'
): Promise<{ success: boolean, error?: string }> => {
  try {
    const actualRole = role === 'tutor' ? 'tutor' : 'student';
    
    // Sign up the user with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: actualRole,
          joinDate: new Date().toISOString(),
        }
      }
    });
    
    if (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
    
    console.log("User registered successfully:", data);
    
    if (data.user) {
      const user: User = {
        id: data.user.id,
        name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || '',
        email: data.user.email || '',
        role: data.user.user_metadata?.role || 'student',
        joinDate: data.user.created_at || new Date().toISOString(),
        profileImage: '',
        nickname: '',
        education: '',
        bio: '',
        social: {
          instagram: '',
          twitter: '',
          linkedin: ''
        },
        location: '',
      };
      
      // Update cached user
      updateCachedUser(user);
    }
    
    // Dispatch auth state changed event
    window.dispatchEvent(new Event('auth-state-changed'));
    
    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    return { 
      success: false, 
      error: 'Registration failed. Please try again.' 
    };
  }
};

// Logout function
export const logout = async () => {
  await supabase.auth.signOut();
  updateCachedUser(null);
  window.dispatchEvent(new Event('auth-state-changed'));
};

// Profile image management functions
export const updateProfileImage = async (imageUrl: string): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.updateUser({
      data: {
        profileImage: imageUrl
      }
    });
    
    if (error) {
      console.error('Error updating profile image:', error);
      return false;
    }
    
    // Update cached user if it exists
    if (cachedUser) {
      cachedUser.profileImage = imageUrl;
      updateCachedUser(cachedUser);
    }
    
    window.dispatchEvent(new CustomEvent('user-profile-updated'));
    return true;
  } catch (error) {
    console.error('Error updating profile image:', error);
    return false;
  }
};

export const removeProfileImage = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.updateUser({
      data: {
        profileImage: ''
      }
    });
    
    if (error) {
      console.error('Error removing profile image:', error);
      return false;
    }
    
    // Update cached user if it exists
    if (cachedUser) {
      cachedUser.profileImage = '';
      updateCachedUser(cachedUser);
    }
    
    window.dispatchEvent(new CustomEvent('user-profile-updated'));
    return true;
  } catch (error) {
    console.error('Error removing profile image:', error);
    return false;
  }
};

// Export type for use in other files
export type { User };
