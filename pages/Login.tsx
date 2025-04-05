
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EyeIcon, EyeOffIcon, ShieldCheck } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ParticleBackground from '@/components/common/ParticleBackground';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { login, isAdmin } from '@/services/authService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if already logged in as admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (await isAdmin()) {
        navigate('/admin/dashboard');
      }
    };
    
    checkAdminStatus();
  }, [navigate]);
  
  // Check for messages from session timeout
  useEffect(() => {
    if (location.state?.message) {
      toast({
        title: "Session Expired",
        description: location.state.message,
        variant: "destructive"
      });
      
      // Clear the message from location state
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate, toast]);
  
  const handleSubmit = async (e: React.FormEvent, isAdminLogin: boolean = false) => {
    e.preventDefault();
    
    // Validation
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Attempt login using authService
      const response = await login(email, password);
      
      if (response.success) {
        if (isAdminLogin && response.user?.role === 'admin') {
          // Admin login successful
          toast({
            title: "Admin Login Successful",
            description: "Welcome to the admin panel",
          });
          navigate('/admin/dashboard');
        } else if (isAdminLogin && response.user?.role !== 'admin') {
          // Regular user trying to access admin
          toast({
            title: "Access Denied",
            description: "You do not have admin privileges",
            variant: "destructive"
          });
        } else if (!isAdminLogin && response.user) {
          // Regular user login
          toast({
            title: "Login Successful",
            description: "Welcome back to StudentConnect!",
          });
          
          // Navigate based on role
          if (response.user.role === 'admin') {
            navigate('/admin/dashboard');
          } else if (response.user.role === 'tutor') {
            navigate('/tutoring');
          } else {
            navigate('/');
          }
        }
      } else {
        // Login failed
        toast({
          title: "Login Failed",
          description: response.error || "Invalid credentials",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="relative min-h-[80vh] flex items-center justify-center p-4 overflow-hidden">
        {/* Enhanced Background with Animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-education-50 via-education-100 to-education-200 opacity-70"></div>
        <div className="absolute inset-0">
          <ParticleBackground />
        </div>
        
        {/* Animated Hero Text */}
        <motion.div 
          className="absolute top-10 text-center w-full px-4 z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Welcome to StudentConnect</h1>
          <p className="text-gray-600 max-w-xl mx-auto">Where learning meets opportunity. Sign in to continue your educational journey.</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="z-10 w-full max-w-md"
        >
          <Card className="w-full max-w-md mx-auto overflow-hidden shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <Tabs defaultValue="user" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="user">Student Login</TabsTrigger>
                <TabsTrigger value="admin">Admin Login</TabsTrigger>
              </TabsList>
              
              {/* User Login Tab */}
              <TabsContent value="user">
                <CardHeader className="pb-6 pt-8 px-8 bg-gradient-to-r from-education-500 to-education-600 text-white">
                  <CardTitle className="text-2xl font-bold text-center">Student Sign In</CardTitle>
                  <CardDescription className="text-center text-education-50">
                    Access your StudentConnect account
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="px-8 pt-8">
                  <form onSubmit={(e) => handleSubmit(e, false)}>
                    <div className="grid gap-6">
                      <div className="grid gap-2">
                        <Label htmlFor="user-email" className="text-gray-700 font-medium">Email</Label>
                        <div className="relative">
                          <Input
                            id="user-email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="h-12 pl-4 pr-4 border-gray-300 bg-white/70 focus:ring-education-500 focus:border-education-500 transition-all duration-300"
                          />
                        </div>
                      </div>
                      
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="user-password" className="text-gray-700 font-medium">Password</Label>
                          <Link 
                            to="/forgot-password" 
                            className="text-sm text-education-600 hover:text-education-700 transition-colors font-medium"
                          >
                            Forgot Password?
                          </Link>
                        </div>
                        <div className="relative">
                          <Input
                            id="user-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="h-12 pl-4 pr-12 border-gray-300 bg-white/70 focus:ring-education-500 focus:border-education-500 transition-all duration-300"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                          >
                            {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                          </button>
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-education-600 hover:bg-education-700 text-white font-medium text-base transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-md"
                        disabled={loading}
                      >
                        {loading ? "Signing in..." : "Sign In"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
                
                <CardFooter className="flex flex-col space-y-4 px-8 pb-8 pt-0">
                  <div className="text-center mt-4">
                    <p className="text-gray-600">
                      Don&apos;t have an account?{' '}
                      <Link to="/signup" className="font-medium text-education-600 hover:text-education-700 transition-colors">
                        Sign up
                      </Link>
                    </p>
                  </div>
                  
                  <div className="text-center text-xs text-gray-500 mt-6">
                    <p>By signing in, you agree to our <Link to="/terms" className="underline hover:text-education-600">Terms of Service</Link> and <Link to="/privacy" className="underline hover:text-education-600">Privacy Policy</Link></p>
                  </div>
                </CardFooter>
              </TabsContent>
              
              {/* Admin Login Tab */}
              <TabsContent value="admin">
                <CardHeader className="pb-6 pt-8 px-8 bg-gradient-to-r from-admin-primary to-admin-secondary text-white">
                  <div className="flex justify-center mb-2">
                    <div className="w-16 h-16 bg-admin-primary rounded-full flex items-center justify-center shadow-lg">
                      <ShieldCheck className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-center">Admin Access</CardTitle>
                  <CardDescription className="text-center text-white/80">
                    Enter your credentials to access the admin panel
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="px-8 pt-8">
                  <form onSubmit={(e) => handleSubmit(e, true)}>
                    <div className="grid gap-6">
                      <div className="grid gap-2">
                        <Label htmlFor="admin-email" className="text-gray-700 font-medium">Email</Label>
                        <div className="relative">
                          <Input
                            id="admin-email"
                            type="email"
                            placeholder="admin@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="h-12 pl-4 pr-4 border-gray-300 bg-white/70 focus:ring-admin-primary focus:border-admin-primary admin-input transition-all duration-300"
                          />
                        </div>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="admin-password" className="text-gray-700 font-medium">Password</Label>
                        <div className="relative">
                          <Input
                            id="admin-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="h-12 pl-4 pr-12 border-gray-300 bg-white/70 focus:ring-admin-primary focus:border-admin-primary admin-input transition-all duration-300"
                            autoComplete="current-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                          >
                            {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                          </button>
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-admin-primary hover:bg-admin-secondary text-white font-medium text-base transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-md"
                        disabled={loading}
                      >
                        {loading ? "Signing in..." : "Sign in to Admin"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
                
                <CardFooter className="text-center text-sm text-admin-muted px-8 pb-8 pt-4">
                  <p className="w-full">
                    This panel is only accessible to administrators.
                  </p>
                </CardFooter>
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Login;
