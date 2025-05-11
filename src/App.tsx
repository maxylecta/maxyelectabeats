import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import InstrumentalShowcase from './components/InstrumentalShowcase';
import Chat from './components/Chat';
import Hero from './components/Hero';
import About from './components/About';
import { AudioProvider } from './context/AudioContext';
import { MessageCircle } from 'lucide-react';

export default function App() {
  return (
    <AudioProvider>
      <div className="min-h-screen flex flex-col bg-dark-950 text-white">
        <Header />
        <main className="flex-grow">
          <Hero />
          <section className="py-24 container mx-auto px-4">
            <div className="max-w-5xl mx-auto mb-32 relative">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-400 via-secondary-500 to-primary-400 bg-clip-text text-transparent mb-4 text-center">
                Welcome to Maxy Electa Beats
              </h1>
              <p className="text-gray-400 text-center text-lg mb-12">
                How can we help you find your perfect beat today?
              </p>
              <div className="relative">
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-primary-400 bg-dark-900/90 px-4 py-2 rounded-full shadow-lg animate-bounce">
                  <MessageCircle size={20} />
                  <span className="font-medium">Need help?</span>
                </div>
                <div className="relative rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,102,255,0.3)]">
                  {/* Animated border container */}
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 animate-border-rotate">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50" />
                    </div>
                    <div className="absolute inset-0 animate-border-rotate-reverse">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary-500 to-transparent opacity-50" />
                    </div>
                    <div className="absolute inset-0 animate-border-rotate-slow">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-500 to-transparent opacity-30" />
                    </div>
                  </div>
                  {/* Content container */}
                  <div className="relative bg-dark-900/95 m-[2px] rounded-2xl">
                    <Chat className="w-full" />
                  </div>
                </div>
              </div>
            </div>
            <InstrumentalShowcase />
          </section>
          <About />
        </main>
        <Footer />
      </div>
    </AudioProvider>
  );
}