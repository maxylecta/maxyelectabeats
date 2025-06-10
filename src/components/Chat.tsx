import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Music, ArrowDown, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useThemeStore } from '../store/themeStore';
import { generateSaleId, generateUniqueId } from '../utils/sessionUtils';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isError?: boolean;
}

interface ChatProps {
  className?: string;
}

const messageVariants = {
  initial: { 
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  animate: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

// Fallback responses for when the webhook is unavailable
const getFallbackResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase();
  
  if (message.includes('beat') || message.includes('instrumental')) {
    return "I'd love to help you find the perfect beat! While our chat system is temporarily offline, you can browse our extensive collection of beats above. Each beat comes with different licensing options to fit your needs. Feel free to preview any beat and check out our licensing terms.";
  }
  
  if (message.includes('price') || message.includes('cost') || message.includes('license')) {
    return "Our beats come with flexible licensing options! While our chat system is temporarily offline, you can view pricing details by clicking on any beat above. We offer different license types including Basic, Premium, and Exclusive rights to match your project needs.";
  }
  
  if (message.includes('custom') || message.includes('request')) {
    return "We absolutely create custom beats! While our chat system is temporarily offline, you can submit custom beat requests through our contact form or reach out directly. We work closely with artists to create unique instrumentals tailored to their vision.";
  }
  
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return "Hello! Welcome to Maxy Electa Studio! 🎵 While our chat system is temporarily offline, I'm still here to help guide you. Browse our beat collection above, and feel free to ask about our beats, licensing, or custom services!";
  }
  
  return "Thanks for reaching out! While our chat system is temporarily offline, I'm still here to help. You can browse our beat collection above, check out our licensing options, or ask me about our services. Our team is working to restore full chat functionality soon!";
};

