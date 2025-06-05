
import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ConversationPanelProps {
  messages: Message[];
  isVisible: boolean;
}

const ConversationPanel: React.FC<ConversationPanelProps> = ({ messages, isVisible }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isVisible) return null;

  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 w-80 h-96 glass border border-white/20 rounded-2xl p-4 overflow-hidden z-40">
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              Start a conversation with Eve...
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message.text}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default ConversationPanel;
