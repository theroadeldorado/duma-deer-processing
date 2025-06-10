import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Slide {
  image: string;
  text: string;
}

interface SlideshowProps {
  slides: Slide[];
  onBegin: () => void;
}

export default function Slideshow({ slides, onBegin }: SlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  if (!slides.length) {
    return (
      <div className='fixed inset-0 flex items-center justify-center bg-gray-900'>
        <p className='text-xl text-white'>No slides provided</p>
      </div>
    );
  }

  return (
    <div className='fixed inset-0 cursor-pointer bg-black' onClick={onBegin}>
      {/* Image Container */}
      <div className='relative h-full w-full overflow-hidden'>
        {slides.map((slide, index) => (
          <div
            key={slide.image}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            <Image
              src={slide.image}
              alt={slide.text}
              fill
              className={`object-cover transition-transform duration-[5000ms] ease-out ${index === currentIndex ? 'scale-105' : 'scale-100'}`}
              priority={index === 0}
            />
          </div>
        ))}

        {/* Overlay for better text visibility */}
        <div className='absolute inset-0 bg-black bg-opacity-30' />
      </div>

      {/* Product Text - Top Right */}
      <div className='absolute right-8 top-8 text-right'>
        <h1 className='text-display-lg font-bold text-white drop-shadow-2xl'>{slides[currentIndex]?.text}</h1>
      </div>

      {/* Tap to Begin Text - Bottom Center */}
      <div className='absolute bottom-8 left-1/2 -translate-x-1/2 text-center'>
        <p className='md:text-2xl animate-pulse text-xl font-medium text-white drop-shadow-lg'>Tap anywhere to begin</p>
      </div>

      {/* Image Indicators - Moved up to avoid overlapping with text */}
      {slides.length > 1 && (
        <div className='absolute bottom-20 left-1/2 flex -translate-x-1/2 space-x-2'>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering onBegin when clicking indicators
                setCurrentIndex(index);
              }}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white' : 'bg-white/50'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
