import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AudioPlayer from './AudioPlayer';
import instrumentals from '../data/instrumentals';

const InstrumentalShowcase: React.FC = () => {
  const isNew = (dateAdded: string) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(dateAdded) > thirtyDaysAgo;
  };

  return (
    <section id="beats" className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-secondary-500 bg-clip-text text-transparent">
            Featured Beats
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Professional instrumentals ready for your next hit. All beats are mixed and mastered to industry standards.
          </p>
        </motion.div>

        <div className="grid gap-2">
          {instrumentals.map((instrumental) => (
            <AudioPlayer
              key={instrumental.id}
              title={instrumental.title}
              genre={instrumental.genre}
              bpm={instrumental.bpm}
              price={instrumental.price}
              audioUrl={instrumental.audioSrc}
              duration={instrumental.length}
              isNew={isNew(instrumental.dateAdded)}
              isFeatured={instrumental.isFeatured}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstrumentalShowcase;