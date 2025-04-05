
import React, { ReactNode, useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, ListTodo, BookOpen, NewspaperIcon, Film, 
  LogOut, Menu, X, ChevronDown, User, Bell, Search, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { isAdmin, logout } from '@/services/authService';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Check if user is admin on component mount
  useEffect(() => {
    if (!isAdmin()) {
      toast({
        title: "Access denied",
        description: "You do not have permission to access this area",
        variant: "destructive"
      });
      navigate('/admin/login');
    }
  }, [navigate, toast]);
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully"
    });
    navigate('/admin/login');
  };
  
  const sidebarLinks = [
    { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/tasks', icon: <ListTodo size={20} />, label: 'Tasks' },
    { path: '/admin/resources', icon: <BookOpen size={20} />, label: 'Resources' },
    { path: '/admin/blogs', icon: <NewspaperIcon size={20} />, label: 'Blogs' },
    { path: '/admin/shorts', icon: <Film size={20} />, label: 'Shorts' },
    { path: '/admin/featured-content', icon: <Star size={20} />, label: 'Featured Content' },
  ];
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  return (
    <div className="flex h-screen bg-[#f0f2f5]">
      {/* Sidebar */}
      <div 
        className={`bg-white shadow-neomorphic-sm transition-all duration-300 z-20 fixed lg:relative h-full ${
          sidebarOpen ? 'w-64' : 'w-0 lg:w-20 overflow-hidden'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className={`flex items-center justify-between h-16 px-4 border-b border-gray-100 ${!sidebarOpen && 'lg:justify-center'}`}>
            {sidebarOpen && (
              <Link to="/admin/dashboard" className="flex items-center">
                <span className="text-xl font-bold text-admin-primary">Admin</span>
                <span className="text-xl font-bold text-admin-text">Panel</span>
              </Link>
            )}
            <button 
              onClick={toggleSidebar} 
              className="p-2 rounded-md hover:bg-gray-100 lg:block hidden"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          
          {/* Sidebar links */}
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-2">
              {sidebarLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`admin-sidebar-link ${isActive(link.path) ? 'active' : ''}`}
                  >
                    {link.icon}
                    {sidebarOpen && <span>{link.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Sidebar footer */}
          <div className="p-4 border-t border-gray-100">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2" 
              onClick={handleLogout}
            >
              <LogOut size={18} />
              {sidebarOpen && <span>Logout</span>}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white shadow-neomorphic-sm z-10">
          <div className="h-16 px-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleSidebar} 
                className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <h1 className="text-xl font-semibold text-admin-text">{title}</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-admin-primary/30 w-40 md:w-64"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full hover:bg-gray-100 p-1 pr-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-admin-primary text-white">A</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium hidden md:block">Admin</span>
                    <ChevronDown size={16} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="gap-2">
                    <User size={16} />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 text-red-600" onClick={handleLogout}>
                    <LogOut size={16} />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
