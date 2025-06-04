import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

const CancelPage: React.FC = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      isDarkMode ? 'bg-dark-950' : 'bg-gray-50'
    }`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-md w-full rounded-2xl ${
          isDarkMode ? 'bg-dark-900' : 'bg-white'
        } p-8 text-center shadow-xl`}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 bg-red-500 rounded-full mx-auto flex items-center justify-center mb-6"
        >
          <XCircle className="w-8 h-8 text-white" />
        </motion.div>

        <h1 className={`text-3xl font-bold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Payment Cancelled
        </h1>

        <p className={`mb-8 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Your payment was cancelled. No charges were made.
          If you have any questions, please don't hesitate to contact us.
        </p>

        <motion.a
          href="/"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-300"
        >
          <ArrowLeft size={20} />
          Back to Home
        </motion.a>
      </motion.div>
    </div>
  );
};

export default CancelPage;