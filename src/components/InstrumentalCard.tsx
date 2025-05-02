import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, ShoppingCart, Clock, Music, Sparkles } from 'lucide-react';
import { Instrumental } from '../data/instrumentals';
import AudioPlayer from './AudioPlayer';

interface InstrumentalCardProps {
  instrumental: Instrumental;
}

const InstrumentalCard: React.FC<InstrumentalCardProps> = ({ instrumental }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const genreColors = {
    'DRILL': 'bg-primary-500',
    'DRILL MIX TRAP': 'bg-secondary-500',
    'TRAP': 'bg-accent-500',
    'R&B': 'bg-purple-500'
  };

  const isNew = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(instrumental.dateAdded) > thirtyDaysAgo;
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative bg-dark-800 rounded-xl overflow-hidden shadow-lg shadow-black/30 transition-all duration-300"
      style={{
        boxShadow: isHovered ? '0 0 30px rgba(0, 102, 255, 0.2)' : undefined
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div 
        animate={{
          scale: isHovered ? 1.02 : 1,
          brightness: isHovered ? 1.1 : 1
        }}
        transition={{ duration: 0.3 }}
        className="p-6 relative"
      >
        {instrumental.isFeatured && (
          <div className="absolute top-3 right-3 bg-accent-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Featured
          </div>
        )}
        
        {isNew() && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-3 left-3 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"
          >
            <Sparkles size={12} />
            New
          </motion.div>
        )}
        
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{instrumental.title}</h3>
            <span className={`${genreColors[instrumental.genre]} px-2 py-1 rounded-full text-xs font-semibold`}>
              {instrumental.genre}
            </span>
          </div>
          <div className="text-2xl font-electa text-primary-300">${instrumental.price.toFixed(2)}</div>
        </div>
        
        <div className="flex items-center justify-between mb-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Music size={16} />
            <span>{instrumental.bpm} BPM</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{instrumental.length}</span>
          </div>
        </div>
        
        <AudioPlayer 
          audioSrc={instrumental.audioSrc} 
          title={instrumental.title} 
        />
        
        <motion.div 
          className="mt-4 flex gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0.7, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary-500 hover:bg-primary-600 text-white flex-1 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
          >
            <ShoppingCart size={18} className="mr-2" />
            Buy Now
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-dark-700 hover:bg-dark-600 text-white px-3 py-2 rounded-lg font-medium transition-colors duration-300"
          >
            <Download size={18} />
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default InstrumentalCard;