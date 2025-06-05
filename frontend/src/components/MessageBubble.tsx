
import React from 'react';

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: Date;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isUser, timestamp }) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2 animate-fade-in`}>
      <div className={`max-w-[250px] px-4 py-2 ${
        isUser 
          ? 'bg-[#007AFF] text-white rounded-[18px] rounded-br-[4px]' 
          : 'bg-[#3C3C43] text-white rounded-[18px] rounded-bl-[4px]'
      }`}>
        <p className="text-[15px] leading-[20px] font-normal">{message}</p>
        {timestamp && (
          <p className="text-xs opacity-60 mt-1 text-right">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
