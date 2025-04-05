
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { EyeIcon, EyeOffIcon, GraduationCap, BookOpen } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ParticleBackground from '@/components/common/ParticleBackground';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { register } from '@/services/authService';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userRole, setUserRole] = useState<'user' | 'tutor'>('user');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    if (!validateEmail(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      let finalEmail = email;
      if (userRole === 'tutor' && !email.endsWith('@tutor.com')) {
        const basePart = email.split('@')[0];
        finalEmail = `${basePart}@tutor.com`;
      }
      
      const response = await register(finalEmail, password, name, userRole);
      
      if (response.success) {
        toast({
          title: "Account Created",
          description: `Welcome to StudentConnect, ${name}!`,
        });
        
        // Direct users to the appropriate page based on role
        if (userRole === 'tutor') {
          navigate('/tutoring', { state: { fromSignup: true, userRole: 'tutor' } });
        } else {
          navigate('/', { state: { fromSignup: true } });
        }
      } else {
        toast({
          title: "Registration Failed",
          description: response.error || "An error occurred during registration",
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
        <div className="absolute inset-0 bg-gradient-to-br from-education-50 via-education-100 to-education-200 opacity-70"></div>
        <div className="absolute inset-0">
          <ParticleBackground />
        </div>
        
        <motion.div 
          className="absolute top-10 text-center w-full px-4 z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Join StudentConnect</h1>
          <p className="text-gray-600 max-w-xl mx-auto">Create an account to start your educational journey</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="z-10 w-full max-w-md"
        >
          <Card className="w-full max-w-md mx-auto overflow-hidden shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-6 pt-8 px-8 bg-gradient-to-r from-education-500 to-education-600 text-white">
              <CardTitle className="text-2xl font-bold text-center">Create Your Account</CardTitle>
              <CardDescription className="text-center text-education-50">
                Join the StudentConnect community today
              </CardDescription>
            </CardHeader>
            
            <CardContent className="px-8 pt-8">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-12 pl-4 pr-4 border-gray-300 bg-white/70 focus:ring-education-500 focus:border-education-500 transition-all duration-300"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 pl-4 pr-4 border-gray-300 bg-white/70 focus:ring-education-500 focus:border-education-500 transition-all duration-300"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
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
                  
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="h-12 pl-4 pr-4 border-gray-300 bg-white/70 focus:ring-education-500 focus:border-education-500 transition-all duration-300"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label className="text-gray-700 font-medium">I am a:</Label>
                    <RadioGroup 
                      value={userRole} 
                      onValueChange={(val) => setUserRole(val as 'user' | 'tutor')}
                      className="flex flex-col sm:flex-row gap-4 mt-2"
                    >
                      <div className={`flex-1 flex items-center gap-3 p-4 rounded-lg border ${
                        userRole === 'user' ? 'border-education-500 bg-education-50' : 'border-gray-200'
                      } transition-all duration-300 cursor-pointer`}
                      onClick={() => setUserRole('user')}>
                        <RadioGroupItem value="user" id="user" />
                        <div className="flex flex-col">
                          <Label htmlFor="user" className="font-medium cursor-pointer">
                            <div className="flex items-center gap-2">
                              <GraduationCap className="h-5 w-5 text-education-600" />
                              <span>Student</span>
                            </div>
                          </Label>
                          <span className="text-xs text-gray-500">Looking to learn and find tutors</span>
                        </div>
                      </div>
                      
                      <div className={`flex-1 flex items-center gap-3 p-4 rounded-lg border ${
                        userRole === 'tutor' ? 'border-education-500 bg-education-50' : 'border-gray-200'
                      } transition-all duration-300 cursor-pointer`}
                      onClick={() => setUserRole('tutor')}>
                        <RadioGroupItem value="tutor" id="tutor" />
                        <div className="flex flex-col">
                          <Label htmlFor="tutor" className="font-medium cursor-pointer">
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-5 w-5 text-education-600" />
                              <span>Tutor</span>
                            </div>
                          </Label>
                          <span className="text-xs text-gray-500">Looking to teach and get hired</span>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-education-600 hover:bg-education-700 text-white font-medium text-base transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-md"
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                </div>
              </form>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4 px-8 pb-8 pt-0">
              <div className="text-center mt-4">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-education-600 hover:text-education-700 transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
              
              <div className="text-center text-xs text-gray-500 mt-6">
                <p>By signing up, you agree to our <Link to="/terms" className="underline hover:text-education-600">Terms of Service</Link> and <Link to="/privacy" className="underline hover:text-education-600">Privacy Policy</Link></p>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Signup;
