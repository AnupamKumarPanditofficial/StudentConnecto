
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Lock } from 'lucide-react';

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}

const AuthRequiredModal = ({ isOpen, onClose, featureName }: AuthRequiredModalProps) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login', { state: { returnTo: window.location.pathname } });
    onClose();
  };

  const handleSignup = () => {
    navigate('/signup', { state: { returnTo: window.location.pathname } });
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="mx-auto bg-education-100 p-3 rounded-full mb-4">
            <Lock className="h-6 w-6 text-education-600" />
          </div>
          <AlertDialogTitle className="text-center text-xl">Authentication Required</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            You need to be logged in to {featureName}.
            <p className="mt-2 font-medium text-gray-700">Join our community to unlock all features!</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
          <AlertDialogAction 
            className="bg-education-600 hover:bg-education-700"
            onClick={handleLogin}
          >
            Login
          </AlertDialogAction>
          <AlertDialogAction 
            className="bg-education-800 hover:bg-education-900"
            onClick={handleSignup}
          >
            Sign Up
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AuthRequiredModal;
