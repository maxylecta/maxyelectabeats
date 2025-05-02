import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Music, ArrowDown } from 'lucide-react';
import axios from 'axios';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
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
    setMessage('');
    setIsTyping(true);
    
    try {
      const response = await axios.post('https://maxyelectazone.app.n8n.cloud/webhook/12d94215-b7c2-4c79-9435-bcea4b859450', {
        user_message: userMessage.text,
        session_id: sessionId
      });
      
      const botResponse = response.data?.message || "I apologize, but I'm having trouble processing your request at the moment. Please try again.";
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: botResponse,
        isUser: false,
        timestamp: new Date()
      }]);
      
    } catch (error) {
      console.error('Error sending message to webhook:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };
  
  return (
    <div className={`${className}`}>
      {/* Chat Messages */}
      <div 
        ref={chatContainerRef}
        className="h-[400px] overflow-y-auto rounded-t-2xl bg-dark-900/80 backdrop-blur-sm p-6 scroll-smooth"
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
                  className="bg-primary-500 w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                >
                  <Music size={20} className="text-white" />
                </motion.div>
              )}
              <div
                className={`max-w-[70%] rounded-2xl p-5 ${
                  msg.isUser
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-800 text-gray-100'
                }`}
              >
                {!msg.isUser && <div className="text-sm text-primary-300 mb-1">Maxy Electa Bot</div>}
                <p className="text-base leading-relaxed">{msg.text}</p>
                <p className="text-xs opacity-70 mt-2">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {msg.isUser && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="bg-dark-700 w-10 h-10 rounded-full flex items-center justify-center ml-3 flex-shrink-0"
                >
                  <User size={20} className="text-white" />
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
              <div className="bg-dark-800 text-white rounded-2xl p-5">
                <div className="text-sm text-primary-300 mb-1">Maxy Electa Bot</div>
                <div className="flex space-x-2">
                  <motion.span
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                    className="w-2.5 h-2.5 bg-primary-400 rounded-full"
                  />
                  <motion.span
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    className="w-2.5 h-2.5 bg-primary-400 rounded-full"
                  />
                  <motion.span
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    className="w-2.5 h-2.5 bg-primary-400 rounded-full"
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
            className="absolute bottom-24 right-8 bg-primary-500 text-white p-2 rounded-full shadow-lg hover:bg-primary-600 transition-colors"
          >
            <ArrowDown size={20} />
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Chat Input */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-500/20 to-primary-500/5 backdrop-blur-sm rounded-b-2xl" />
        <div className="relative p-6">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about beats, pricing, or custom orders..."
              className="flex-1 bg-dark-800/50 text-white rounded-2xl px-8 py-5 text-lg outline-none placeholder-gray-400 border-2 border-dark-700/50 focus:border-primary-500/50 transition-all duration-300 hover:bg-dark-800/70"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="bg-primary-500 hover:bg-primary-600 text-white p-5 rounded-2xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-primary-500/20"
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