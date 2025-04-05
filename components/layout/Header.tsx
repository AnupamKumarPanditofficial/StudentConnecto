
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { isAuthenticated, isAdminSync, isTutorSync, getCurrentUserSync, logout } from "@/services/authService";
import { 
  LogIn, 
  LogOut, 
  BookOpen, 
  Users, 
  BookCopy, 
  Gauge, 
  MessageCircle, 
  Film,
  UserCircle2,
  Menu
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationBell from "@/components/common/NotificationBell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

// Create mobile navigation component
const SheetMobileNav = ({ open, onOpenChange, onNavigate }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const handleNavigate = (path) => {
    onNavigate();
    // Navigation will be handled by Link component
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-left font-bold text-xl text-education-600">StudentConnect</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-8">
          <Link to="/" onClick={() => handleNavigate('/')} className={`px-4 py-3 rounded-lg flex items-center ${isActive('/') ? 'bg-education-50 text-education-700' : 'hover:bg-gray-100'}`}>
            <span>Home</span>
          </Link>
          <Link to="/tutors" onClick={() => handleNavigate('/tutors')} className={`px-4 py-3 rounded-lg flex items-center ${isActive('/tutors') ? 'bg-education-50 text-education-700' : 'hover:bg-gray-100'}`}>
            <span>Get Tutors</span>
          </Link>
          <Link to="/tasks" onClick={() => handleNavigate('/tasks')} className={`px-4 py-3 rounded-lg flex items-center ${isActive('/tasks') ? 'bg-education-50 text-education-700' : 'hover:bg-gray-100'}`}>
            <BookCopy className="mr-2 h-4 w-4" />
            <span>Tasks</span>
          </Link>
          <Link to="/resources" onClick={() => handleNavigate('/resources')} className={`px-4 py-3 rounded-lg flex items-center ${isActive('/resources') ? 'bg-education-50 text-education-700' : 'hover:bg-gray-100'}`}>
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Resources</span>
          </Link>
          <Link to="/community" onClick={() => handleNavigate('/community')} className={`px-4 py-3 rounded-lg flex items-center ${isActive('/community') ? 'bg-education-50 text-education-700' : 'hover:bg-gray-100'}`}>
            <MessageCircle className="mr-2 h-4 w-4" />
            <span>Community</span>
          </Link>
          <Link to="/blog" onClick={() => handleNavigate('/blog')} className={`px-4 py-3 rounded-lg flex items-center ${isActive('/blog') ? 'bg-education-50 text-education-700' : 'hover:bg-gray-100'}`}>
            <span>Blog</span>
          </Link>
          <Link to="/shorts" onClick={() => handleNavigate('/shorts')} className={`px-4 py-3 rounded-lg flex items-center ${isActive('/shorts') ? 'bg-education-50 text-education-700' : 'hover:bg-gray-100'}`}>
            <Film className="mr-2 h-4 w-4" />
            <span>Shorts</span>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [isTutorUser, setIsTutorUser] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 5) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    // Initialize auth state
    updateAuthState();

    // Listen for auth state changes
    window.addEventListener('auth-state-changed', updateAuthState);
    window.addEventListener('user-profile-updated', updateAuthState);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener('auth-state-changed', updateAuthState);
      window.removeEventListener('user-profile-updated', updateAuthState);
    };
  }, []);

  const updateAuthState = async () => {
    // Check authentication status
    const authStatus = await isAuthenticated();
    setIsAuth(authStatus);
    
    // If authenticated, get user information
    if (authStatus) {
      setIsAdminUser(isAdminSync());
      setIsTutorUser(isTutorSync());
      setCurrentUser(getCurrentUserSync());
    } else {
      setIsAdminUser(false);
      setIsTutorUser(false);
      setCurrentUser(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const closeMobileNav = () => {
    setMobileNavOpen(false);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 ease-in-out",
        {
          "bg-white/80 backdrop-blur-md shadow-sm": isScrolled,
          "bg-transparent": !isScrolled,
        }
      )}
    >
      <div className="container flex h-20 items-center justify-between py-4">
        <div className="flex items-center gap-6 md:gap-6">
          <Link to="/" className="hidden items-center space-x-2 md:flex">
            <span className="hidden font-bold sm:inline-block text-2xl text-education-600">
              StudentConnect
            </span>
          </Link>
          <Button
            variant="ghost"
            className="px-2 md:hidden"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <NavigationMenu className="hidden md:flex md:justify-center md:flex-1">
            <NavigationMenuList className="flex justify-center space-x-4">
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-base font-medium transition-colors hover:bg-education-50 hover:text-education-700 focus:bg-education-50 focus:text-education-700 focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                      location.pathname === "/" && "bg-education-50 text-education-700"
                    )}
                  >
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to={isTutorUser ? "/tutoring" : "/tutors"}>
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-base font-medium transition-colors hover:bg-education-50 hover:text-education-700 focus:bg-education-50 focus:text-education-700 focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                      (location.pathname === "/tutors" || location.pathname === "/tutoring") && "bg-education-50 text-education-700"
                    )}
                  >
                    {isTutorUser ? "Tutoring" : "Get Tutors"}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/tasks">
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-base font-medium transition-colors hover:bg-education-50 hover:text-education-700 focus:bg-education-50 focus:text-education-700 focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                      location.pathname === "/tasks" && "bg-education-50 text-education-700"
                    )}
                  >
                    <BookCopy className="mr-1 h-4 w-4" />
                    Tasks
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/resources">
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-base font-medium transition-colors hover:bg-education-50 hover:text-education-700 focus:bg-education-50 focus:text-education-700 focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                      location.pathname === "/resources" && "bg-education-50 text-education-700"
                    )}
                  >
                    <BookOpen className="mr-1 h-4 w-4" />
                    Resources
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/community">
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-base font-medium transition-colors hover:bg-education-50 hover:text-education-700 focus:bg-education-50 focus:text-education-700 focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                      location.pathname === "/community" && "bg-education-50 text-education-700"
                    )}
                  >
                    <MessageCircle className="mr-1 h-4 w-4" />
                    Community
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/blog">
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-base font-medium transition-colors hover:bg-education-50 hover:text-education-700 focus:bg-education-50 focus:text-education-700 focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                      location.pathname === "/blog" && "bg-education-50 text-education-700"
                    )}
                  >
                    Blog
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/shorts">
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-base font-medium transition-colors hover:bg-education-50 hover:text-education-700 focus:bg-education-50 focus:text-education-700 focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                      location.pathname === "/shorts" && "bg-education-50 text-education-700"
                    )}
                  >
                    <Film className="mr-1 h-4 w-4" />
                    Shorts
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-2">
          {isAuth && (
            <NotificationBell />
          )}
          
          {isAuth ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src={currentUser?.profileImage} />
                    <AvatarFallback className="bg-education-100 text-education-700">
                      {currentUser?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-xs font-medium text-gray-500">
                    {currentUser?.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    {isTutorUser ? "Tutor" : isAdminUser ? "Admin" : "Student"}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/my-profile')}>
                  <UserCircle2 className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                {isAdminUser && (
                  <DropdownMenuItem onClick={() => navigate('/admin/dashboard')}>
                    <Gauge className="mr-2 h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" onClick={handleLogin} className="bg-education-600 hover:bg-education-700">
              <LogIn className="mr-2 h-4 w-4" />
              Sign in
            </Button>
          )}
        </div>
      </div>
      <SheetMobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} onNavigate={closeMobileNav} />
    </header>
  );
}
