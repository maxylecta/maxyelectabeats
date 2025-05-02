import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import InstrumentalShowcase from './components/InstrumentalShowcase';
import Chat from './components/Chat';
import Hero from './components/Hero';
import About from './components/About';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-dark-950 text-white">
      <Header />
      <main className="flex-grow">
        <Hero />
        <section className="py-24 container mx-auto px-4">
          <div className="max-w-5xl mx-auto mb-32">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-400 via-secondary-500 to-primary-400 bg-clip-text text-transparent mb-4 text-center">
              Welcome to Maxy Electa Studio
            </h1>
            <p className="text-gray-400 text-center text-lg mb-12">
              How can we help you find your perfect beat today?
            </p>
            <Chat className="w-full" />
          </div>
          <InstrumentalShowcase />
        </section>
        <About />
      </main>
      <Footer />
    </div>
  );
}

export default App;