import getSecureServerSideProps from '@/lib/getSecureServerSideProps';
import CheckInFormRefactored from '@/components/CheckInFormRefactored';
import PhoneLookupSlideshow from '@/components/PhoneLookupSlideshow';
import { CustomerSelectionScreen, QuickReorderFlow } from '@/components/returning-customer';
import { useState, useEffect, useCallback } from 'react';
import { CustomerSummary, QuickReorderMode, DeerT } from '@/lib/types';

export default function UserDashboard() {
  const [flowMode, setFlowMode] = useState<QuickReorderMode>('slideshow');
  const [hasFormData, setHasFormData] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [matchedCustomers, setMatchedCustomers] = useState<CustomerSummary[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerSummary | null>(null);
  const [prefilledData, setPrefilledData] = useState<Partial<DeerT> | null>(null);

  // Slideshow slides configuration
  const slideshowSlides = [
    { image: '/smoked-jalapeno-cheddar-brats.jpg', text: 'Smoked Jalapeno Cheddar Brats', tag: 'Limited Time Only' },
    { image: '/country_breakfast_sausage.jpg', text: 'Country Breakfast Sausage' },
    { image: '/garlic_ring.jpg', text: 'Garlic Ring Bologna' },
    { image: '/jerky.jpg', text: 'Jerky Restructured' },
    { image: '/trail_bologna.jpg', text: 'Trail Bologna' },
    { image: '/summer.jpg', text: 'Summer Sausage' },
  ];

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
    // Don't reset if we're on slideshow or have form data
    if (flowMode === 'slideshow' || hasFormData) return;

    const checkInactivity = () => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;

      // 1 minute = 60,000 milliseconds
      if (timeSinceLastActivity >= 60000) {
        resetToSlideshow();
      }
    };

    const interval = setInterval(checkInactivity, 1000);

    return () => clearInterval(interval);
  }, [flowMode, hasFormData, lastActivity]);

  // Add event listeners for user activity when not on slideshow
  useEffect(() => {
    if (flowMode === 'slideshow') return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [flowMode, handleActivity]);

  // Reset all state to slideshow
  const resetToSlideshow = () => {
    setFlowMode('slideshow');
    setHasFormData(false);
    setMatchedCustomers([]);
    setSelectedCustomer(null);
    setPrefilledData(null);
    setLastActivity(Date.now());
  };

  // Handle new customer button
  const handleNewCustomer = () => {
    setFlowMode('new-customer');
    setPrefilledData(null);
    setLastActivity(Date.now());
  };

  // Handle customers found from phone lookup
  const handleCustomersFound = (customers: CustomerSummary[]) => {
    setMatchedCustomers(customers);
    setFlowMode('customer-selection');
    setLastActivity(Date.now());
  };

  // Handle customer selection
  const handleSelectCustomer = (customer: CustomerSummary) => {
    setSelectedCustomer(customer);
    setFlowMode('quick-reorder');
    setLastActivity(Date.now());
  };

  // Handle cancel from customer selection
  const handleCancelSelection = () => {
    resetToSlideshow();
  };

  // Handle "None of these" from customer selection
  const handleNoneOfThese = () => {
    handleNewCustomer();
  };

  // Handle cancel from quick reorder flow
  const handleCancelQuickReorder = () => {
    setFlowMode('customer-selection');
    setSelectedCustomer(null);
    setLastActivity(Date.now());
  };

  // Handle "Start Fresh" from quick reorder - go to full wizard with customer info
  const handleStartFresh = (customerInfo: Partial<DeerT>) => {
    setPrefilledData(customerInfo);
    setFlowMode('new-customer');
    setLastActivity(Date.now());
  };

  // Render based on flow mode
  if (flowMode === 'slideshow') {
    return (
      <PhoneLookupSlideshow
        slides={slideshowSlides}
        onNewCustomer={handleNewCustomer}
        onCustomersFound={handleCustomersFound}
      />
    );
  }

  if (flowMode === 'customer-selection') {
    return (
      <CustomerSelectionScreen
        customers={matchedCustomers}
        onSelect={handleSelectCustomer}
        onCancel={handleCancelSelection}
        onNewCustomer={handleNoneOfThese}
      />
    );
  }

  if (flowMode === 'quick-reorder' && selectedCustomer) {
    return (
      <QuickReorderFlow
        customer={selectedCustomer}
        onCancel={handleCancelQuickReorder}
        onStartFresh={handleStartFresh}
      />
    );
  }

  // Default: new-customer mode - show the full form wizard
  return (
    <div className='container flex max-w-[900px] flex-col justify-center py-12 sm:px-6 md:min-h-[800px] lg:px-8'>
      <div className='bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10'>
        <CheckInFormRefactored
          onFormDataChange={handleFormDataChange}
          initialData={prefilledData || undefined}
        />
      </div>
    </div>
  );
}

export const getServerSideProps = getSecureServerSideProps(() => ({ props: {} }));
