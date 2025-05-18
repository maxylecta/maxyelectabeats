import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import InstrumentalCard from './InstrumentalCard';
import SearchBar from './SearchBar';
import instrumentals from '../data/instrumentals';
import FavoritesSection from './FavoritesSection';
import { useThemeStore } from '../store/themeStore';
import PremiumBeatCard from './PremiumBeatCard';

const InstrumentalShowcase: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { isDarkMode } = useThemeStore();

  const filteredInstrumentals = useMemo(() => {
    if (selectedFilter === 'favorites') {
      return [];
    }

    return instrumentals.filter(instrumental => {
      const matchesSearch = 
        instrumental.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        instrumental.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        instrumental.bpm.toString().includes(searchQuery);

      const matchesFilter = 
        selectedFilter === 'all' ||
        (selectedFilter === 'featured' && instrumental.isFeatured) ||
        instrumental.genre === selectedFilter;

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, selectedFilter]);

  return (
    <section id="beats" className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-secondary-500 bg-clip-text text-transparent">
            Browse Our Beats
          </h2>
          <p className={`max-w-2xl mx-auto mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Find the perfect sound for your next project. All instrumentals are professionally mixed and mastered.
          </p>

          {/* Search and Filter */}
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onFilterChange={setSelectedFilter}
            selectedFilter={selectedFilter}
          />
        </motion.div>

        {/* Results */}
        {selectedFilter === 'favorites' ? (
          <FavoritesSection />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Premium Beat Card */}
            <PremiumBeatCard />
            
            {/* Regular Beat Cards */}
            {filteredInstrumentals.length > 0 ? (
              filteredInstrumentals.map((instrumental, index) => (
                <InstrumentalCard
                  key={instrumental.id}
                  id={instrumental.id}
                  title={instrumental.title}
                  genre={instrumental.genre}
                  bpm={instrumental.bpm}
                  price={instrumental.price}
                  audioUrl={instrumental.audioSrc}
                  duration={instrumental.length}
                  isNew={new Date(instrumental.dateAdded) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)}
                  isFeatured={instrumental.isFeatured}
                  onNext={index < filteredInstrumentals.length - 1 ? () => {
                    const nextBeat = filteredInstrumentals[index + 1];
                    const nextCard = document.getElementById(nextBeat.id);
                    if (nextCard) {
                      nextCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  } : undefined}
                  onPrevious={index > 0 ? () => {
                    const prevBeat = filteredInstrumentals[index - 1];
                    const prevCard = document.getElementById(prevBeat.id);
                    if (prevCard) {
                      prevCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  } : undefined}
                  hasNext={index < filteredInstrumentals.length - 1}
                  hasPrevious={index > 0}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  No beats found matching your search criteria.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default InstrumentalShowcase;