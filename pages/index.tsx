import Link from 'next/link';
import getSecureServerSideProps from '@/lib/getSecureServerSideProps';
import CheckInFormRefactored from '@/components/CheckInFormRefactored';
import Slideshow from '@/components/Slideshow';
import Title from '@/components/Title';
import Logo from '@/components/Logo';
import { useState, useEffect, useCallback } from 'react';

export default function UserDashboard() {
  const [showForm, setShowForm] = useState(false);
  const [hasFormData, setHasFormData] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // You can customize these slides as needed
  const slideshowSlides = [
    { image: '/smoked-jalapeno-cheddar-brats.jpg', text: 'Smoked Jalapeño Cheddar Brats', tag: 'Limited Time Only' },
    { image: '/country_breakfast_sausage.jpg', text: 'Country Breakfast Sausage' },
    { image: '/garlic_ring.jpg', text: 'Garlic Ring Bologna' },
    { image: '/jerky.jpg', text: 'Jerky Restructured' },
    { image: '/trail_bologna.jpg', text: 'Trail Bologna' },
    { image: '/summer.jpg', text: 'Summer Sausage' },
  ];

  const handleBegin = () => {
    setShowForm(true);
    setLastActivity(Date.now());
  };

  // Track user activity
  const handleActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  // Handle form data changes
  const handleFormDataChange = useCallback((hasData: boolean) => {
    setHasFormData(hasData);
  }, []);

  // Reset to slideshow after 1 minute of inactivity (only if no form data)
  useEffect(() => {
    if (!showForm || hasFormData) return;

    const checkInactivity = () => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;

      // 1 minute = 60,000 milliseconds
      if (timeSinceLastActivity >= 60000) {
        setShowForm(false);
        setHasFormData(false);
        setLastActivity(Date.now());
      }
    };

    const interval = setInterval(checkInactivity, 1000); // Check every second

    return () => clearInterval(interval);
  }, [showForm, hasFormData, lastActivity]);

  // Add event listeners for user activity when form is shown
  useEffect(() => {
    if (!showForm) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [showForm, handleActivity]);

  if (!showForm) {
    return <Slideshow slides={slideshowSlides} onBegin={handleBegin} />;
  }

  return (
    <div className='container flex max-w-[900px] flex-col justify-center py-12 sm:px-6 md:min-h-[800px] lg:px-8'>
      <div className='bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10'>
        <CheckInFormRefactored onFormDataChange={handleFormDataChange} />
      </div>
    </div>
  );
}

export const getServerSideProps = getSecureServerSideProps(() => ({ props: {} }));
