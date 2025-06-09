import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader, CreditCard } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { getOrCreateSessionId } from '../utils/sessionUtils';
import toast from 'react-hot-toast';

interface UserInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (firstName: string, lastName: string, email: string) => void;
  beatTitle: string;
  licenseType: 'commercial' | 'exclusive';
  price: number;
}

const UserInfoModal: React.FC<UserInfoModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  beatTitle,
  licenseType,
  price
}) => {
  const { isDarkMode } = useThemeStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [formData, setFormData] = useState({
    first_name: localStorage.getItem('user_first_name') || '',
    last_name: localStorage.getItem('user_last_name') || '',
    email: localStorage.getItem('user_email') || '',
    payment_method: '' as 'stripe' | 'paypal' | ''
  });

  // Generate or retrieve session ID when modal opens
  useEffect(() => {
    if (isOpen) {
      const currentSessionId = getOrCreateSessionId();
      setSessionId(currentSessionId);
      console.log('Payment session ID:', currentSessionId); // For debugging
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.payment_method) {
      toast.error('Please select a payment method');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const payload = {
        session_id: sessionId,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        payment_method: formData.payment_method,
        beat_title: beatTitle,
        license: licenseType,
        price: price,
        timestamp: new Date().toISOString()
      };

      console.log('Sending payload with session ID:', payload); // For debugging

      const response = await fetch('https://maxyelectazone.app.n8n.cloud/webhook/a6ec851f-5f94-44a5-9b2b-6bcfe37c4f98', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        // Get more detailed error information
        let errorMessage = `HTTP ${response.status} ${response.statusText}`;
        
        try {
          const errorData = await response.text();
          if (errorData) {
            errorMessage += `: ${errorData}`;
          }
        } catch (parseError) {
          // If we can't parse the error response, just use the status
          console.warn('Could not parse error response:', parseError);
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (!data.checkout_url) {
        throw new Error('No checkout URL received from server');
      }

      // Store user info for future use
      localStorage.setItem('user_first_name', formData.first_name);
      localStorage.setItem('user_last_name', formData.last_name);
      localStorage.setItem('user_email', formData.email);

      // Store session info for potential use after redirect
      sessionStorage.setItem('last_payment_session', JSON.stringify({
        session_id: sessionId,
        beat_title: beatTitle,
        license: licenseType,
        price: price,
        payment_method: formData.payment_method,
        timestamp: new Date().toISOString()
      }));

      // Redirect to checkout
      window.location.href = data.checkout_url;
    } catch (error) {
      console.error('Submission error:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to process request. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('HTTP 4')) {
          errorMessage = 'Invalid request. Please check your information and try again.';
        } else if (error.message.includes('HTTP 5')) {
          errorMessage = 'Server error. Please try again in a few moments.';
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('No checkout URL')) {
          errorMessage = 'Payment processing error. Please try again.';
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className={`w-full max-w-md rounded-2xl ${
              isDarkMode ? 'bg-dark-900' : 'bg-white'
            } p-6 md:p-8`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-500 bg-clip-text text-transparent">
                  Complete Your Purchase
                </h2>
                {sessionId && (
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Session: {sessionId.slice(-8)}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-full transition-colors ${
                  isDarkMode 
                    ? 'hover:bg-dark-800 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                    required
                    value={formData.first_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
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
                    required
                    value={formData.last_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-dark-800 border-dark-700 text-white focus:border-primary-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-primary-500'
                    } transition-colors duration-200`}
                  />
                </div>
              </div>

              <div>
                <label 
                  htmlFor="email" 
                  className={`block text-sm font-medium mb-1 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-dark-800 border-dark-700 text-white focus:border-primary-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-primary-500'
                  } transition-colors duration-200`}
                />
              </div>

              <div>
                <label 
                  className={`block text-sm font-medium mb-3 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Payment Method <span className="text-primary-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData(prev => ({ ...prev, payment_method: 'stripe' }))}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                      formData.payment_method === 'stripe'
                        ? 'border-blue-500 bg-blue-500/10'
                        : isDarkMode
                          ? 'border-dark-700 hover:border-blue-500/50 bg-dark-800'
                          : 'border-gray-300 hover:border-blue-500/50 bg-white'
                    }`}
                  >
                    <CreditCard className={`w-6 h-6 ${
                      formData.payment_method === 'stripe' ? 'text-blue-500' : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                    <span className={`text-sm font-medium ${
                      formData.payment_method === 'stripe' ? 'text-blue-500' : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Pay by Stripe
                    </span>
                    <span className={`text-xs ${
                      formData.payment_method === 'stripe' ? 'text-blue-400' : isDarkMode ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      (Card)
                    </span>
                  </motion.button>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData(prev => ({ ...prev, payment_method: 'paypal' }))}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                      formData.payment_method === 'paypal'
                        ? 'border-yellow-500 bg-yellow-500/10'
                        : isDarkMode
                          ? 'border-dark-700 hover:border-yellow-500/50 bg-dark-800'
                          : 'border-gray-300 hover:border-yellow-500/50 bg-white'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded font-bold text-xs flex items-center justify-center ${
                      formData.payment_method === 'paypal' 
                        ? 'bg-yellow-500 text-white' 
                        : isDarkMode 
                          ? 'bg-gray-600 text-gray-300' 
                          : 'bg-gray-400 text-white'
                    }`}>
                      PP
                    </div>
                    <span className={`text-sm font-medium ${
                      formData.payment_method === 'paypal' ? 'text-yellow-500' : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Pay by PayPal
                    </span>
                    <span className={`text-xs ${
                      formData.payment_method === 'paypal' ? 'text-yellow-400' : isDarkMode ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      (PayPal)
                    </span>
                  </motion.button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                disabled={isSubmitting || !formData.payment_method}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed mt-6 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  'Continue to Payment'
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserInfoModal;