import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader, CreditCard } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { getOrCreateSessionId, generateSaleId, generateUniqueId } from '../utils/sessionUtils';
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
    email: localStorage.getItem('user_email') || ''
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
    setIsSubmitting(true);

    try {
      // Generate unique identifiers for tracking
      const saleId = generateSaleId(11); // e.g., "45223596136"
      const actionId = generateUniqueId('purchase'); // e.g., "purchase_1703123456789_abc12345"
      
      const payload = {
        // Unique tracking identifiers
        saleId: saleId,
        actionId: actionId,
        actionType: 'beat_purchase',
        
        // Session and user data
        session_id: sessionId,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        payment_method: 'stripe', // Only Stripe now
        
        // Purchase details
        beat_title: beatTitle,
        license: licenseType,
        price: price,
        
        // Metadata
        timestamp: new Date().toISOString(),
        source: 'maxy_electa_website'
      };

      console.log('Sending payload with tracking IDs:', { saleId, actionId, sessionId }); // For debugging

      // Create Basic Auth header
      const credentials = btoa('WBK5Pwbk5p:174747m3dWBK5P');

      // Use the PRODUCTION webhook URL for beat purchases and licenses
      const response = await fetch('https://maxyelectazone.app.n8n.cloud/webhook/a6ec851f-5f94-44a5-9b2b-6bcfe37c4f98', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`
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
        sale_id: saleId,
        action_id: actionId,
        beat_title: beatTitle,
        license: licenseType,
        price: price,
        payment_method: 'stripe',
        timestamp: new Date().toISOString()
      }));

      // Trigger welcome email webhook for beat purchase completion
      try {
        await fetch('https://maxyelectazone.app.n8n.cloud/webhook/30ed453d-708a-4015-b94c-0d92c29ad215', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${credentials}`
          },
          body: JSON.stringify({
            // Unique tracking identifiers
            saleId: saleId,
            actionId: generateUniqueId('purchase_email'),
            actionType: 'checkout_order_completed',
            
            // Order completion data
            beat_title: beatTitle,
            license: licenseType,
            price: price,
            payment_method: 'stripe',
            status: 'completed',
            
            // Customer data
            customer_email: formData.email,
            customer_name: `${formData.first_name} ${formData.last_name}`,
            first_name: formData.first_name,
            last_name: formData.last_name,
            
            // Email trigger data
            email_type: 'welcome_purchase',
            
            // Metadata
            timestamp: new Date().toISOString(),
            source: 'maxy_electa_website',
            event_type: 'CHECKOUT.ORDER.COMPLETED'
          })
        });
        
        console.log('Purchase welcome email webhook triggered successfully');
      } catch (emailError) {
        console.warn('Welcome email webhook failed, but purchase processing continues:', emailError);
        // Don't fail the entire process if email fails
      }

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

              {/* Payment Method Display (Stripe Only) */}
              <div>
                <label 
                  className={`block text-sm font-medium mb-3 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Payment Method
                </label>
                <div className={`p-4 rounded-lg border-2 border-blue-500 bg-blue-500/10 flex items-center gap-3`}>
                  <CreditCard className="w-6 h-6 text-blue-500" />
                  <div>
                    <span className="text-blue-500 font-medium">Stripe</span>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Secure credit card processing
                    </p>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                disabled={isSubmitting}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed mt-6 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  'Continue to Stripe Checkout'
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