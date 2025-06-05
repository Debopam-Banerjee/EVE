import React, { useState, useEffect } from 'react';
import { ChatMessageWithMap } from '../types/maps';
import MapEmbed from './MapEmbed';

interface ChatMessageProps {
  message: string | ChatMessageWithMap;
  sender: 'user' | 'assistant';
}

const ChatMessage = ({ message, sender }: ChatMessageProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const isMapMessage = typeof message !== 'string' && message.type === 'map';

  // Debug logging
  useEffect(() => {
    if (isMapMessage) {
      console.log('Received map message:', {
        type: (message as ChatMessageWithMap).type,
        mapEmbed: (message as ChatMessageWithMap).mapEmbed,
        reply: (message as ChatMessageWithMap).reply
      });
    }
  }, [message, isMapMessage]);

  useEffect(() => {
    if (sender === 'assistant') {
      setIsTyping(true);
      setDisplayedText('');
      setShowMap(false);
      let currentIndex = 0;
      const textToType = isMapMessage ? (message as ChatMessageWithMap).reply : message as string;
      
      const typingInterval = setInterval(() => {
        if (currentIndex < textToType.length) {
          setDisplayedText(prev => prev + textToType[currentIndex]);
          currentIndex++;
        } else {
          setIsTyping(false);
          if (isMapMessage) {
            console.log('Showing map after typing finished');
            setShowMap(true);
          }
          clearInterval(typingInterval);
        }
      }, 30);

      return () => clearInterval(typingInterval);
    } else {
      setDisplayedText(isMapMessage ? (message as ChatMessageWithMap).reply : message as string);
      if (isMapMessage) {
        console.log('User message with map, showing immediately');
        setShowMap(true);
      }
    }
  }, [message, sender, isMapMessage]);

  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div 
        className={`max-w-[80%] rounded-2xl p-3 shadow-lg ${
          sender === 'user' 
            ? 'bg-eve-accent/90 text-white rounded-tr-none message-glow transition-all duration-300 hover:bg-eve-accent'
            : 'glass-bubble text-white rounded-tl-none backdrop-blur-xl transition-all duration-300 hover:bg-white/15'
        }`}
      >
        <div className="space-y-3">
          <p className="text-sm md:text-base font-medium">
            {displayedText}
            {isTyping && (
              <span className="inline-block ml-1 animate-pulse">▋</span>
            )}
          </p>
          {isMapMessage && showMap && (
            <MapEmbed mapUrl={(message as ChatMessageWithMap).mapEmbed} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
