import React from 'react';
import { motion } from 'framer-motion';
import { Music, Rocket, PenTool as Tool, Calendar, MessageCircle, Instagram, Mail, Zap, CreditCard, AlertTriangle, User, CheckCircle } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-dark-950">
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

            {/* New Subscription & Payment Section */}
            <AboutSection
              icon={<Zap className="w-8 h-8 text-warning-500" />}
              title="⚡ IMPORTANT: Subscription & Payment — How to Keep Your Benefits"
              content={
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-warning-400 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Why Does This Matter?
                    </h4>
                    <p className="text-gray-300 mb-4">
                      To make sure your subscriber discounts are automatically applied to every purchase, our system needs to recognize you.
                    </p>
                    <p className="text-gray-300 mb-4">
                      Because we use PayPal and Stripe (credit card), there are two separate subscriber databases:
                    </p>
                    <ul className="space-y-2 list-disc list-inside text-gray-300 ml-4">
                      <li>If you subscribe using <strong className="text-blue-400">PayPal</strong>, your subscription is recognized only through your PayPal account.</li>
                      <li>If you subscribe using <strong className="text-purple-400">Stripe (credit/debit card)</strong>, your subscription is recognized only through your Stripe card or the email you used for Stripe.</li>
                    </ul>
                  </div>

                  <div className="bg-warning-500/10 border border-warning-500/30 rounded-lg p-4">
                    <p className="text-warning-300 font-medium">
                      👉 Switching payment methods (for example, from PayPal to credit card, or the other way around) will prevent our system from recognizing your subscription, so your discounts and subscriber perks will not apply.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-success-400 mb-3 flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      How Can I Make Sure I Get My Subscriber Benefits?
                    </h4>
                    <p className="text-gray-300 mb-3">When purchasing a beat or service:</p>
                    <ul className="space-y-2 list-disc list-inside text-gray-300 ml-4">
                      <li>If you subscribed with <strong className="text-blue-400">PayPal</strong>, always pay with PayPal (same account/email).</li>
                      <li>If you subscribed with <strong className="text-purple-400">Stripe</strong>, always pay with Stripe (same card/email).</li>
                      <li>Do not use a different payment method than the one you used for your subscription.</li>
                      <li>Make sure to use the same email address and/or account as when you subscribed.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-error-400 mb-3">
                      What Happens If I Change Payment Methods?
                    </h4>
                    <ul className="space-y-2 list-disc list-inside text-gray-300 ml-4">
                      <li>The system cannot automatically "link" your new payment to your existing subscription.</li>
                      <li>Your discounts, VIP access, or exclusive downloads will not be applied to that purchase.</li>
                      <li>If you want to switch payment methods for your subscription, contact our support — we can help transfer your subscription if needed.</li>
                    </ul>
                  </div>

                  {/* Real-Life Example */}
                  <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-primary-400 mb-3 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Real-Life Example
                    </h4>
                    <p className="text-gray-300 mb-3">
                      If Max subscribes with PayPal using <strong className="text-blue-400">maxmusic@gmail.com</strong> and then tries to buy a beat using <strong className="text-purple-400">Stripe (credit card)</strong>, he won't see his 30% discount: the system can\'t find his subscription in the Stripe database.
                    </p>
                    <p className="text-gray-300">
                      On the other hand, if he always pays with the same PayPal account, the discount applies automatically.
                    </p>
                  </div>

                  {/* TL;DR Summary */}
                  <div className="bg-success-500/10 border border-success-500/30 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-success-400 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      TL;DR (Summary)
                    </h4>
                    <p className="text-gray-300 mb-3 font-medium">
                      Always use the same payment method to keep your benefits active!
                    </p>
                    <p className="text-gray-300 mb-3">
                      If you want to switch, contact us first to avoid losing your perks.
                    </p>
                    <p className="text-gray-300">
                      Thanks for understanding and supporting independent music! 🎧
                    </p>
                  </div>
                </div>
              }
            />
            
            <AboutSection
              icon={<MessageCircle className="w-8 h-8 text-primary-500" />}
              title="Contact"
              content={
                <div className="space-y-4">
                  <p>For any questions, special requests, or custom projects, feel free to reach out via the contact form or through:</p>
                  <div className="flex flex-col gap-3">
                    <a 
                      href="https://www.instagram.com/maxyelectabeats/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      <Instagram className="w-5 h-5" />
                      @maxyelectabeats
                    </a>
                    <a 
                      href="mailto:support@maxyelectabeats.com"
                      className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                      support@maxyelectabeats.com
                    </a>
                  </div>
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