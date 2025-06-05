import React, { useEffect, useRef, useState } from 'react';
import { X, Minus } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: string;
  mapEmbed?: string;
}

interface FloatingMessagesProps {
  messages: Message[];
  isVisible: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
}

const FloatingMessages: React.FC<FloatingMessagesProps> = ({ 
  messages, 
  isVisible, 
  onClose, 
  onMinimize 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: messages.length });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 400, height: 600 }); // Increased initial size
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // Initialize position on first render
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({ x: rect.left, y: rect.top });
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.chat-controls')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      const maxX = window.innerWidth - size.width;
      const maxY = window.innerHeight - size.height;
      
      setPosition({
        x: Math.min(Math.max(0, newX), maxX),
        y: Math.min(Math.max(0, newY), maxY)
      });
    }

    if (isResizing) {
      const deltaWidth = e.clientX - resizeStart.x;
      const deltaHeight = e.clientY - resizeStart.y;
      
      const newWidth = Math.max(280, Math.min(resizeStart.width + deltaWidth, window.innerWidth - position.x));
      const newHeight = Math.max(300, Math.min(resizeStart.height + deltaHeight, window.innerHeight - position.y));
      
      setSize({
        width: newWidth,
        height: newHeight
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, resizeStart]);

  useEffect(() => {
    if (messagesEndRef.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    
    // Calculate which messages should be visible based on scroll position
    const messageHeight = 80; // Approximate height per message
    const visibleCount = Math.ceil(clientHeight / messageHeight);
    const scrolledMessages = Math.floor(scrollTop / messageHeight);
    
    setVisibleRange({
      start: Math.max(0, scrolledMessages),
      end: Math.min(messages.length, scrolledMessages + visibleCount + 2)
    });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial calculation
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [messages.length]);

  if (!isVisible) return null;

  return (
    <div 
      ref={containerRef}
      className={`fixed z-30 ${isDragging ? 'cursor-grabbing' : ''}`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        transition: isDragging || isResizing ? 'none' : 'left 0.3s ease, top 0.3s ease'
      }}
    >
      {/* Chat Controls */}
      <div 
        className="flex justify-end gap-2 mb-2 p-2 chat-controls cursor-grab"
        onMouseDown={handleMouseDown}
      >
        {onMinimize && (
          <button
            onClick={onMinimize}
            className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors"
            title="Minimize Chat"
          >
            <Minus className="w-3 h-3 text-white/80" />
          </button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 bg-white/10 hover:bg-red-500/50 rounded-full backdrop-blur-sm transition-colors"
            title="Close Chat"
          >
            <X className="w-3 h-3 text-white/80" />
          </button>
        )}
      </div>

      {/* Messages Container */}
      <div 
        ref={scrollContainerRef}
        className="flex flex-col h-[calc(100%-40px)] overflow-y-auto scrollbar-none px-4 relative"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div className="flex-1" />
        <div className="flex flex-col gap-1">
          {messages.map((message, index) => {
            const isInVisibleRange = index >= visibleRange.start && index <= visibleRange.end;
            const distanceFromEnd = messages.length - 1 - index;
            let opacity = 1;
            
            if (isInVisibleRange) {
              if (distanceFromEnd >= 4) opacity = 0.3;
              else if (distanceFromEnd >= 2) opacity = 0.6;
              else opacity = 1;
            } else {
              opacity = 0.3;
            }

            return (
              <div
                key={message.id}
                className="animate-fade-in transition-opacity duration-300"
                style={{ opacity }}
              >
                <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-1`}>
                  <div
                    className={`${
                      message.type === 'map' ? 'max-w-[90%] w-[400px]' : 'max-w-[250px]'
                    } px-4 py-2 ${
                      message.isUser
                        ? 'bg-[#007AFF] text-white rounded-[18px] rounded-br-[4px]'
                        : 'bg-[#3C3C43] text-white rounded-[18px] rounded-bl-[4px]'
                    }`}
                  >
                    <p className="text-[15px] leading-[20px] font-normal">{message.text}</p>
                    {message.type === 'map' && message.mapEmbed && (
                      <>
                        <div className="mt-2 rounded-lg overflow-hidden">
                          <iframe
                            width="100%"
                            height="300"
                            style={{ 
                              border: 0,
                              borderRadius: '8px',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)'
                            }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={message.mapEmbed}
                          />
                        </div>
                        <div className="mt-2">
                          <a 
                            href={message.mapEmbed.replace('embed/v1', 'dir')} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-300 hover:text-blue-400 text-sm underline"
                          >
                            Open in Google Maps
                          </a>
                        </div>
                      </>
                    )}
                    <p className="text-xs opacity-60 mt-1 text-right">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Resize Handle */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        onMouseDown={handleResizeMouseDown}
        style={{
          background: 'radial-gradient(circle at bottom right, rgba(255,255,255,0.2) 0%, transparent 60%)',
        }}
      />
    </div>
  );
};

export default FloatingMessages;
