
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { 
  BookOpen, 
  BookCopy, 
  MessageCircle, 
  Film,
  Home,
  GraduationCap
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { isTutor } from '@/services/authService';

interface SheetMobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: () => void;
}

export const SheetMobileNav: React.FC<SheetMobileNavProps> = ({ 
  open, 
  onOpenChange, 
  onNavigate 
}) => {
  const location = useLocation();
  const isTutorUser = isTutor();

  const navigationItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: isTutorUser ? 'Tutoring' : 'Get Tutors', href: isTutorUser ? '/tutoring' : '/tutors', icon: GraduationCap },
    { name: 'Tasks', href: '/tasks', icon: BookCopy },
    { name: 'Resources', href: '/resources', icon: BookOpen },
    { name: 'Community', href: '/community', icon: MessageCircle },
    { name: 'Blog', href: '/blog', icon: null },
    { name: 'Shorts', href: '/shorts', icon: Film },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="pr-0">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-education-600 mb-4">
            StudentConnect
          </SheetTitle>
        </SheetHeader>
        <Separator className="mb-4" />
        <div className="flex flex-col space-y-1">
          {navigationItems.map((item, index) => (
            <Link 
              key={index}
              to={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center py-3 px-4 rounded-lg text-sm transition-colors hover:bg-gray-100",
                location.pathname === item.href && "bg-education-50 text-education-700 font-medium"
              )}
            >
              {item.icon && <item.icon className="mr-3 h-4 w-4" />}
              {item.name}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
