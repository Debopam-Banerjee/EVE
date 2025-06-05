import React, { useEffect } from 'react';

interface MapEmbedProps {
  mapUrl: string;
}

export const MapEmbed: React.FC<MapEmbedProps> = ({ mapUrl }) => {
  useEffect(() => {
    console.log('MapEmbed received URL:', mapUrl);
  }, [mapUrl]);

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden bg-black/10">
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={mapUrl}
        title="Google Maps"
      />
    </div>
  );
};

export default MapEmbed; 