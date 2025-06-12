import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Check, HelpCircle, CreditCard } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import toast from 'react-hot-toast';
import UserInfoModal from './UserInfoModal';

interface LicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  beatTitle: string;
  basePrice: number;
}

const LicenseModal: React.FC<LicenseModalProps> = ({ isOpen, onClose, beatTitle, basePrice }) => {
  const { isDarkMode } = useThemeStore();
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<'commercial' | 'exclusive' | null>(null);
  const [showPaymentSelection, setShowPaymentSelection] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'stripe' | 'paypal' | null>(null);

  const handlePurchase = (type: 'commercial' | 'exclusive') => {
    setSelectedLicense(type);
    setShowPaymentSelection(true);
  };

  const handlePaymentMethodSelect = (method: 'stripe' | 'paypal') => {
    setSelectedPaymentMethod(method);
    setShowUserInfoModal(true);
  };

  const resetSelection = () => {
    setSelectedLicense(null);
    setShowPaymentSelection(false);
    setSelectedPaymentMethod(null);
  };

  const showExclusiveLicense = beatTitle.toLowerCase() !== 'street corner';

  return (
    <>
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
              className={`w-full max-w-4xl rounded-2xl ${
                isDarkMode ? 'bg-dark-900' : 'bg-white'
              } p-6 md:p-8 shadow-xl`}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-500 bg-clip-text text-transparent">
                    {showPaymentSelection 
                      ? `Purchase ${selectedLicense === 'exclusive' ? 'Exclusive' : 'Commercial'} License`
                      : 'Choose Your License'}
                  </h2>
                  <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {showPaymentSelection 
                      ? 'Choose your preferred payment method'
                      : `For beat: ${beatTitle}`}
                  </p>
                </div>
                <button
                  onClick={() => {
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

              {showPaymentSelection && selectedLicense ? (
                /* Payment Method Selection */
                <div className="max-w-2xl mx-auto">
                  <div className="text-center mb-8">
                    <div className={`inline-flex items-center gap-3 p-4 rounded-xl ${
                      isDarkMode ? 'bg-dark-800' : 'bg-gray-100'
                    }`}>
                      {selectedLicense === 'exclusive' ? (
                        <Crown className="w-8 h-8 text-accent-500" />
                      ) : (
                        <Check className="w-8 h-8 text-primary-500" />
                      )}
                      <div>
                        <h3 className="text-xl font-bold">
                          {selectedLicense === 'exclusive' ? 'Exclusive' : 'Commercial'} License
                        </h3>
                        <p className="text-lg">
                          ${selectedLicense === 'exclusive' ? (basePrice * 2).toFixed(2) : basePrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Stripe Payment */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
                        isDarkMode 
                          ? 'bg-dark-800 border-dark-700 hover:border-blue-500' 
                          : 'bg-white border-gray-200 hover:border-blue-500'
                      }`}
                      onClick={() => handlePaymentMethodSelect('stripe')}
                    >
                      <div className="text-center mb-4">
                        <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
                          isDarkMode ? 'bg-blue-500/20' : 'bg-blue-500/10'
                        }`}>
                          <CreditCard className="w-6 h-6 text-blue-500" />
                        </div>
                        <h4 className="text-lg font-semibold mb-2">Pay with Stripe</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Secure credit card processing
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-medium transition-colors"
                      >
                        Continue with Stripe
                      </motion.button>
                    </motion.div>

                    {/* PayPal Payment */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
                        isDarkMode 
                          ? 'bg-dark-800 border-dark-700 hover:border-yellow-500' 
                          : 'bg-white border-gray-200 hover:border-yellow-500'
                      }`}
                      onClick={() => handlePaymentMethodSelect('paypal')}
                    >
                      <div className="text-center mb-4">
                        <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
                          isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-500/10'
                        }`}>
                          <div className="w-6 h-6 rounded font-bold text-xs flex items-center justify-center bg-yellow-500 text-white">
                            PP
                          </div>
                        </div>
                        <h4 className="text-lg font-semibold mb-2">Pay with PayPal</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          PayPal secure checkout
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-6 rounded-xl font-medium transition-colors"
                      >
                        Continue with PayPal
                      </motion.button>
                    </motion.div>
                  </div>

                  <div className="text-center mt-6">
                    <button
                      onClick={resetSelection}
                      className={`text-sm ${
                        isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                      } transition-colors`}
                    >
                      ← Back to license selection
                    </button>
                  </div>
                </div>
              ) : (
                /* License Options */
                <>
                  <div className={`grid ${showExclusiveLicense ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-6 mb-8`}>
                    {/* Commercial License */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`relative rounded-xl p-6 ${
                        isDarkMode 
                          ? 'bg-dark-800 border border-dark-700' 
                          : 'bg-white border border-gray-200'
                      } overflow-hidden cursor-pointer`}
                      onClick={() => handlePurchase('commercial')}
                    >
                      {/* Background Gradient */}
                      <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-primary-500 to-transparent" />
                      
                      {/* Content */}
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center mb-4">
                          <Check className="w-6 h-6 text-primary-500" />
                        </div>
                        
                        <h3 className="text-2xl font-bold mb-2 text-primary-500">
                          Commercial License
                        </h3>
                        
                        <div className="mb-4">
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold">
                              ${basePrice.toFixed(2)}
                            </span>
                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                              one-time
                            </span>
                          </div>
                        </div>
                        
                        <ul className="space-y-3 mb-6">
                          <li className="flex items-center gap-2">
                            <Check className="text-primary-500" size={20} />
                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                              Use on YouTube, Spotify & streaming
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="text-primary-500" size={20} />
                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                              Unlimited streams/views
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="text-primary-500" size={20} />
                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                              Credit required (prod. Maxy Electa)
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="text-primary-500" size={20} />
                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                              No resale/transfer rights
                            </span>
                          </li>
                        </ul>
                        
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-primary-500/20 text-center"
                        >
                          Buy Commercial License
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Exclusive License - Only show for beats other than "street corner" */}
                    {showExclusiveLicense && (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`relative rounded-xl p-6 ${
                          isDarkMode 
                            ? 'bg-dark-800 border border-dark-700' 
                            : 'bg-white border border-gray-200'
                        } overflow-hidden cursor-pointer`}
                        onClick={() => handlePurchase('exclusive')}
                      >
                        <div className="absolute -top-3 -right-3">
                          <span className="bg-accent-500 text-white text-sm px-3 py-1 rounded-full font-medium shadow-lg">
                            Best Value
                          </span>
                        </div>

                        {/* Background Gradient */}
                        <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-accent-500 to-transparent" />

                        {/* Content */}
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-accent-500/20 flex items-center justify-center mb-4">
                            <Crown className="w-6 h-6 text-accent-500" />
                          </div>
                          
                          <h3 className="text-2xl font-bold text-accent-500 mb-2 flex items-center gap-2">
                            Exclusive License
                          </h3>
                          
                          <div className="mb-4">
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl font-bold">
                                ${(basePrice * 2).toFixed(2)}
                              </span>
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                one-time
                              </span>
                            </div>
                          </div>

                          <ul className="space-y-3 mb-6">
                            <li className="flex items-center gap-2">
                              <Check className="text-accent-500" size={20} />
                              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                                Exclusive rights
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="text-accent-500" size={20} />
                              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                                Beat removed from store
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="text-accent-500" size={20} />
                              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                                Full ownership transfer
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="text-accent-500" size={20} />
                              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                                No credit required
                              </span>
                            </li>
                          </ul>

                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-accent-500 hover:bg-accent-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-accent-500/20 text-center"
                          >
                            Buy Exclusive License
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* FAQ Link */}
                  <div className="text-center">
                    <button 
                      onClick={() => {
                        toast.success('FAQ coming soon!');
                      }}
                      className={`inline-flex items-center gap-2 ${
                        isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                      } transition-colors duration-300`}
                    >
                      <HelpCircle size={16} />
                      <span>Which license should I choose?</span>
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <UserInfoModal
        isOpen={showUserInfoModal}
        onClose={() => {
          setShowUserInfoModal(false);
          setSelectedPaymentMethod(null);
        }}
        onSubmit={() => {}} // This is no longer used since we handle the redirect in UserInfoModal
        beatTitle={beatTitle}
        licenseType={selectedLicense || 'commercial'}
        price={selectedLicense === 'exclusive' ? basePrice * 2 : basePrice}
      />
    </>
  );
};

export default LicenseModal;