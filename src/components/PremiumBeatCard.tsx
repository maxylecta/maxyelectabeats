import React from 'react';
import { motion } from 'framer-motion';
import { Music2, ArrowRight } from 'lucide-react';

const PremiumBeatCard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-accent-500/20 to-accent-600/10 backdrop-blur-sm rounded-xl overflow-hidden border border-accent-500/30 relative group"
    >
      {/* Animated gradient border */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-500/30 to-transparent opacity-50 animate-border-rotate" />
      
      <div className="relative p-6">
        <div className="flex justify-between items-start mb-6">
          <span className="bg-accent-500 text-white text-xs px-3 py-1 rounded-full font-medium">
            PREMIUM
          </span>
          <div className="bg-accent-500/20 rounded-full p-3">
            <Music2 className="w-6 h-6 text-accent-400" />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-3">
            Premium/Custom Beat
          </h3>
          <p className="text-gray-300 leading-relaxed mb-4">
            Sur-mesure, stems included, 100% exclusive.
          </p>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-3xl font-bold text-accent-400">300</span>
            <span className="text-xl text-accent-400">$ CAD</span>
            <span className="text-gray-400 ml-1">starting from</span>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
            Professional mixing & mastering
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
            Full trackout/stems included
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
            100% exclusive rights
          </div>
        </div>

        <p className="text-sm text-gray-400 italic mb-6">
          Produced by a team of professional beatmakers
        </p>

        <motion.button
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
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PremiumBeatCard;