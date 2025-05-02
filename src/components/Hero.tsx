import React from 'react';
import { motion } from 'framer-motion';
import { Play, ShoppingCart } from 'lucide-react';
import Wave from 'react-wavify';

const Hero: React.FC = () => {
  return (
    <section 
      id="home" 
      className="relative pt-28 pb-20 md:pt-36 md:pb-32 overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.95)), url(/src/assets/hero-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="container mx-auto px-4 z-10 relative">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-electa font-bold mb-6 bg-gradient-to-r from-primary-400 via-secondary-500 to-primary-400 bg-clip-text text-transparent">
              PREMIUM BEATS BY MAXY ELECTA
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-300 mb-10"
          >
            Unique instrumentals for artists who demand excellence. 
            Find your perfect sound and elevate your music to the next level.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <motion.a
              href="#beats"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-full font-medium transition-colors duration-300 flex items-center justify-center"
            >
              <Play size={20} className="mr-2" />
              Browse Beats
            </motion.a>
            
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-dark-800 hover:bg-dark-700 text-white border border-primary-500 px-8 py-3 rounded-full font-medium transition-colors duration-300 flex items-center justify-center"
            >
              <ShoppingCart size={20} className="mr-2" />
              Custom Order
            </motion.a>
          </motion.div>
        </div>
      </div>
      
      {/* Animated Wave Effect */}
      <div className="absolute bottom-0 left-0 w-full">
        <Wave
          fill="#0066ff20"
          paused={false}
          options={{
            height: 20,
            amplitude: 30,
            speed: 0.15,
            points: 3
          }}
        />
      </div>
    </section>
  );
};

export default Hero;