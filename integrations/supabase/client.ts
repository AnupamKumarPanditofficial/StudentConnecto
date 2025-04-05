
// Import the Supabase client
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use environment variables for the Supabase URL and API key
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://whcgytvpolhvizpeefva.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoY2d5dHZwb2xodml6cGVlZnZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MTY3NDYsImV4cCI6MjA1OTE5Mjc0Nn0.gFb7DhVLxCGW_qws3wdKzrLco2kIZ6sYVWL3AQFIjis";

// Create the Supabase client
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});

// Helper functions for authentication
export const isAuthenticated = () => {
  return supabase.auth.getSession().then(({ data }) => !!data.session);
};

export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};
