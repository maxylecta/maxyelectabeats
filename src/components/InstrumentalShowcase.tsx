import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import InstrumentalCard from './InstrumentalCard';
import Filter from './Filter';
import instrumentals, { Instrumental, SortOption, sortOptions } from '../data/instrumentals';
import { Search, ArrowUpDown } from 'lucide-react';

const InstrumentalShowcase: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [filteredInstrumentals, setFilteredInstrumentals] = useState<Instrumental[]>(instrumentals);
  
  const filterOptions = [
    { id: 'all', label: 'All Beats' },
    { id: 'DRILL', label: 'DRILL' },
    { id: 'DRILL MIX TRAP', label: 'DRILL MIX TRAP' },
    { id: 'TRAP', label: 'TRAP' },
    { id: 'R&B', label: 'R&B' },
    { id: 'AFRO TRAP', label: 'AFRO TRAP' },
    { id: 'AFRO DRILL', label: 'AFRO DRILL' },
    { id: 'DANCEHALL', label: 'DANCEHALL' },
    { id: 'REGGAE DANCEHALL', label: 'REGGAE DANCEHALL' },
    { id: 'REGGAE', label: 'REGGAE' },
    { id: 'featured', label: 'Featured' },
  ];
  
  useEffect(() => {
    let filtered = [...instrumentals];
    
    // Apply genre filter
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'featured') {
        filtered = filtered.filter(beat => beat.isFeatured);
      } else {
        filtered = filtered.filter(beat => beat.genre === selectedFilter);
      }
    }
    
    // Apply search filter
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(beat => 
        beat.title.toLowerCase().includes(lowercasedSearch) ||
        beat.genre.toLowerCase().includes(lowercasedSearch)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'bpm-asc':
          return a.bpm - b.bpm;
        case 'bpm-desc':
          return b.bpm - a.bpm;
        case 'date-desc':
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        default:
          return 0;
      }
    });
    
    setFilteredInstrumentals(filtered);
  }, [selectedFilter, searchTerm, sortBy]);
  
  return (
    <section id="beats" className="py-16 bg-dark-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-electa font-bold mb-4 bg-gradient-to-r from-primary-400 to-secondary-500 bg-clip-text text-transparent">
            Browse Our Beats
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Find the perfect sound for your next project. All instrumentals are professionally mixed and mastered.
          </p>
        </motion.div>
        
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by title or genre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-dark-800 border border-dark-700 focus:border-primary-500 rounded-full pl-10 pr-4 py-2 text-white placeholder-gray-500 outline-none transition"
              />
            </div>
            
            <div className="relative w-full md:w-64">
              <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full bg-dark-800 border border-dark-700 focus:border-primary-500 rounded-full pl-10 pr-4 py-2 text-white outline-none appearance-none cursor-pointer transition"
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto pb-4 mb-8 scrollbar-hide">
          <Filter 
            options={filterOptions} 
            selectedFilter={selectedFilter} 
            onFilterChange={setSelectedFilter} 
          />
        </div>
        
        {filteredInstrumentals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInstrumentals.map(instrumental => (
              <InstrumentalCard key={instrumental.id} instrumental={instrumental} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No instrumentals found matching your criteria.</p>
            <button 
              onClick={() => {
                setSelectedFilter('all');
                setSearchTerm('');
                setSortBy('date-desc');
              }}
              className="mt-4 text-primary-500 hover:text-primary-400"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default InstrumentalShowcase;