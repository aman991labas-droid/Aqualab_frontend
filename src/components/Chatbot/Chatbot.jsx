'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import AqualabLogoIcon from './AqualabLogoIcon';
import './Chatbot.css';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcomeBubble, setShowWelcomeBubble] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Bonjour ! Je suis l'assistant virtuel d'Aqualab. Comment puis-je vous aider aujourd'hui ?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Afficher la bulle de bienvenue après 1 seconde au chargement
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomeBubble(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenChat = () => {
    setIsOpen(true);
    setShowWelcomeBubble(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { id: Date.now(), text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.text })
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage = { id: Date.now() + 1, text: data.reply, sender: 'bot' };
        setMessages(prev => [...prev, botMessage]);
      } else {
        let errorMsg = 'Erreur réseau';
        try {
          const errData = await response.json();
          if (errData.reply) errorMsg = errData.reply;
          if (errData.message) errorMsg = errData.message;
        } catch (e) {}
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('Erreur Chatbot:', error);
      const errorMessage = { id: Date.now() + 1, text: error.message || "Désolé, je n'ai pas pu vous répondre. Veuillez réessayer plus tard.", sender: 'bot', isError: true };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {/* Bulle de bienvenue */}
      <AnimatePresence>
        {showWelcomeBubble && !isOpen && (
          <motion.div
            className="chatbot-welcome-bubble"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <button
              className="chatbot-welcome-close"
              onClick={() => setShowWelcomeBubble(false)}
              aria-label="Fermer"
            >
              <X size={12} />
            </button>
            <p onClick={handleOpenChat}>Comment puis-je vous aider ?</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Button */}
      <motion.button
        className="chatbot-button"
        whileHover={{
          scale: 1.1,
          y: -4,
          transition: { type: 'spring', stiffness: 520, damping: 12, mass: 0.6 },
        }}
        whileTap={{ scale: 0.92, y: 0 }}
        onClick={handleOpenChat}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, display: isOpen ? 'none' : 'flex' }}
        transition={{ duration: 0.3 }}
        aria-label="Ouvrir l'assistant Aqualab"
      >
        <span className="chatbot-button__pulse" aria-hidden="true" />
        <span className="chatbot-button__pulse chatbot-button__pulse--delayed" aria-hidden="true" />
        <span className="chatbot-button__inner">
          <AqualabLogoIcon className="chatbot-button__logo" alt="" />
        </span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="chatbot-header">
              <div className="chatbot-header-info">
                <div className="chatbot-header__avatar" aria-hidden="true">
                  <AqualabLogoIcon className="chatbot-header__logo" alt="" />
                </div>
                <div className="chatbot-header-text">
                  <h3>Assistant Aqualab</h3>
                  <p>En ligne</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="chatbot-close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="chatbot-messages">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chatbot-message-row ${msg.sender}`}
                >
                  <div className="chatbot-message-content">
                    <div
                      className="chatbot-msg-avatar"
                      aria-hidden="true"
                    >
                      {msg.sender === 'user' ? (
                        <User size={16} />
                      ) : (
                        <AqualabLogoIcon className="chatbot-msg-avatar__logo" alt="" />
                      )}
                    </div>
                    <div className={`chatbot-bubble ${msg.isError ? 'error' : ''}`}>
                      {msg.sender === 'bot' && !msg.isError ? (
                        <div className="markdown-content">
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                      ) : (
                        msg.text
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="chatbot-message-row bot">
                  <div className="chatbot-message-content">
                    <div className="chatbot-msg-avatar" aria-hidden="true">
                      <AqualabLogoIcon className="chatbot-msg-avatar__logo" alt="" />
                    </div>
                    <div className="chatbot-bubble">
                      <div className="chatbot-loading">
                        <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                        <span>L'assistant réfléchit...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="chatbot-input-area">
              <form onSubmit={handleSendMessage} className="chatbot-form">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Écrivez votre message..."
                  className="chatbot-input"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="chatbot-send"
                >
                  <Send size={18} className={`chatbot-send-icon ${inputValue.trim() && !isLoading ? 'active' : ''}`} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
