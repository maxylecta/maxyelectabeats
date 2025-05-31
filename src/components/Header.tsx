import React, { useState, useEffect } from 'react';
import { Music, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import { useThemeStore } from '../store/themeStore';
import SubscriptionModal from './SubscriptionModal';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const { isDarkMode } = useThemeStore();

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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSubscriptionModalOpen(true)}
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-full font-medium transition-colors duration-300"
            >
              Get Started
            </motion.button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
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
              <button 
                onClick={() => {
                  setSubscriptionModalOpen(true);
                  setMenuOpen(false);
                }}
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 w-full"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </header>

      <SubscriptionModal 
        isOpen={subscriptionModalOpen}
        onClose={() => setSubscriptionModalOpen(false)}
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