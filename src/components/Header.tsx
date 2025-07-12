import React, { useState, useEffect } from 'react';
import { Music, Menu, X, User, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import { useThemeStore } from '../store/themeStore';
import { useAuthContext } from '../context/AuthContext';
import SubscriptionModal from './SubscriptionModal';
import AuthModal from './AuthModal';
import PlanSelectionModal from './PlanSelectionModal';
import UserProfile from './UserProfile';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [planSelectionModalOpen, setPlanSelectionModalOpen] = useState(false);
  const [userProfileOpen, setUserProfileOpen] = useState(false);
  const { isDarkMode } = useThemeStore();
  const { user, profile, loading, isNewUser, setIsNewUser } = useAuthContext();

  // Show plan selection modal for users who need to select a plan
  useEffect(() => {
    if (user && profile && !loading && !planSelectionModalOpen) {
      const hasSeenPlanSelection = sessionStorage.getItem(`hasSeenPlanSelection_${user.id}`);
      
      // Show plan selection if:
      // 1. User is new (just signed up)
      // 2. User has free plan and hasn't seen the modal before
      // 3. User just logged in and has free plan
      const shouldShowPlanSelection = 
        isNewUser || 
        (profile.subscription_plan === 'free' && !hasSeenPlanSelection);
      
      if (shouldShowPlanSelection) {
        // Small delay to ensure smooth UX
        setTimeout(() => {
          setPlanSelectionModalOpen(true);
        }, 1000);
      }
    }
  }, [user, profile, loading, isNewUser]);

  const handlePlanSelectionComplete = () => {
    if (user) {
      sessionStorage.setItem(`hasSeenPlanSelection_${user.id}`, 'true');
    }
    setIsNewUser(false);
    setPlanSelectionModalOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const headerOffset = 80;
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setMenuOpen(false);
  };

  const handleGetStarted = () => {
    if (user) {
      setSubscriptionModalOpen(true);
    } else {
      setAuthModalOpen(true);
    }
  };

  const getPlanColor = (plan?: string) => {
    switch (plan) {
      case 'basic': return 'text-success-400';
      case 'pro': return 'text-secondary-400';
      case 'premium': return 'text-accent-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <>
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled 
            ? isDarkMode ? 'bg-dark-900/90 backdrop-blur-md' : 'bg-white/90 backdrop-blur-md'
            : 'bg-transparent'
        } ${isDarkMode ? '' : 'border-b border-gray-200'} py-4`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Music className="text-primary-500 h-8 w-8 mr-2" />
            <span className="font-electa text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-500 bg-clip-text text-transparent">
              MAXY ELECTA
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink onClick={() => scrollToSection('home')}>Home</NavLink>
            <NavLink onClick={() => scrollToSection('beats')}>Beats</NavLink>
            <NavLink onClick={() => scrollToSection('about')}>About</NavLink>
            <NavLink onClick={() => scrollToSection('contact')}>Contact</NavLink>
            <ThemeToggle />
            
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-4">
                    {profile && profile.subscription_plan !== 'free' && (
                      <span className={`text-sm font-medium ${getPlanColor(profile.subscription_plan)}`}>
                        {profile.subscription_plan.toUpperCase()}
                      </span>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setUserProfileOpen(true)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                        isDarkMode ? 'bg-dark-800 hover:bg-dark-700' : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      <User size={20} />
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setAuthModalOpen(true)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors duration-300 ${
                        isDarkMode
                          ? 'text-white hover:text-primary-400'
                          : 'text-gray-800 hover:text-primary-600'
                      }`}
                    >
                      <LogIn size={20} />
                      Sign In
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleGetStarted}
                      className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-full font-medium transition-colors duration-300"
                    >
                      Get Started
                    </motion.button>
                  </div>
                )}
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            {!loading && user && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setUserProfileOpen(true)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  isDarkMode ? 'bg-dark-800 hover:bg-dark-700' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <User size={16} />
              </motion.button>
            )}
            <button 
              onClick={() => setMenuOpen(!menuOpen)} 
              className={isDarkMode ? "text-white" : "text-gray-800"}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`md:hidden absolute top-full left-0 w-full ${
              isDarkMode ? 'bg-dark-900' : 'bg-white'
            }`}
          >
            <div className="py-4 px-4 flex flex-col space-y-4">
              <MobileNavLink onClick={() => scrollToSection('home')}>Home</MobileNavLink>
              <MobileNavLink onClick={() => scrollToSection('beats')}>Beats</MobileNavLink>
              <MobileNavLink onClick={() => scrollToSection('about')}>About</MobileNavLink>
              <MobileNavLink onClick={() => scrollToSection('contact')}>Contact</MobileNavLink>
              
              {!loading && (
                <>
                  {!user && (
                    <>
                      <button 
                        onClick={() => {
                          setAuthModalOpen(true);
                          setMenuOpen(false);
                        }}
                        className={`py-2 font-medium transition-colors duration-300 block w-full text-left ${
                          isDarkMode
                            ? 'text-white hover:text-primary-400'
                            : 'text-gray-800 hover:text-primary-600'
                        }`}
                      >
                        Sign In
                      </button>
                      <button 
                        onClick={() => {
                          handleGetStarted();
                          setMenuOpen(false);
                        }}
                        className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 w-full"
                      >
                        Get Started
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </header>

      <SubscriptionModal 
        isOpen={subscriptionModalOpen}
        onClose={() => setSubscriptionModalOpen(false)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <PlanSelectionModal
        isOpen={planSelectionModalOpen}
        onClose={() => setPlanSelectionModalOpen(false)}
        onPlanSelected={handlePlanSelectionComplete}
      />

      <UserProfile
        isOpen={userProfileOpen}
        onClose={() => setUserProfileOpen(false)}
      />
    </>
  );
};

const NavLink: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => {
  const { isDarkMode } = useThemeStore();
  return (
    <button 
      onClick={onClick}
      className={`font-medium transition-colors duration-300 ${
        isDarkMode
          ? 'text-white hover:text-primary-400'
          : 'text-gray-800 hover:text-primary-600'
      }`}
    >
      {children}
    </button>
  );
};

const MobileNavLink: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ 
  onClick, 
  children 
}) => {
  const { isDarkMode } = useThemeStore();
  return (
    <button 
      onClick={onClick}
      className={`py-2 font-medium transition-colors duration-300 block w-full text-left ${
        isDarkMode
          ? 'text-white hover:text-primary-400'
          : 'text-gray-800 hover:text-primary-600'
      }`}
    >
      {children}
    </button>
  );
};

export default Header;