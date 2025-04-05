
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/layout/Layout';
import ParticleBackground from '@/components/common/ParticleBackground';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }
    
    // Here you would integrate with Google Cloud Console for authentication
    toast({
      title: "Reset Email Sent",
      description: "This would send a reset email in the full version",
    });
    
    setIsSubmitted(true);
  };
  
  return (
    <Layout>
      <div className="relative min-h-[80vh] flex items-center justify-center p-4">
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Reset Your Password</h1>
          <p className="text-gray-600 max-w-xl mx-auto">We'll send you a link to reset your password and regain access to your account.</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="z-10 w-full max-w-md"
        >
          <Card className="w-full max-w-md mx-auto overflow-hidden shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-6 pt-8 px-8 bg-gradient-to-r from-education-500 to-education-600 text-white">
              <CardTitle className="text-2xl font-bold text-center">
                {isSubmitted ? "Check Your Email" : "Reset Password"}
              </CardTitle>
              <CardDescription className="text-center text-education-50">
                {isSubmitted 
                  ? "We've sent you a password reset link" 
                  : "Enter your email to receive a reset link"}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="px-8 pt-8">
              {isSubmitted ? (
                <motion.div 
                  className="text-center py-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <div className="flex justify-center mb-6">
                    <CheckCircle2 className="h-16 w-16 text-green-500" />
                  </div>
                  <p className="mb-4 text-gray-700 text-lg">
                    If an account exists with the email <strong>{email}</strong>, you'll receive a reset link shortly.
                  </p>
                  <p className="mt-2 text-gray-500">
                    Don't forget to check your spam folder if you don't see the email in your inbox.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <motion.div 
                    className="grid gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="grid gap-2">
                      <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-12 border-gray-300 bg-white/70 focus:ring-education-500 focus:border-education-500 transition-all duration-300"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-education-600 hover:bg-education-700 text-white font-medium text-base transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-md"
                    >
                      Send Reset Link
                    </Button>
                  </motion.div>
                </form>
              )}
            </CardContent>
            
            <CardFooter className="px-8 pb-8 pt-2">
              <div className="w-full text-center">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-gray-600"
                >
                  Remember your password?{' '}
                  <Link to="/login" className="font-medium text-education-600 hover:text-education-700 transition-colors">
                    Sign in
                  </Link>
                </motion.p>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
