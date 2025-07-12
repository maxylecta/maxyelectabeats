import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Loader, Eye, EyeOff, Chrome } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useAuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'signin' }) => {
  const { isDarkMode } = useThemeStore();
  const { signIn, signUp, signInWithGoogle, loading } = useAuthContext();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    confirmPassword: ''
  });

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);
      const { error } = await signInWithGoogle();
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Redirecting to Google...');
        // The redirect will happen automatically
      }
    } catch (error) {
      toast.error('Failed to sign in with Google');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate email
    if (!validateEmail(formData.email)) {
      toast.error('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    try {
      if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }

        const { error } = await signUp(
          formData.email,
          formData.password,
          {
            first_name: formData.first_name,
            last_name: formData.last_name
          }
        );

        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Account created successfully!');
          onClose();
        }
      } else {
        const { error } = await signIn(formData.email, formData.password);

        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Welcome back!');
          onClose();
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name === 'user-email-field' ? 'email' : name;
    
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
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
              isDarkMode ? 'bg-dark-900 border border-dark-700' : 'bg-white border border-gray-200'
            } p-6 md:p-8 shadow-2xl`}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-500 bg-clip-text text-transparent">
                  {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {mode === 'signin' 
                    ? 'Sign in to access your beats and subscriptions' 
                    : 'Join Maxy Electa Beats community'}
                </p>
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

            {/* Google Sign In Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleSignIn}
              disabled={isSubmitting || loading}
              className={`w-full mb-6 py-3 px-6 rounded-xl font-medium transition-all duration-300 border-2 flex items-center justify-center gap-3 ${
                isDarkMode
                  ? 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
                  : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Chrome size={20} className="text-blue-500" />
              <span>Continue with Google</span>
            </motion.button>

            {/* Divider */}
            <div className="relative mb-6">
              <div className={`absolute inset-0 flex items-center ${
                isDarkMode ? 'text-gray-600' : 'text-gray-400'
              }`}>
                <div className={`w-full border-t ${
                  isDarkMode ? 'border-dark-700' : 'border-gray-300'
                }`} />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${
                  isDarkMode ? 'bg-dark-900 text-gray-400' : 'bg-white text-gray-500'
                }`}>
                  Or continue with email
                </span>
              </div>
            </div>
            {/* Form */}
            <div className="relative">
              {/* Hidden style to disable password managers */}
              <style dangerouslySetInnerHTML={{
                __html: `
                  #auth-modal-form [data-lastpass-icon-root],
                  #auth-modal-form [data-lastpass-root],
                  #auth-modal-form div[style*="all: initial"],
                  #auth-modal-form div[id^="autofill"],
                  #auth-modal-form div[class*="password-manager"],
                  #auth-modal-form > div[style*="position: absolute"],
                  #auth-modal-form input::-webkit-credentials-auto-fill-button,
                  #auth-modal-form input::-webkit-textfield-decoration-container {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                    pointer-events: none !important;
                  }
                `
              }} />
              <form id="auth-modal-form" onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        First Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          autoComplete="given-name"
                          className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                            isDarkMode 
                              ? 'bg-dark-800 border-dark-600 text-white placeholder-gray-400 focus:border-primary-500 focus:bg-dark-700' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:bg-gray-50'
                          }`}
                          placeholder="John"
                        />
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Last Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          autoComplete="family-name"
                          className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                            isDarkMode 
                              ? 'bg-dark-800 border-dark-600 text-white placeholder-gray-400 focus:border-primary-500 focus:bg-dark-700' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:bg-gray-50'
                          }`}
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="user-email-field"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="new-password"
                      data-lpignore="true"
                      data-1p-ignore
                      data-form-type="other"
                      readOnly
                      onFocus={(e) => e.target.removeAttribute('readonly')}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                        isDarkMode 
                          ? 'bg-dark-800 border-dark-600 text-white placeholder-gray-400 focus:border-primary-500 focus:bg-dark-700' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:bg-gray-50'
                      }`}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="off"
                      data-lpignore="true"
                      data-1p-ignore
                      className={`w-full pl-10 pr-12 py-3 rounded-lg border-2 transition-all duration-200 ${
                        isDarkMode 
                          ? 'bg-dark-800 border-dark-600 text-white placeholder-gray-400 focus:border-primary-500 focus:bg-dark-700' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:bg-gray-50'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {mode === 'signup' && (
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        autoComplete="off"
                        data-lpignore="true"
                        data-1p-ignore
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                          isDarkMode 
                            ? 'bg-dark-800 border-dark-600 text-white placeholder-gray-400 focus:border-primary-500 focus:bg-dark-700' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:bg-gray-50'
                        }`}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting || loading}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>{mode === 'signin' ? 'Signing In...' : 'Creating Account...'}</span>
                    </>
                  ) : (
                    mode === 'signin' ? 'Sign In' : 'Create Account'
                  )}
                </motion.button>
              </form>
            </div>

            {/* Switch Mode */}
            <div className="mt-6 text-center">
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                  className="ml-2 text-primary-500 hover:text-primary-600 font-medium transition-colors"
                >
                  {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;