const Chat: React.FC<ChatProps> = ({ className }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! 👋 Welcome to Maxy Electa Studio! How can I help you find the perfect beat today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const { isDarkMode } = useThemeStore();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Initialize or retrieve session ID
    let existingSessionId = sessionStorage.getItem('chatSessionId');
    if (!existingSessionId) {
      existingSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('chatSessionId', existingSessionId);
    }
    setSessionId(existingSessionId);

    // Load existing messages for this session
    const savedMessages = sessionStorage.getItem(`messages_${existingSessionId}`);
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(parsedMessages);
    }
  }, []);

  useEffect(() => {
    // Save messages whenever they change
    if (sessionId && messages.length > 0) {
      sessionStorage.setItem(`messages_${sessionId}`, JSON.stringify(messages));
    }
  }, [messages, sessionId]);
  
  const scrollToBottom = () => {
    if (messagesEndRef.current && chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: messagesEndRef.current.offsetTop,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };
  
  useEffect(() => {
    scrollToBottom();
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScroll);
      return () => chatContainer.removeEventListener('scroll', handleScroll);
    }
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      text: message.trim(),
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentMessage = message.trim();
    setMessage('');
    setIsTyping(true);
    
    try {
      // Generate unique identifiers for tracking
      const saleId = generateSaleId(11);
      const actionId = generateUniqueId('chat');
      
      // Create Basic Auth header
      const credentials = btoa('WBK5Pwbk5p:174747m3dWBK5P');

      const response = await axios.post('https://maxyelectazone.app.n8n.cloud/webhook/12d94215-b7c2-4c79-9435-bcea4b859450', {
        saleId: saleId,
        actionId: actionId,
        actionType: 'chat_interaction',
        user_message: userMessage.text,
        session_id: sessionId,
        timestamp: new Date().toISOString(),
        source: 'maxy_electa_website'
      }, {
        headers: {
          'Authorization': `Basic ${credentials}`
        },
        timeout: 10000 // 10 second timeout
      });
      
      console.log('Chat response with tracking IDs:', { saleId, actionId, response: response.data });
      
      // Check if response has valid message format
      let botMessageText = '';
      
      if (response.data && typeof response.data.message === 'string') {
        botMessageText = response.data.message;
      } else if (response.data && typeof response.data === 'string') {
        botMessageText = response.data;
      } else {
        // Invalid response format - switch to offline mode with fallback
        console.warn('Invalid response format from webhook, switching to offline mode');
        setIsOfflineMode(true);
        botMessageText = getFallbackResponse(currentMessage);
        
        // Add a system message about the issue (only once)
        const hasOfflineNotice = messages.some(msg => msg.text.includes('temporarily offline'));
        if (!hasOfflineNotice) {
          setTimeout(() => {
            const offlineNotice = {
              id: (Date.now() + 1).toString(),
              text: "💡 Our live chat system encountered an unexpected response format. I'm providing helpful responses based on common questions. Full chat functionality will be restored soon!",
              isUser: false,
              timestamp: new Date(),
              isError: true
            };
            setMessages(prev => [...prev, offlineNotice]);
          }, 1000);
        }
      }
      
      const botMessage = {
        id: Date.now().toString(),
        text: botMessageText,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Reset offline mode if we successfully connected and got valid response
      if (isOfflineMode && botMessageText !== getFallbackResponse(currentMessage)) {
        setIsOfflineMode(false);
      }
      
    } catch (error) {
      console.error('Chat error:', error);
      
      // Check if this is a network/CORS error
      const isNetworkError = axios.isAxiosError(error) && 
        (error.code === 'ERR_NETWORK' || 
         error.message.includes('Network Error') ||
         error.message.includes('CORS') ||
         !error.response);
      
      if (isNetworkError) {
        // Switch to offline mode and provide fallback response
        setIsOfflineMode(true);
        
        const fallbackResponse = getFallbackResponse(currentMessage);
        
        const botMessage = {
          id: Date.now().toString(),
          text: fallbackResponse,
          isUser: false,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessage]);
        
        // Add a system message about offline mode (only once)
        const hasOfflineNotice = messages.some(msg => msg.text.includes('temporarily offline'));
        if (!hasOfflineNotice) {
          setTimeout(() => {
            const offlineNotice = {
              id: (Date.now() + 1).toString(),
              text: "💡 Our live chat system is temporarily offline due to server connectivity. I'm providing helpful responses based on common questions. Full chat functionality will be restored soon!",
              isUser: false,
              timestamp: new Date(),
              isError: true
            };
            setMessages(prev => [...prev, offlineNotice]);
          }, 1000);
        }
      } else {
        // Handle other types of errors
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: "I'm experiencing some technical difficulties. Please try again in a moment, or feel free to browse our beats above while I get back online!",
          isUser: false,
          timestamp: new Date(),
          isError: true
        }]);
      }
    } finally {
      setIsTyping(false);
    }
  };
  
  return (
    <div className={`${className} h-[500px] relative`}>
      {/* Offline Mode Indicator */}
      <AnimatePresence>
        {isOfflineMode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`absolute top-0 left-0 right-0 z-10 p-3 rounded-t-2xl ${
              isDarkMode ? 'bg-yellow-900/80' : 'bg-yellow-100/80'
            } backdrop-blur-sm border-b ${
              isDarkMode ? 'border-yellow-700/50' : 'border-yellow-300/50'
            }`}
          >
            <div className="flex items-center justify-center gap-2 text-sm">
              <AlertCircle size={16} className={isDarkMode ? 'text-yellow-400' : 'text-yellow-600'} />
              <span className={isDarkMode ? 'text-yellow-200' : 'text-yellow-800'}>
                Chat running in offline mode - providing helpful responses
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Messages */}
      <div 
        ref={chatContainerRef}
        className={`h-[400px] overflow-y-auto rounded-t-2xl p-6 scroll-smooth ${
          isDarkMode ? 'bg-dark-900/80' : 'bg-white/80'
        } backdrop-blur-sm ${isOfflineMode ? 'pt-16' : ''}`}
      >
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              variants={messageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              layout
              className={`mb-6 flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!msg.isUser && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                    msg.isError 
                      ? (isDarkMode ? 'bg-yellow-600' : 'bg-yellow-500')
                      : 'bg-primary-500'
                  }`}
                >
                  {msg.isError ? (
                    <AlertCircle size={20} className="text-white" />
                  ) : (
                    <Music size={20} className="text-white" />
                  )}
                </motion.div>
              )}
              <div
                className={`max-w-[70%] rounded-2xl p-5 ${
                  msg.isUser
                    ? 'bg-primary-500 text-white'
                    : msg.isError
                      ? (isDarkMode ? 'bg-yellow-900/50 text-yellow-100 border border-yellow-700/50' : 'bg-yellow-50 text-yellow-900 border border-yellow-200')
                      : (isDarkMode ? 'bg-dark-800 text-gray-100' : 'bg-gray-100 text-gray-900')
                }`}
              >
                {!msg.isUser && (
                  <div className={`text-sm mb-1 ${
                    msg.isError
                      ? (isDarkMode ? 'text-yellow-300' : 'text-yellow-700')
                      : (isDarkMode ? 'text-primary-300' : 'text-primary-600')
                  }`}>
                    {msg.isError ? 'System Notice' : 'Maxy Electa Bot'}
                  </div>
                )}
                <p className="text-base leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                <p className="text-xs opacity-70 mt-2">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {msg.isUser && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ml-3 flex-shrink-0 ${
                    isDarkMode ? 'bg-dark-700' : 'bg-gray-200'
                  }`}
                >
                  <User size={20} className={isDarkMode ? 'text-white' : 'text-gray-700'} />
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        <AnimatePresence>
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center mb-6"
            >
              <div className="bg-primary-500 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                <Music size={20} className="text-white" />
              </div>
              <div className={`rounded-2xl p-5 ${
                isDarkMode ? 'bg-dark-800' : 'bg-gray-100'
              }`}>
                <div className={`text-sm mb-1 ${
                  isDarkMode ? 'text-primary-300' : 'text-primary-600'
                }`}>
                  Maxy Electa Bot
                </div>
                <div className="flex space-x-2">
                  <motion.span
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                    className={`w-2.5 h-2.5 rounded-full ${
                      isDarkMode ? 'bg-primary-400' : 'bg-primary-500'
                    }`}
                  />
                  <motion.span
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    className={`w-2.5 h-2.5 rounded-full ${
                      isDarkMode ? 'bg-primary-400' : 'bg-primary-500'
                    }`}
                  />
                  <motion.span
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    className={`w-2.5 h-2.5 rounded-full ${
                      isDarkMode ? 'bg-primary-400' : 'bg-primary-500'
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Scroll to Bottom Button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={scrollToBottom}
            className="absolute bottom-24 right-8 bg-primary-500 text-white p-2 rounded-full shadow-lg hover:bg-primary-600 transition-colors z-20"
          >
            <ArrowDown size={20} />
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Chat Input */}
      <div className="relative">
        <div className={`absolute inset-0 bg-gradient-to-b ${
          isDarkMode 
            ? 'from-primary-500/20 to-primary-500/5'
            : 'from-primary-500/10 to-primary-500/5'
        } backdrop-blur-sm rounded-b-2xl`} />
        <div className="relative p-6">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isOfflineMode ? "Ask about beats, pricing, or services (offline mode)..." : "Ask about beats, pricing, or custom orders..."}
              className={`flex-1 rounded-2xl px-8 py-5 text-lg outline-none border-2 transition-all duration-300 ${
                isDarkMode
                  ? 'bg-dark-800/50 text-white placeholder-gray-400 border-dark-700/50 focus:border-primary-500/50 hover:bg-dark-800/70'
                  : 'bg-white/50 text-gray-900 placeholder-gray-500 border-gray-200 focus:border-primary-500/50 hover:bg-white/70'
              }`}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className={`text-white p-5 rounded-2xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg ${
                isOfflineMode 
                  ? 'bg-yellow-600 hover:bg-yellow-700 shadow-yellow-600/20'
                  : 'bg-primary-500 hover:bg-primary-600 shadow-primary-500/20'
              }`}
            >
              <Send size={24} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;