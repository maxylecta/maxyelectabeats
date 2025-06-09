import React from 'react';
import { Music, Instagram, Twitter, Youtube, Facebook } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

const Footer: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  
  const scrollToContact = () => {
    const section = document.getElementById('contact');
    if (section) {
      const headerOffset = 80;
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <footer className={`${isDarkMode ? 'bg-dark-900 text-gray-400' : 'bg-gray-100 text-gray-600'} pt-12 pb-6`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center mb-4">
              <Music className="text-primary-500 h-6 w-6 mr-2" />
              <span className="font-electa text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-500 bg-clip-text text-transparent">
                MAXY ELECTA BEATS
              </span>
            </div>
            <p className="mb-4">
              Professional audio instrumentals for artists who demand excellence. Find your perfect sound and elevate your music.
            </p>
            <div className="flex space-x-4">
              <SocialIcon 
                icon={<Instagram size={20} />} 
                href="https://www.instagram.com/maxyelectabeats/"
              />
              <SocialIcon 
                icon={<Twitter size={20} />} 
                href="https://x.com/MaxyElectaBeats"
              />
              <SocialIcon 
                icon={<Youtube size={20} />} 
                href="https://www.youtube.com/@MaxyElectaBeats"
              />
              <SocialIcon 
                icon={<Facebook size={20} />} 
                href="https://www.facebook.com/profile.php?id=61577003585687"
              />
            </div>
          </div>
          
          <div>
            <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-bold mb-4`}>Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink href="#home">Home</FooterLink>
              <FooterLink href="#beats">Beats</FooterLink>
              <FooterLink href="#about">About</FooterLink>
              <FooterLink href="#contact">Contact</FooterLink>
            </ul>
          </div>
          
          <div>
            <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-bold mb-4`}>Beat Genres</h3>
            <ul className="space-y-2">
              <FooterLink href="#beats">DRILL</FooterLink>
              <FooterLink href="#beats">DRILL MIX</FooterLink>
              <FooterLink href="#beats">TRAP</FooterLink>
              <FooterLink href="#beats">R&B</FooterLink>
            </ul>
          </div>
          
          <div>
            <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-bold mb-4`}>Contact</h3>
            <p className="mb-2">Have questions? Chat with us directly using the chat widget or contact us below.</p>
            <button 
              onClick={scrollToContact}
              className="mt-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300"
            >
              Contact Us
            </button>
          </div>
        </div>
        
        <div className={`border-t ${isDarkMode ? 'border-dark-700' : 'border-gray-200'} pt-6 mt-6 text-center text-sm`}>
          <p>&copy; {new Date().getFullYear()} Maxy Electa Beats. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon: React.FC<{ icon: React.ReactNode; href?: string }> = ({ icon, href }) => {
  const { isDarkMode } = useThemeStore();
  
  if (href) {
    return (
      <a 
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-primary-500 transition-colors duration-300 ${
          isDarkMode ? 'bg-dark-800' : 'bg-gray-200'
        }`}
      >
        {icon}
      </a>
    );
  }
  
  return (
    <a 
      href="#" 
      className={`w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-primary-500 transition-colors duration-300 ${
        isDarkMode ? 'bg-dark-800' : 'bg-gray-200'
      }`}
    >
      {icon}
    </a>
  );
};

const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => {
  const { isDarkMode } = useThemeStore();
  return (
    <li>
      <a 
        href={href} 
        className={`hover:text-primary-400 transition-colors duration-300 ${
          isDarkMode ? 'text-gray-400 hover:text-primary-400' : 'text-gray-600 hover:text-primary-600'
        }`}
      >
        {children}
      </a>
    </li>
  );
};

export default Footer;