import React from 'react';
import { motion } from 'framer-motion';
import { Music, Rocket, PenTool as Tool, Calendar, MessageCircle, Instagram } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section className="py-24 bg-dark-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-primary-400 via-secondary-500 to-primary-400 bg-clip-text text-transparent">
            About Maxy Electa Beats
          </h1>
          
          <p className="text-gray-300 text-lg text-center mb-16">
            Welcome to Maxy Electa — an independent platform dedicated to creating and selling premium beats for artists who demand excellence.
          </p>
          
          <div className="grid gap-12">
            <AboutSection
              icon={<Music className="w-8 h-8 text-primary-500" />}
              title="Our Mission"
              content="Empower artists, beatmakers, and labels by helping them find that unique sound that sets them apart, with professional-quality, accessible, and customizable instrumentals."
            />
            
            <AboutSection
              icon={<Rocket className="w-8 h-8 text-primary-500" />}
              title="Who We Are"
              content="Maxy Electa — passionate music producer, beatmaker, and sound architect. Behind every beat lies a pursuit of excellence, energy, and originality."
            />
            
            <AboutSection
              icon={<Tool className="w-8 h-8 text-primary-500" />}
              title="Our Added Value"
              content={
                <ul className="space-y-2 list-disc list-inside">
                  <li>Constantly evolving catalog of original beats: Trap, Drill, Afro, and more</li>
                  <li>Custom beat orders available</li>
                  <li>Personalized support (advice, beat selection, etc.)</li>
                </ul>
              }
            />
            
            <AboutSection
              icon={<Calendar className="w-8 h-8 text-primary-500" />}
              title="The Future"
              content="Coming soon: the launch of Studio Connect, a physical and digital space for recording, collaborative creation, and premium services."
            />
            
            <AboutSection
              icon={<MessageCircle className="w-8 h-8 text-primary-500" />}
              title="Contact"
              content={
                <div className="space-y-4">
                  <p>For any questions, special requests, or custom projects, feel free to reach out via the contact form or through Instagram.</p>
                  <a 
                    href="https://instagram.com/maxyelecta" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                    @maxyelecta
                  </a>
                </div>
              }
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

interface AboutSectionProps {
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}

const AboutSection: React.FC<AboutSectionProps> = ({ icon, title, content }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-dark-900/50 rounded-2xl p-8 backdrop-blur-sm border border-dark-800"
    >
      <div className="flex items-center gap-4 mb-4">
        {icon}
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>
      <div className="text-gray-300 leading-relaxed">
        {content}
      </div>
    </motion.div>
  );
};

export default About;