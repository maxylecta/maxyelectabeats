import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Sparkles, Shield, Crown, Zap } from 'lucide-react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useThemeStore } from '../store/themeStore';
import toast from 'react-hot-toast';
import RegistrationForm from './RegistrationForm';
import PayPalSubscriptionButton from './PayPalSubscriptionButton';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const plans = [
  {
    name: 'FREE',
    discount: 0,
    price: 0,
    icon: Zap,
    color: 'primary',
    description: 'Classic access to all beats',
    features: [
      'Full catalog access',
      'Preview all beats',
      'Standard pricing',
      'Basic support'
    ]
  },
  {
    name: 'BASIC',
    discount: 20,
    price: 9.99,
    paymentLink: 'https://buy.stripe.com/bJe28s70j7u7cIx6lSabK01',
    paypalPlanId: 'P-2D528612KT1150050NBBTRTY',
    icon: Shield,
    color: 'success',
    description: 'Start saving on every beat',
    features: [
      '20% off all beats',
      'Priority support',
      'Extended previews',
      'Beat recommendations'
    ]
  },
  {
    name: 'PRO',
    discount: 30,
    price: 19.99,
    paymentLink: 'https://buy.stripe.com/28EdRagAT7u7fUJ39GabK02',
    paypalPlanId: 'P-9X66027987760874VNBB4N7Q',
    icon: Sparkles,
    color: 'secondary',
    description: 'Perfect for regular buyers',
    features: [
      '30% off all beats',
      'Premium support',
      'Early access to new beats',
      'Custom beat requests'
    ]
  },
  {
    name: 'PREMIUM',
    discount: 40,
    price: 29.99,
    paymentLink: 'https://buy.stripe.com/3cI7sMbgz8ybgYN9y4abK03',
    paypalPlanId: 'P-2VK0667620504725XNBB4SOY',
    icon: Crown,
    color: 'accent',
    description: 'Maximum savings & benefits',
    features: [
      '40% off all beats',
      'VIP support',
      'Exclusive beats access',
      'Custom beat priority'
    ]
  }
];

