import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Check, HelpCircle } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useAuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import UserInfoModal from './UserInfoModal';
import AuthModal from './AuthModal';

interface LicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  beatTitle: string;
  basePrice: number;
}

const LicenseModal: React.FC<LicenseModalProps> = ({ isOpen, onClose, beatTitle, basePrice }) => {
  const { isDarkMode } = useThemeStore();
  const { user, getDiscountPercentage } = useAuthContext();
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<'commercial' | 'exclusive' | null>(null);

  const discountPercentage = getDiscountPercentage();
  const discountedPrice = basePrice * (1 - discountPercentage / 100);
  const exclusiveDiscountedPrice = (basePrice * 2) * (1 - discountPercentage / 100);

  const handlePurchase = (type: 'commercial' | 'exclusive') => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setSelectedLicense(type);
    setShowUserInfoModal(true);
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
                    Choose Your License
                  </h2>
                  <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    For beat: {beatTitle}
                  </p>
                  {discountPercentage > 0 && (
                    <p className="mt-1 text-success-400 font-medium">
                      🎉 Your subscription saves you {discountPercentage}% on this purchase!
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

              {/* License Options */}
              <div className={`grid ${showExclusiveLicense ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-6 mb-8`}>
                {/* Commercial License */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`relative rounded-xl p-6 ${
                    isDarkMode 
                      ? 'bg-dark-800 border border-dark-700' 
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-primary-500 mb-2">
                      Commercial License
                    </h3>
                    <div className="flex items-baseline gap-2 mb-4">
                      {discountPercentage > 0 && (
                        <span className="text-lg text-gray-500 line-through">
                          ${basePrice.toFixed(2)}
                        </span>
                      )}
                      <span className="text-3xl font-bold">
                        ${discountedPrice.toFixed(2)}
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

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePurchase('commercial')}
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-primary-500/20"
                  >
                    Buy Commercial License
                  </motion.button>
                </motion.div>

                {/* Exclusive License - Only show for beats other than "street corner" */}
                {showExclusiveLicense && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`relative rounded-xl p-6 ${
                      isDarkMode 
                        ? 'bg-dark-800 border border-dark-700' 
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    <div className="absolute -top-3 -right-3">
                      <span className="bg-accent-500 text-white text-sm px-3 py-1 rounded-full font-medium shadow-lg">
                        Best Value
                      </span>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-accent-500 mb-2 flex items-center gap-2">
                        Exclusive License
                        <Crown className="text-accent-500" size={24} />
                      </h3>
                      <div className="flex items-baseline gap-2 mb-4">
                        {discountPercentage > 0 && (
                          <span className="text-lg text-gray-500 line-through">
                            ${(basePrice * 2).toFixed(2)}
                          </span>
                        )}
                        <span className="text-3xl font-bold">
                          ${exclusiveDiscountedPrice.toFixed(2)}
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

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePurchase('exclusive')}
                      className="w-full bg-accent-500 hover:bg-accent-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-accent-500/20"
                    >
                      Buy Exclusive License
                    </motion.button>
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <UserInfoModal
        isOpen={showUserInfoModal}
        onClose={() => setShowUserInfoModal(false)}
        onSubmit={() => {}}
        beatTitle={beatTitle}
        licenseType={selectedLicense || 'commercial'}
        price={selectedLicense === 'exclusive' ? exclusiveDiscountedPrice : discountedPrice}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="signin"
      />
    </>
  );
};

export default LicenseModal;