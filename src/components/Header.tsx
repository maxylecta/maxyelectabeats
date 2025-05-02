import React, { useState, useEffect } from 'react';
import { Music, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-dark-900/90 backdrop-blur-md py-2 shadow-lg' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Music className="text-primary-500 h-8 w-8 mr-2" />
          <span className="font-electa text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-500 bg-clip-text text-transparent">
            MAXY ELECTA
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 items-center">
          <NavLink href="#home">Home</NavLink>
          <NavLink href="#beats">Beats</NavLink>
          <NavLink href="#about">About</NavLink>
          <NavLink href="#contact">Contact</NavLink>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-full font-medium transition-colors duration-300"
          >
            Get Started
          </motion.button>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMenu} 
          className="md:hidden text-white"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-dark-900 absolute top-full left-0 w-full"
        >
          <div className="py-4 px-4 flex flex-col space-y-4">
            <MobileNavLink href="#home" onClick={() => setMenuOpen(false)}>Home</MobileNavLink>
            <MobileNavLink href="#beats" onClick={() => setMenuOpen(false)}>Beats</MobileNavLink>
            <MobileNavLink href="#about" onClick={() => setMenuOpen(false)}>About</MobileNavLink>
            <MobileNavLink href="#contact" onClick={() => setMenuOpen(false)}>Contact</MobileNavLink>
            <button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 w-full">
              Get Started
            </button>
          </div>
        </motion.div>
      )}
    </header>
  );
};

const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a 
    href={href} 
    className="text-white hover:text-primary-400 font-medium transition-colors duration-300"
  >
    {children}
  </a>
);

const MobileNavLink: React.FC<{ href: string; onClick: () => void; children: React.ReactNode }> = ({ 
  href, 
  onClick, 
  children 
}) => (
  <a 
    href={href} 
    onClick={onClick}
    className="text-white hover:text-primary-400 py-2 font-medium transition-colors duration-300 block"
  >
    {children}
  </a>
);

export default Header;