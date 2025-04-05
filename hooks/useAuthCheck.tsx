
import { useState } from 'react';
import { isAuthenticated, isTutor } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';
import AuthRequiredModal from '@/components/common/AuthRequiredModal';

export function useAuthCheck() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentFeature, setCurrentFeature] = useState('access this feature');
  const { toast } = useToast();

  const checkAuth = (featureName: string, onSuccess?: () => void, requiredRole?: 'tutor' | 'user') => {
    if (isAuthenticated()) {
      // If a specific role is required, check for that role
      if (requiredRole === 'tutor' && !isTutor()) {
        toast({
          title: "Tutor Access Required",
          description: `You need to be registered as a tutor to ${featureName}`,
          variant: "destructive"
        });
        return false;
      } else if (requiredRole === 'user' && isTutor()) {
        toast({
          title: "Student Access Required",
          description: `This feature is only available to students`,
          variant: "destructive"
        });
        return false;
      }
      
      // If authentication passed (and role check if applicable)
      if (onSuccess) onSuccess();
      return true;
    } else {
      setCurrentFeature(featureName);
      setIsAuthModalOpen(true);
      return false;
    }
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // For quick actions that just need a toast notification
  const quickAuthCheck = (action: string, requiredRole?: 'tutor' | 'user') => {
    if (!isAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: `You need to login to ${action}`,
        variant: "destructive"
      });
      return false;
    }
    
    // If a specific role is required, check for that role
    if (requiredRole === 'tutor' && !isTutor()) {
      toast({
        title: "Tutor Access Required",
        description: `You need to be registered as a tutor to ${action}`,
        variant: "destructive"
      });
      return false;
    } else if (requiredRole === 'user' && isTutor()) {
      toast({
        title: "Student Access Required",
        description: `This feature is only available to students`,
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const AuthRequiredModalComponent = (
    <AuthRequiredModal 
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      featureName={currentFeature}
    />
  );

  return {
    checkAuth,
    quickAuthCheck,
    closeAuthModal,
    AuthRequiredModal: AuthRequiredModalComponent
  };
}
