import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

type FilterOption = {
  id: string;
  label: string;
};

interface FilterProps {
  options: FilterOption[];
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const Filter: React.FC<FilterProps> = ({ options, selectedFilter, onFilterChange }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {options.map((option) => (
        <FilterButton
          key={option.id}
          active={selectedFilter === option.id}
          onClick={() => onFilterChange(option.id)}
        >
          {option.label}
        </FilterButton>
      ))}
    </div>
  );
};

interface FilterButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ children, active, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full transition-all duration-300 font-medium relative overflow-hidden",
        active 
          ? "text-white bg-primary-500 shadow-lg shadow-primary-500/30" 
          : "text-gray-300 bg-dark-800 hover:bg-dark-700"
      )}
    >
      {children}
      {active && (
        <motion.span 
          className="absolute inset-0 bg-primary-400 mix-blend-overlay opacity-50"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 0.4 }}
        />
      )}
    </motion.button>
  );
};

export default Filter;