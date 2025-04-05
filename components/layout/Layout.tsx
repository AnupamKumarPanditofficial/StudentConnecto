
import React, { ReactNode, useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import ChatbotButton from '../common/ChatbotButton';
import DevelopersSection from '../common/DevelopersSection';
import { useLocation } from 'react-router-dom';
import SessionTimeout from '../common/SessionTimeout';
import { isAuthenticated } from '@/services/authService';

interface LayoutProps {
  children: ReactNode;
  showDeveloperSection?: boolean;
  hideHeroSection?: boolean;
  neomorphicBackground?: boolean;
}

const Layout = ({ 
  children, 
  showDeveloperSection = true, 
  hideHeroSection = false, 
  neomorphicBackground = false 
}: LayoutProps) => {
  const location = useLocation();
  const [hideHero, setHideHero] = useState(hideHeroSection);
  const isIndexPage = location.pathname === '/';
  const isLoggedIn = isAuthenticated();
  const isProfilePage = location.pathname === '/my-profile';
  
  // Check if user is coming from signup or is logged in
  useEffect(() => {
    if ((location.state?.fromSignup && isIndexPage) || isLoggedIn) {
      setHideHero(true);
      // Clear the state
      if (location.state?.fromSignup) {
        window.history.replaceState({}, document.title);
      }
    }
  }, [location, isIndexPage, isLoggedIn]);
  
  // Only show DevelopersSection on the index page
  const shouldShowDevelopersSection = isIndexPage && showDeveloperSection;

  return (
    <div className={`flex flex-col min-h-screen ${neomorphicBackground || isProfilePage ? 'bg-gray-50' : ''}`}>
      <Header />
      <main className={`flex-grow ${isProfilePage ? 'bg-gradient-to-br from-gray-50 to-gray-100' : ''}`}>
        {children}
      </main>
      <ChatbotButton />
      {shouldShowDevelopersSection && <DevelopersSection />}
      <Footer />
      {isLoggedIn && <SessionTimeout />}
    </div>
  );
};

export default Layout;
