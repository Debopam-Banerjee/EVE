
import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface EveInputProps {
  onSendMessage: (message: string, useVoice: boolean) => void;
  isLoading: boolean;
  voiceEnabled: boolean;
  onVoiceToggle: () => void;
}

const EveInput: React.FC<EveInputProps> = ({ 
  onSendMessage, 
  isLoading, 
  voiceEnabled, 
  onVoiceToggle 
}) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim(), voiceEnabled);
      setMessage('');
      setIsFocused(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className={`glass border border-white/20 rounded-2xl p-4 transition-all duration-300 ${
          isFocused ? 'border-[#00BFFF]/50 shadow-lg shadow-[#00BFFF]/20' : ''
        }`}>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={isFocused ? "Type your message to Eve..." : "Type here..."}
                disabled={isLoading}
                className={`w-full bg-transparent text-white placeholder-gray-400 outline-none transition-all duration-300 ${
                  isFocused ? 'text-base' : 'text-sm'
                }`}
              />
            </div>
            
            <button
              type="button"
              onClick={onVoiceToggle}
              className={`p-2 rounded-lg transition-colors ${
                voiceEnabled 
                  ? 'bg-[#00BFFF] text-white hover:bg-[#00BFFF]/80' 
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
              title={voiceEnabled ? "Disable Voice Response" : "Enable Voice Response"}
            >
              {voiceEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>

            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className="px-4 py-2 bg-[#00BFFF] text-white rounded-lg hover:bg-[#00BFFF]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EveInput;