// PayPal configuration with your actual client ID
const paypalOptions = {
  'client-id': 'ASfmU4IfcdKFn0ZuEJvSK752MKa3kdTlfCyGGiNr2ClbVSkb-ryMyYCVCZmWiMsI5kwJsZv7cgJh5nHi',
  currency: 'USD',
  intent: 'subscription',
  vault: true
};

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const { isDarkMode } = useThemeStore();
  const [showRegistration, setShowRegistration] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'stripe' | 'paypal' | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);

  const handleSelectPlan = (plan: typeof plans[0]) => {
    if (plan.name === 'FREE') {
      setShowRegistration(true);
      return;
    }

    setSelectedPlan(plan);
    setSelectedPaymentMethod(null);
  };

  const handleStripePayment = (plan: typeof plans[0]) => {
    if (plan.paymentLink) {
      window.open(plan.paymentLink, '_blank');
    }
  };

  const handlePayPalSuccess = (subscriptionId: string) => {
    toast.success('PayPal subscription activated!');
    setSelectedPlan(null);
    setSelectedPaymentMethod(null);
    onClose();
  };

  const handlePayPalError = (error: any) => {
    console.error('PayPal error:', error);
    toast.error('PayPal payment failed. Please try again.');
  };

  const resetSelection = () => {
    setSelectedPlan(null);
    setSelectedPaymentMethod(null);
  };

  return (
    <PayPalScriptProvider options={paypalOptions}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto"
            onClick={() => {
              if (!showRegistration && !selectedPlan) {
                onClose();
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-6xl rounded-2xl ${
                isDarkMode ? 'bg-dark-900' : 'bg-white'
              } p-6 md:p-8 shadow-xl my-8`}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-secondary-500 bg-clip-text text-transparent">
                    {showRegistration 
                      ? 'Complete Registration' 
                      : selectedPlan 
                        ? `Subscribe to ${selectedPlan.name}` 
                        : 'Choose Your Plan'}
                  </h2>
                  <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {showRegistration 
                      ? 'Please fill out the form below to complete your registration'
                      : selectedPlan
                        ? 'Choose your preferred payment method'
                        : 'Select a subscription plan to start saving on beats'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowRegistration(false);
                    resetSelection();
                    onClose();
                  }}
                  className={`p-2 rounded-full transition-colors ${
                    isDarkMode 
                      ? 'hover:bg-dark-800 text-gray-400 hover:text-white' 
                      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <X size={24} />
                </button>
              </div>

              {showRegistration ? (
                <div className="max-w-md mx-auto">
                  <RegistrationForm onClose={() => {
                    setShowRegistration(false);
                    onClose();
                  }} />
                </div>
              ) : selectedPlan ? (
                /* Payment Method Selection */
                <div className="max-w-2xl mx-auto">
                  <div className="text-center mb-8">
                    <div className={`inline-flex items-center gap-3 p-4 rounded-xl ${
                      isDarkMode ? 'bg-dark-800' : 'bg-gray-100'
                    }`}>
                      <selectedPlan.icon className={`w-8 h-8 text-${selectedPlan.color}-500`} />
                      <div>
                        <h3 className="text-xl font-bold">{selectedPlan.name}</h3>
                        <p className="text-lg">${selectedPlan.price}/month</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Stripe Payment */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        isDarkMode 
                          ? 'bg-dark-800 border-dark-700 hover:border-blue-500' 
                          : 'bg-white border-gray-200 hover:border-blue-500'
                      }`}
                    >
                      <div className="text-center mb-4">
                        <h4 className="text-lg font-semibold mb-2">Pay with Stripe</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Secure credit card processing
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleStripePayment(selectedPlan)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-medium transition-colors"
                      >
                        Continue with Stripe
                      </motion.button>
                    </motion.div>

                    {/* PayPal Payment */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        isDarkMode 
                          ? 'bg-dark-800 border-dark-700 hover:border-yellow-500' 
                          : 'bg-white border-gray-200 hover:border-yellow-500'
                      }`}
                    >
                      <div className="text-center mb-4">
                        <h4 className="text-lg font-semibold mb-2">Pay with PayPal</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          PayPal secure checkout
                        </p>
                      </div>
                      {selectedPlan.paypalPlanId ? (
                        <PayPalSubscriptionButton
                          planId={selectedPlan.paypalPlanId}
                          planName={selectedPlan.name}
                          price={selectedPlan.price}
                          onSuccess={handlePayPalSuccess}
                          onError={handlePayPalError}
                        />
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          PayPal not available for this plan
                        </div>
                      )}
                    </motion.div>
                  </div>

                  <div className="text-center mt-6">
                    <button
                      onClick={resetSelection}
                      className={`text-sm ${
                        isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                      } transition-colors`}
                    >
                      ← Back to plans
                    </button>
                  </div>
                </div>
              ) : (
                /* Plans Grid */
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {plans.map((plan) => (
                      <motion.div
                        key={plan.name}
                        whileHover={{ scale: 1.02 }}
                        className={`relative rounded-xl p-6 ${
                          isDarkMode 
                            ? 'bg-dark-800 border border-dark-700' 
                            : 'bg-white border border-gray-200'
                        } overflow-hidden cursor-pointer`}
                        onClick={() => handleSelectPlan(plan)}
                      >
                        {/* Background Gradient */}
                        <div className={`absolute inset-0 opacity-5 bg-gradient-to-br from-${plan.color}-500 to-transparent`} />
                        
                        {/* Content */}
                        <div className="relative">
                          <div className={`w-12 h-12 rounded-full bg-${plan.color}-500/20 flex items-center justify-center mb-4`}>
                            <plan.icon className={`w-6 h-6 text-${plan.color}-500`} />
                          </div>
                          
                          <h3 className={`text-2xl font-bold mb-2 text-${plan.color}-500`}>
                            {plan.name}
                          </h3>
                          
                          <div className="mb-4">
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl font-bold">
                                ${plan.price}
                              </span>
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                /month
                              </span>
                            </div>
                            {plan.discount > 0 && (
                              <div className={`text-${plan.color}-500 font-semibold mt-1`}>
                                Save {plan.discount}% on all beats!
                              </div>
                            )}
                          </div>
                          
                          <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {plan.description}
                          </p>
                          
                          <ul className="space-y-2 mb-6">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <Check className={`w-4 h-4 text-${plan.color}-500`} />
                                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                                  {feature}
                                </span>
                              </li>
                            ))}
                          </ul>
                          
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full bg-${plan.color}-500 hover:bg-${plan.color}-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-${plan.color}-500/20 text-center`}
                          >
                            {plan.name === 'FREE' ? 'Register Now' : 'Select Plan'}
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Footer Note */}
                  <p className={`text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    All discounts apply automatically to every beat purchase with your subscription.
                    <br />
                    Choose between Stripe or PayPal for secure payment processing.
                  </p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PayPalScriptProvider>
  );
};

export default SubscriptionModal;