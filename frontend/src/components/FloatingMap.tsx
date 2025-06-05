import React, { useEffect, useRef, useState, memo } from 'react';
import { X, Minus } from 'lucide-react';

interface FloatingMapProps {
  mapUrl?: string;
  isVisible: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onRestore: () => void;
}

const FloatingMap: React.FC<FloatingMapProps> = memo(({
  mapUrl,
  isVisible,
  onClose,
  onMinimize,
  onRestore
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: window.innerWidth - 520, y: 80 });
  const [size, setSize] = useState({ width: 500, height: 400 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.map-controls')) {
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
      
      const newWidth = Math.max(300, Math.min(resizeStart.width + deltaWidth, window.innerWidth - position.x));
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

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className={`fixed z-30 bg-black/20 backdrop-blur-sm rounded-lg shadow-lg ${isDragging ? 'cursor-grabbing' : ''}`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        transition: isDragging || isResizing ? 'none' : 'left 0.3s ease, top 0.3s ease',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* Map Controls */}
      <div 
        className="flex justify-between items-center gap-2 p-2 map-controls cursor-grab bg-black/30"
        onMouseDown={handleMouseDown}
      >
        <div className="text-white/80 text-sm px-2">Directions Map</div>
        <div className="flex gap-2">
          <button
            onClick={onMinimize}
            className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors"
            title="Minimize Map"
          >
            <Minus className="w-3 h-3 text-white/80" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 bg-white/10 hover:bg-red-500/50 rounded-full backdrop-blur-sm transition-colors"
            title="Close Map"
          >
            <X className="w-3 h-3 text-white/80" />
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="w-full h-[calc(100%-40px)] bg-black/10">
        {mapUrl ? (
          <iframe
            width="100%"
            height="100%"
            style={{ 
              border: 0,
              borderRadius: '0 0 8px 8px'
            }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={mapUrl}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/50">
            Loading map...
          </div>
        )}
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
});

FloatingMap.displayName = 'FloatingMap';

export default FloatingMap; 