
import React, { useState, useRef, useEffect } from 'react';
import { Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { updateProfileImage, removeProfileImage, getCurrentUserSync } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

interface ProfileImageUploaderProps {
  currentImage?: string | null;
  name: string;
  onImageChange?: (image: string | null) => void;
  size?: 'sm' | 'md' | 'lg';
}

const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({
  currentImage,
  name,
  onImageChange,
  size = 'md'
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [image, setImage] = useState<string | null | undefined>(currentImage);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Set initial image
    const user = getCurrentUserSync();
    if (user?.profileImage) {
      setImage(user.profileImage);
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    setImage(currentImage);
  }, [currentImage]);
  
  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32"
  };
  
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB",
        variant: "destructive"
      });
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageDataUrl = event.target?.result as string;
      
      // Update user profile
      updateProfileImage(imageDataUrl);
      
      // Update local state
      setImage(imageDataUrl);
      
      // Call callback if provided
      if (onImageChange) {
        onImageChange(imageDataUrl);
      }
      
      toast({
        title: "Profile image updated",
        description: "Your profile image has been updated successfully"
      });

      // Dispatch event to update UI elsewhere
      window.dispatchEvent(new CustomEvent('user-profile-updated'));
    };
    
    reader.readAsDataURL(file);
  };
  
  const handleRemoveImage = () => {
    // Remove profile image
    removeProfileImage();
    
    // Update local state
    setImage(null);
    
    // Call callback if provided
    if (onImageChange) {
      onImageChange(null);
    }
    
    toast({
      title: "Profile image removed",
      description: "Your profile image has been removed"
    });

    // Dispatch event to update UI elsewhere
    window.dispatchEvent(new CustomEvent('user-profile-updated'));
  };
  
  return (
    <div className="relative">
      <div
        className={`relative ${sizeClasses[size]} rounded-full overflow-hidden border-4 border-white shadow-md`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={isMobile ? handleUploadClick : undefined}
      >
        <Avatar className={`${sizeClasses[size]}`}>
          <AvatarImage src={image || undefined} />
          <AvatarFallback className={`bg-education-100 text-education-600 text-${size === 'sm' ? 'lg' : 'xl'}`}>
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        {(isHovering || isMobile) && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-700"
                onClick={handleUploadClick}
              >
                <Camera size={16} />
              </Button>
              
              {image && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 text-red-600"
                  onClick={handleRemoveImage}
                >
                  <X size={16} />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
      />
    </div>
  );
};

export default ProfileImageUploader;
