import React from 'react';
import { motion } from 'framer-motion';
import { Music2, ArrowRight } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

const PremiumBeatCard: React.FC = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`backdrop-blur-sm rounded-xl overflow-hidden relative group ${
        isDarkMode
          ? 'bg-gradient-to-br from-accent-500/20 to-accent-600/10 border border-accent-500/30'
          : 'bg-gradient-to-br from-accent-500/10 to-accent-600/5 border border-accent-500/20'
      }`}
    >
      {/* Animated gradient border */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-500/30 to-transparent opacity-50 animate-border-rotate" />
      
      <div className="relative p-6">
        <div className="flex justify-between items-start mb-6">
          <span className="bg-accent-500 text-white text-xs px-3 py-1 rounded-full font-medium">
            PREMIUM
          </span>
          <div className={`rounded-full p-3 ${
            isDarkMode ? 'bg-accent-500/20' : 'bg-accent-500/10'
          }`}>
            <Music2 className="w-6 h-6 text-accent-500" />
          </div>
        </div>

        <div className="mb-6">
          <h3 className={`text-2xl font-bold mb-3 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Premium/Custom Beat
          </h3>
          <p className={`leading-relaxed mb-4 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Sur-mesure, stems included, 100% exclusive.
          </p>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-3xl font-bold text-accent-500">300</span>
            <span className="text-xl text-accent-500">$ CAD</span>
            <span className={`ml-1 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>starting from</span>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className={`flex items-center gap-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
            Professional mixing & mastering
          </div>
          <div className={`flex items-center gap-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
            Full trackout/stems included
          </div>
          <div className={`flex items-center gap-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
            100% exclusive rights
          </div>
        </div>

        <p className={`text-sm italic mb-6 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Produced by a team of professional beatmakers
        </p>

        <motion.a
          href="https://docs.google.com/forms/d/e/1FAIpQLSfTeBaxa_-pTpk8eu-FQytEwUsgid4fkOIvEiB7g13OXoj--Q/viewform?usp=header"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-accent-500 hover:bg-accent-600 text-white py-4 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden"
        >
          <span className="relative z-10">Demander beat</span>
          <ArrowRight 
            size={20}
            className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        </motion.a>
      </div>
    </motion.div>
  );
};

export default PremiumBeatCard;