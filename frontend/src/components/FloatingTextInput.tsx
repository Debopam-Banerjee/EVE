import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Send } from 'lucide-react';

interface FloatingTextInputProps {
  onSendMessage: (message: string, useVoice: boolean) => void;
  isLoading: boolean;
  voiceEnabled: boolean;
  onVoiceToggle: () => void;
}

const FloatingTextInput: React.FC<FloatingTextInputProps> = ({ 
  onSendMessage, 
  isLoading, 
  voiceEnabled, 
  onVoiceToggle 
}) => {
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showBlinking, setShowBlinking] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowBlinking(prev => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleFocus = () => {
    setIsExpanded(true);
    setShowBlinking(false);
  };

  const handleBlur = () => {
    if (!message.trim()) {
      setIsExpanded(false);
      setShowBlinking(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim(), voiceEnabled);
      setMessage('');
      // Keep the input focused after sending
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  };

  const handleClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      setShowBlinking(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  };

  const glowingInputKeyframes = `
    @keyframes glowingBorder {
      0% {
        border-color: rgba(0, 191, 255, 0.1);
      }
      50% {
        border-color: rgba(0, 191, 255, 0.3);
      }
      100% {
        border-color: rgba(0, 191, 255, 0.1);
      }
    }

    @keyframes glowingBackground {
      0% {
        background-position: 500% 0;
      }
      100% {
        background-position: -500% 0;
      }
    }
  `;

  return (
    <>
      <style>{glowingInputKeyframes}</style>
      <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-20">
        <form onSubmit={handleSubmit}>
          <div 
            className={`relative transition-all duration-300 ease-out cursor-text ${
              isExpanded ? 'w-96' : 'w-32'
            }`}
            onClick={handleClick}
          >
            {/* Minimal placeholder state */}
            {!isExpanded && (
              <div className="flex items-center justify-center text-white/60 text-sm">
                Type here...
                {showBlinking && <span className="ml-1 text-[#00BFFF]">|</span>}
              </div>
            )}

            {/* Expanded input state */}
            {isExpanded && (
              <div className="relative">
                {/* Background layer with animation */}
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.06) 50%, rgba(255, 255, 255, 0.02) 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'glowingBackground 24s linear infinite',
                    backdropFilter: 'blur(8px)',
                  }}
                />
                
                {/* Content layer */}
                <div 
                  className="relative flex items-center gap-3 px-4 py-3 rounded-full border bg-black/20 backdrop-blur-sm"
                  style={{
                    animation: 'glowingBorder 24s linear infinite',
                  }}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    id="eve-chat-input"
                    name="eve-chat-input"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="Ask Eve anything..."
                    disabled={isLoading}
                    className="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-sm"
                    autoComplete="off"
                  />
                  
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onVoiceToggle();
                    }}
                    className={`p-1.5 rounded-full transition-colors ${
                      voiceEnabled 
                        ? 'bg-[#00BFFF]/20 text-[#00BFFF]' 
                        : 'text-white/40 hover:text-white/60'
                    }`}
                    title={voiceEnabled ? "Voice response enabled" : "Voice response disabled"}
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>

                  <button
                    type="submit"
                    disabled={!message.trim() || isLoading}
                    className="p-1.5 text-[#00BFFF] hover:text-[#00BFFF]/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default FloatingTextInput;
