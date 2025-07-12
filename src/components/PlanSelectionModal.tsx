import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Sparkles, Shield, Crown, Zap, Loader } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useAuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface PlanSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanSelected: () => void;
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

const PlanSelectionModal: React.FC<PlanSelectionModalProps> = ({ isOpen, onClose, onPlanSelected }) => {
  const { isDarkMode } = useThemeStore();
  const { updateProfile, user } = useAuthContext();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSelectPlan = async (plan: typeof plans[0]) => {
    if (plan.name === 'FREE') {
      setIsUpdating(true);
      try {
        // Update user profile to free plan
        const { error } = await updateProfile({
          subscription_plan: 'free',
          subscription_status: 'active'
        });

        if (error) {
          toast.error('Failed to update plan');
          return;
        }

        toast.success('Free plan selected!');
        onPlanSelected();
        onClose();
      } catch (error) {
        toast.error('Failed to update plan');
      } finally {
        setIsUpdating(false);
      }
      return;
    }

    if (plan.paymentLink) {
      // Store the plan selection intent
      sessionStorage.setItem('selected_plan', plan.name.toLowerCase());
      window.open(plan.paymentLink, '_blank');
      
      // Close modal after opening payment link
      setTimeout(() => {
        onPlanSelected();
        onClose();
      }, 1000);
    }
  };

  const handleSkip = () => {
    if (user) {
      sessionStorage.setItem(`hasSeenPlanSelection_${user.id}`, 'true');
    }
    toast.success('You can change your plan anytime from your profile');
    onPlanSelected();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className={`w-full max-w-6xl rounded-2xl ${
              isDarkMode ? 'bg-dark-900' : 'bg-white'
            } p-6 md:p-8 shadow-xl my-8`}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-secondary-500 bg-clip-text text-transparent">
                  Choose Your Plan
                </h2>
                <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Select a subscription plan to start saving on beats
                </p>
              </div>
              <button
                onClick={handleSkip}
                className={`p-2 rounded-full transition-colors ${
                  isDarkMode 
                    ? 'hover:bg-dark-800 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                <X size={24} />
              </button>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {plans.map((plan) => (
                <motion.div
                  key={plan.name}
                  whileHover={{ scale: 1.02 }}
                  className={`relative rounded-xl p-6 ${
                    isDarkMode 
                      ? 'bg-dark-800 border border-dark-700' 
                      : 'bg-white border border-gray-200'
                  } overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg`}
                  onClick={() => handleSelectPlan(plan)}
                >
                  {/* Recommended Badge for PRO */}
                  {plan.name === 'PRO' && (
                    <div className="absolute -top-3 -right-3">
                      <span className="bg-secondary-500 text-white text-sm px-3 py-1 rounded-full font-medium shadow-lg">
                        Popular
                      </span>
                    </div>
                  )}

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
                          {plan.price > 0 ? '/month' : ''}
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
                      className={`w-full bg-${plan.color}-500 hover:bg-${plan.color}-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-${plan.color}-500/20 text-center flex items-center justify-center gap-2`}
                    >
                      {isUpdating && plan.name === 'FREE' ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Selecting...
                        </>
                      ) : (
                        plan.name === 'FREE' ? 'Select Free Plan' : 'Subscribe with Stripe'
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="text-center">
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                All discounts apply automatically to every beat purchase with your subscription.
                <br />
                Secure payment processing powered by Stripe.
              </p>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSkip}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  isDarkMode
                    ? 'text-gray-400 hover:text-white hover:bg-dark-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Skip for now
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PlanSelectionModal;