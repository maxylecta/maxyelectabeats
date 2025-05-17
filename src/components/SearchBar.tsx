import React from 'react';
import { Search, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onFilterChange: (filter: string) => void;
  selectedFilter: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onFilterChange, selectedFilter }) => {
  const { isDarkMode } = useThemeStore();
  
  const filters = [
    { id: 'all', label: 'All Beats' },
    { id: 'favorites', label: 'Favorites', icon: <Heart size={16} /> },
    { id: 'DRILL', label: 'DRILL' },
    { id: 'DRILL MIX', label: 'DRILL MIX' },
    { id: 'AFRO BEAT', label: 'AFRO BEAT' },
    { id: 'TRAP', label: 'TRAP' },
    { id: 'R&B', label: 'R&B' }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="relative mb-4">
        <div className={`relative rounded-full shadow-lg ${
          isDarkMode ? 'bg-dark-900/90' : 'bg-white'
        }`}>
          <Search className={`absolute left-6 top-1/2 transform -translate-y-1/2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`} size={20} />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search for beats by name, genre, or BPM..."
            className={`w-full bg-transparent rounded-full px-16 py-4 outline-none border transition-all duration-300 ${
              isDarkMode 
                ? 'text-white placeholder-gray-400 border-dark-700/50 focus:border-primary-500/50'
                : 'text-gray-900 placeholder-gray-500 border-gray-200 focus:border-primary-500/50'
            }`}
            style={{
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
            }}
          />
          <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary-500 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-lg shadow-primary-500/20"
            >
              Newest First
            </motion.button>
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
        {filters.map((filter) => (
          <motion.button
            key={filter.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onFilterChange(filter.id)}
            className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
              selectedFilter === filter.id
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                : isDarkMode
                  ? 'bg-dark-900/90 text-gray-300 hover:bg-dark-800/90 border border-dark-700/50'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {filter.icon}
            {filter.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;