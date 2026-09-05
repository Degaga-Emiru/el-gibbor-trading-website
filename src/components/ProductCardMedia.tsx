import React, { useState } from 'react';
import { Play, ChevronLeft, ChevronRight, Image as ImageIcon, Film } from 'lucide-react';

interface ProductCardMediaProps {
  images?: string[];
  videos?: string[];
  alt: string;
}

export const ProductCardMedia: React.FC<ProductCardMediaProps> = ({
  images = [],
  videos = [],
  alt,
}) => {
  const [activeIdx, setActiveIdx] = useState(0);

  // Combine videos first, then images
  const mediaList: Array<{ type: 'video' | 'image'; url: string; label: string }> = [
    ...videos.map((vid, idx) => ({
      type: 'video' as const,
      url: vid,
      label: `Video ${idx + 1}`,
    })),
    ...images.map((img, idx) => ({
      type: 'image' as const,
      url: img,
      label: `Image ${idx + 1}`,
    })),
  ];

  // Fallback default image if list is empty
  if (mediaList.length === 0) {
    mediaList.push({
      type: 'image',
      url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=800',
      label: 'Image 1',
    });
  }

  const currentMedia = mediaList[activeIdx] || mediaList[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveIdx((prev) => (prev - 1 + mediaList.length) % mediaList.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveIdx((prev) => (prev + 1) % mediaList.length);
  };

  return (
    <div className="w-full h-full relative bg-black overflow-hidden group">
      {/* Current Media Render */}
      {currentMedia.type === 'video' ? (
        <div className="w-full h-full relative">
          <video
            src={currentMedia.url}
            autoPlay
            loop
            muted
            playsInline
            controls
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md text-amber-400 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-amber-500/40 z-10">
            <Play size={11} className="fill-amber-400" />
            <span>{currentMedia.label}</span>
          </div>
        </div>
      ) : (
        <div className="w-full h-full relative">
          <img
            src={currentMedia.url}
            alt={`${alt} ${currentMedia.label}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {mediaList.length > 1 && (
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-full z-10">
              {currentMedia.label}
            </div>
          )}
        </div>
      )}

      {/* Prev / Next Arrows if multiple media items */}
      {mediaList.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 z-20 shadow-md cursor-pointer"
            aria-label="Previous Media"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 z-20 shadow-md cursor-pointer"
            aria-label="Next Media"
          >
            <ChevronRight size={18} />
          </button>

          {/* Bottom Thumbnails / Selector Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
            {mediaList.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setActiveIdx(idx);
                }}
                className={`flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full transition-all cursor-pointer ${
                  activeIdx === idx
                    ? item.type === 'video'
                      ? 'bg-amber-500 text-black shadow'
                      : 'bg-blue-600 text-white shadow'
                    : 'bg-white/20 text-white hover:bg-white/40'
                }`}
                title={item.label}
              >
                {item.type === 'video' ? <Film size={10} /> : <ImageIcon size={10} />}
                <span>{idx + 1}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductCardMedia;
