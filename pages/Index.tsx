
import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { useIsFromSignup } from '@/hooks/useIsFromSignup';
import { getCurrentUserSync, isTutorSync, isAuthenticated } from '@/services/authService';
import { useAuthState } from '@/hooks/useAuthState';

// Import components
import AnimatedHeader from '@/components/home/AnimatedHeader';
import SlidingCardsCarousel from '@/components/home/SlidingCardsCarousel';
import FeaturesSection from '@/components/home/FeaturesSection';
import WhyHowSection from '@/components/home/WhyHowSection';
import FeedbackSection from '@/components/home/FeedbackSection';
import ParticleBackground from '@/components/common/ParticleBackground';
import IndiaEducationGrowth from '@/components/home/IndiaEducationGrowth';

const HeroSection = ({ hidden = false }) => {
  if (hidden) return null;
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-16 px-4">
      <ParticleBackground />
      
      <div className="container mx-auto text-center max-w-4xl z-10">
        <AnimatedHeader />
        
        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-education-800 via-education-600 to-education-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Connect, Learn, Succeed
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          StudentConnect brings together students and tutors to create the perfect learning experience
        </motion.p>
        
        <SlidingCardsCarousel />
      </div>
    </section>
  );
};

const Index = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const isFromSignup = useIsFromSignup();
  const navigate = useNavigate();
  const { isAuthenticated: isLoggedIn, user } = useAuthState();
  
  // Redirect tutors who just signed up to the tutoring page
  useEffect(() => {
    if (isFromSignup && user?.role === 'tutor') {
      navigate('/tutoring');
    }
  }, [isFromSignup, user, navigate]);
  
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <Layout showDeveloperSection={true} hideHeroSection={isLoggedIn || isFromSignup}>
      <HeroSection hidden={isLoggedIn || isFromSignup} />
      
      {isLoggedIn ? (
        <IndiaEducationGrowth />
      ) : null}
      
      <div ref={featuresRef}>
        <FeaturesSection />
        <WhyHowSection />
        <FeedbackSection />
      </div>
    </Layout>
  );
};

export default Index;
