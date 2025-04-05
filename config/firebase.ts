
// Firebase configuration
// Note: Environment variables are used to protect sensitive Firebase config values

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBszwuKGFE...",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "studentconnect-f29c2.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "studentconnect-f29c2",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "studentconnect-f29c2.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "287270537289",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:287270537289:web:edcafb95c279352f0d5798",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-N9Y8PHGJBL"
};

export default firebaseConfig;

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('user');
};

// Helper to set user in localStorage after login
export const setAuthUser = (user: any) => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('lastActivity', String(Date.now()));
  window.dispatchEvent(new Event('auth-state-changed'));
};

// Helper to get the current user
export const getAuthUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};
