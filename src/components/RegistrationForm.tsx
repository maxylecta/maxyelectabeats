import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import toast from 'react-hot-toast';

interface RegistrationFormProps {
  onClose: () => void;
}

interface ErrorResponse {
  success: boolean;
  error: string;
  code: string;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onClose }) => {
  const { isDarkMode } = useThemeStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://maxyelectazone.app.n8n.cloud/webhook/15c87397-6707-42d1-b6a0-c322a592206a', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify(formData)
      });

      const responseData = await response.json().catch(() => null);
      
      if (!response.ok) {
        // Log detailed error information
        console.error('Registration failed:', {
          status: response.status,
          statusText: response.statusText,
          responseData
        });

        // Handle specific error cases
        if (response.status === 429) {
          throw new Error('Too many registration attempts. Please try again later.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Please check your connection and try again.');
        } else if (responseData?.error) {
          throw new Error(responseData.error);
        } else {
          throw new Error(`Registration failed (${response.status}). Please try again.`);
        }
      }

      if (!responseData?.success && !response.ok) {
        throw new Error('Invalid response from server. Please try again.');
      }

      setIsSuccess(true);
      toast.success('Registration successful!');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      
      // Provide more specific error messages based on error type
      if (error instanceof TypeError && error.message.includes('NetworkError')) {
        toast.error('Network error. Please check your internet connection.');
      } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        toast.error('Unable to reach registration server. Please try again later.');
      } else {
        toast.error(error instanceof Error ? error.message : 'Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-primary-500 rounded-full mx-auto flex items-center justify-center"
          >
            <Check className="w-8 h-8 text-white" />
          </motion.div>
        </div>
        <h3 className="text-2xl font-bold text-primary-500 mb-2">
          Welcome to Maxy Electa Beats!
        </h3>
        <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
          Your registration was successful.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label 
          htmlFor="first_name" 
          className={`block text-sm font-medium mb-1 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          First Name
        </label>
        <input
          type="text"
          id="first_name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          className={`w-full px-4 py-2 rounded-lg border ${
            isDarkMode 
              ? 'bg-dark-800 border-dark-700 text-white focus:border-primary-500' 
              : 'bg-white border-gray-300 text-gray-900 focus:border-primary-500'
          } transition-colors duration-200`}
        />
      </div>

      <div>
        <label 
          htmlFor="last_name" 
          className={`block text-sm font-medium mb-1 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          Last Name
        </label>
        <input
          type="text"
          id="last_name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          className={`w-full px-4 py-2 rounded-lg border ${
            isDarkMode 
              ? 'bg-dark-800 border-dark-700 text-white focus:border-primary-500' 
              : 'bg-white border-gray-300 text-gray-900 focus:border-primary-500'
          } transition-colors duration-200`}
        />
      </div>

      <div>
        <label 
          htmlFor="email" 
          className={`block text-sm font-medium mb-1 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          Email <span className="text-primary-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-2 rounded-lg border ${
            isDarkMode 
              ? 'bg-dark-800 border-dark-700 text-white focus:border-primary-500' 
              : 'bg-white border-gray-300 text-gray-900 focus:border-primary-500'
          } transition-colors duration-200`}
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isSubmitting}
        className={`w-full bg-primary-500 hover:bg-primary-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed mt-6 flex items-center justify-center`}
      >
        {isSubmitting ? (
          <Loader className="w-5 h-5 animate-spin" />
        ) : (
          'Complete Registration'
        )}
      </motion.button>
    </form>
  );
};

export default RegistrationForm;