import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import InstrumentalShowcase from './components/InstrumentalShowcase';
import Chat from './components/Chat';
import Hero from './components/Hero';
import About from './components/About';
import SuccessPage from './pages/SuccessPage';
import CancelPage from './pages/CancelPage';
import { AudioProvider } from './context/AudioContext';
import { AuthProvider } from './context/AuthContext';
import { MessageCircle } from 'lucide-react';
import { useThemeStore } from './store/themeStore';
import { Toaster } from 'react-hot-toast';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    document.body.className = isDarkMode ? 'bg-black' : 'bg-gray-50';
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen flex flex-col ${
      isDarkMode ? 'bg-dark-950 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: isDarkMode ? '#1f2937' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#1f2937',
            borderRadius: '0.75rem',
            border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
          },
        }}
      />
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AudioProvider>
          <Routes>
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/cancel" element={<CancelPage />} />
            <Route path="/" element={
              <MainLayout>
                <Hero />
                <section className="py-24 container mx-auto px-4">
                  <div className="max-w-5xl mx-auto mb-32 relative\" id="contact">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-400 via-secondary-500 to-primary-400 bg-clip-text text-transparent mb-4 text-center">
                      Welcome to Maxy Electa Beats
                    </h1>
                    <p className="text-center text-lg mb-12 text-gray-400">
                      How can we help you find your perfect beat today?
                    </p>
                    <div className="relative">
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-primary-400 bg-dark-900/90 px-4 py-2 rounded-full shadow-lg animate-bounce">
                        <MessageCircle size={20} />
                        <span className="font-medium">Need help?</span>
                      </div>
                      <div className="relative rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,102,255,0.3)]">
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
                        <div className="relative m-[2px] rounded-2xl bg-dark-900/95">
                          <Chat className="w-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <InstrumentalShowcase />
                </section>
                <About />
              </MainLayout>
            } />
          </Routes>
        </AudioProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}