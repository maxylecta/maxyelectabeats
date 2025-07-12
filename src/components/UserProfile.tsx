import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Crown, Settings, LogOut, CreditCard, Mail, RefreshCw } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useAuthContext } from '../context/AuthContext';
import PlanSelectionModal from './PlanSelectionModal';
import toast from 'react-hot-toast';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const { isDarkMode } = useThemeStore();
  const { user, profile, signOut, getDiscountPercentage } = useAuthContext();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showPlanSelection, setShowPlanSelection] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const { error } = await signOut();
      if (error) {
        toast.error('Error signing out');
      } else {
        toast.success('Signed out successfully');
        onClose();
      }
    } catch (error) {
      toast.error('Error signing out');
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleChangePlan = () => {
    setShowPlanSelection(true);
  };

  const handlePlanSelectionComplete = () => {
    setShowPlanSelection(false);
    // Refresh the profile to get updated subscription info
    refreshProfile();
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basic': return 'text-success-400';
      case 'pro': return 'text-secondary-400';
      case 'premium': return 'text-accent-400';
      default: return 'text-gray-400';
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'premium': return <Crown className="w-5 h-5" />;
      default: return <CreditCard className="w-5 h-5" />;
    }
  };

  if (!user || !profile) return null;

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
            {/* Header */}
            <div className="text-center mb-6">
              <div className={`w-20 h-20 rounded-full ${
                isDarkMode ? 'bg-primary-500/20' : 'bg-primary-500/10'
              } flex items-center justify-center mx-auto mb-4`}>
                <User className="w-10 h-10 text-primary-500" />
              </div>
              <h2 className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {profile.first_name} {profile.last_name}
              </h2>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {profile.email}
              </p>
            </div>

            {/* Subscription Info */}
            <div className={`rounded-xl p-4 mb-6 ${
              isDarkMode ? 'bg-dark-800' : 'bg-gray-50'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getPlanIcon(profile.subscription_plan)}
                  <span className={`font-semibold ${getPlanColor(profile.subscription_plan)}`}>
                    {profile.subscription_plan.toUpperCase()} Plan
                  </span>
                </div>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  profile.subscription_status === 'active'
                    ? 'bg-success-500/20 text-success-400'
                    : 'bg-warning-500/20 text-warning-400'
                }`}>
                  {profile.subscription_status}
                </span>
              </div>
              
              {getDiscountPercentage() > 0 && (
                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  🎉 You save {getDiscountPercentage()}% on all beat purchases!
                </div>
              )}
            </div>

            {/* Account Details */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <Mail className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Email
                  </p>
                  <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                    {profile.email}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Settings className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Member Since
                  </p>
                  <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                    {new Date(profile.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleChangePlan}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Change Plan
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <LogOut className="w-5 h-5" />
                {isSigningOut ? 'Signing Out...' : 'Sign Out'}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-dark-800 hover:bg-dark-700 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <PlanSelectionModal
        isOpen={showPlanSelection}
        onClose={() => setShowPlanSelection(false)}
        onPlanSelected={handlePlanSelectionComplete}
      />
    </AnimatePresence>
  );
};

export default UserProfile;