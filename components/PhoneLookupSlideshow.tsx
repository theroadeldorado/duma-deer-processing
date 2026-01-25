import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Button from '@/components/Button';
import { formatPhoneForDisplay, normalizePhone } from '@/lib/phoneUtils';
import { CustomerSummary } from '@/lib/types';

interface Slide {
  image: string;
  text: string;
  tag?: string;
}

interface PhoneLookupSlideshowProps {
  slides: Slide[];
  onNewCustomer: () => void;
  onCustomersFound: (customers: CustomerSummary[]) => void;
}

export default function PhoneLookupSlideshow({
  slides,
  onNewCustomer,
  onCustomersFound,
}: PhoneLookupSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noResults, setNoResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow digits, spaces, dashes, parentheses, and plus sign
    const cleaned = value.replace(/[^\d\s\-()+ ]/g, '');
    setPhone(cleaned);
    setError(null);
    setNoResults(false);
  };

  const handleLookup = async () => {
    const normalized = normalizePhone(phone);

    if (normalized.length < 7) {
      setError('Please enter at least 7 digits');
      return;
    }

    setIsLoading(true);
    setError(null);
    setNoResults(false);

    try {
      const response = await fetch('/api/customer-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to look up phone number');
        return;
      }

      if (data.customers && data.customers.length > 0) {
        onCustomersFound(data.customers);
      } else {
        setNoResults(true);
      }
    } catch (err) {
      setError('Failed to connect. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLookup();
    }
  };

  if (!slides.length) {
    return (
      <div className='fixed inset-0 flex items-center justify-center bg-gray-900'>
        <p className='text-xl text-white'>No slides provided</p>
      </div>
    );
  }

  return (
    <div className='fixed inset-0 bg-black'>
      {/* Image Container */}
      <div className='relative h-full w-full overflow-hidden'>
        {slides.map((slide, index) => (
          <div
            key={slide.image}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.text}
              fill
              className={`object-cover transition-transform duration-[5000ms] ease-out ${
                index === currentIndex ? 'scale-105' : 'scale-100'
              }`}
              priority={index === 0}
            />
          </div>
        ))}

        {/* Overlay for better text visibility */}
        <div className='absolute inset-0 bg-black bg-opacity-40' />
      </div>

      {/* Product Text - Top Right */}
      <div className='absolute right-8 top-8 flex flex-col items-end gap-3 text-right'>
        <h1 className='flex items-center gap-2 text-display-lg font-bold text-white drop-shadow-2xl'>
          {slides[currentIndex]?.text}
        </h1>
        {slides[currentIndex]?.tag && (
          <span className='rounded-full bg-red-500 px-3 py-1 text-sm font-semibold uppercase text-white'>
            {slides[currentIndex]?.tag}
          </span>
        )}
      </div>

      {/* Phone Lookup Section - Center */}
      <div className='absolute inset-0 flex items-center justify-center'>
        <div className='w-full max-w-md rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur-sm'>
          <h2 className='mb-2 text-center text-3xl font-bold text-gray-900'>
            Have you been here before?
          </h2>
          <p className='mb-6 text-center text-gray-700'>
            Enter your phone number to look up your information and reorder what you got last time, or start fresh.
          </p>

          <div className='space-y-4'>
            <div>
              <label htmlFor='phone' className='mb-2 block text-sm font-medium text-gray-700'>
                Phone Number
              </label>
              <input
                ref={inputRef}
                type='tel'
                id='phone'
                value={phone}
                onChange={handlePhoneChange}
                onKeyDown={handleKeyDown}
                placeholder='(555) 123-4567'
                className='w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/20'
                autoComplete='tel'
              />
            </div>

            {error && (
              <div className='rounded-md bg-red-50 p-3 text-center text-sm text-red-600'>
                {error}
              </div>
            )}

            {noResults && (
              <div className='rounded-md bg-amber-50 p-3 text-center text-sm text-amber-700'>
                No previous orders found. Click &quot;New Customer&quot; to get started!
              </div>
            )}

            <Button
              onClick={handleLookup}
              disabled={isLoading || phone.length < 7}
              className='w-full py-3 text-lg'
              size='xl'
            >
              {isLoading ? (
                <span className='flex items-center justify-center gap-2'>
                  <svg className='h-5 w-5 animate-spin' viewBox='0 0 24 24'>
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                      fill='none'
                    />
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    />
                  </svg>
                  Looking up...
                </span>
              ) : (
                'Look Up'
              )}
            </Button>

              <div className='flex justify-between items-center text-sm'>
                <span className='grow h-px bg-gray-300' />
                <span className=' mb-1 px-4 text-gray-500 shrink-0'>or</span>
                <span className='grow h-px bg-gray-300' />
              </div>

            <Button onClick={onNewCustomer} color='default' className='w-full py-3 text-lg' size='xl'>
              New Customer
            </Button>
          </div>
        </div>
      </div>

      {/* Image Indicators */}
      {slides.length > 1 && (
        <div className='absolute bottom-8 left-1/2 flex -translate-x-1/2 space-x-2'>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
