import React from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '../store/userStore';
import InstrumentalCard from './InstrumentalCard';
import instrumentals from '../data/instrumentals';
import { Heart } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

const FavoritesSection: React.FC = () => {
  const { favorites } = useUserStore();
  const { isDarkMode } = useThemeStore();
  
  const favoriteBeats = instrumentals.filter(beat => favorites.includes(beat.id));

  if (favoriteBeats.length === 0) {
    return (
      <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg">No favorite beats yet.</p>
        <p className="text-sm mt-2">Click the heart icon on any beat to add it to your favorites.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {favoriteBeats.map((instrumental, index) => (
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
          onNext={index < favoriteBeats.length - 1 ? () => {
            const nextBeat = favoriteBeats[index + 1];
            const nextCard = document.getElementById(nextBeat.id);
            if (nextCard) {
              nextCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          } : undefined}
          onPrevious={index > 0 ? () => {
            const prevBeat = favoriteBeats[index - 1];
            const prevCard = document.getElementById(prevBeat.id);
            if (prevCard) {
              prevCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          } : undefined}
          hasNext={index < favoriteBeats.length - 1}
          hasPrevious={index > 0}
        />
      ))}
    </div>
  );
};

export default FavoritesSection;