
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'tutor' | 'admin';
  profileImage?: string;
  joinDate?: string;
  nickname?: string;
  education?: string;
  bio?: string;
  social?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  location?: string;
}
