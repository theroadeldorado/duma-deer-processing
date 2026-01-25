import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useRouter } from 'next/router';
import useMutation from '@/hooks/useMutation';
import { DeerT, CustomerSummary, EditableSection } from '@/lib/types';
import {
  calculateTotalPrice,
  calculateCapeHideTotal,
  buildHistoricalItemPrices,
  buildCompletePricingSnapshot,
} from '@/lib/priceCalculations';
import { extractCustomerInfo } from '@/lib/reorderUtils';
import { normalizePhone } from '@/lib/phoneUtils';
import Button from '@/components/Button';
import DeerInfo from '@/components/checkin-steps/DeerInfo';
import PreviousOrderSummary from './PreviousOrderSummary';
import SectionEditor from './SectionEditor';
import OrderSelectionScreen from './OrderSelectionScreen';

type FlowStep = 'loading' | 'order-selection' | 'deer-info' | 'summary' | 'editing';

interface OrderOption {
  orderId: string;
  orderDate: string;
  preferences: Partial<DeerT>;
}

interface QuickReorderFlowProps {
  customer: CustomerSummary;
  onCancel: () => void;
  onStartFresh: (customerInfo: Partial<DeerT>) => void;
}

export default function QuickReorderFlow({
  customer,
  onCancel,
  onStartFresh,
}: QuickReorderFlowProps) {
  const router = useRouter();
  const [flowStep, setFlowStep] = useState<FlowStep>('loading');
  const [editingSection, setEditingSection] = useState<EditableSection | null>(null);
  const [uniqueOrders, setUniqueOrders] = useState<OrderOption[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Initialize form with customer info
  const form = useForm<DeerT>({
    defaultValues: {
      // Customer info from lookup
      name: customer.name,
      phone: customer.phone,
      fullAddress: customer.fullAddress,
      address: customer.address,
      city: customer.city,
      state: customer.state,
      zip: customer.zip ? parseInt(customer.zip) : undefined,
      communication: customer.communication || 'Text',
    },
    mode: 'onChange',
  });

  // Mutation for submitting the order
  const mutation = useMutation({
    url: '/api/auth/deer',
    method: 'POST',
    onSuccess: async () => {
      router.push('/success');
    },
  });

  // Fetch all unique orders for this customer on mount
  useEffect(() => {
    const fetchCustomerOrders = async () => {
      try {
        // Build customer ID from phone and name
        const normalizedOrderPhone = normalizePhone(customer.phone || '');
        const customerName = customer.name.toLowerCase().trim().replace(/\s+/g, ' ');
        const customerId = `${normalizedOrderPhone}-${customerName}`;

        const response = await fetch(`/api/customer-orders/${encodeURIComponent(customerId)}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch orders');
        }

        const orders = data.orders || [];
        setUniqueOrders(orders);

        if (orders.length === 0) {
          // No previous orders, go to deer info with empty preferences
          setFlowStep('deer-info');
        } else if (orders.length === 1) {
          // Only one unique order, use those preferences
          loadPreferences(orders[0].preferences);
          setFlowStep('deer-info');
        } else {
          // Multiple unique orders, show selection screen
          setFlowStep('order-selection');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load orders');
        // Fall back to using the lastOrderId
        fetchSingleOrder();
      }
    };

    const fetchSingleOrder = async () => {
      try {
        const response = await fetch(`/api/previous-order/${customer.lastOrderId}`);
        const data = await response.json();

        if (response.ok && data.preferences) {
          loadPreferences(data.preferences);
        }
        setFlowStep('deer-info');
      } catch {
        setFlowStep('deer-info');
      }
    };

    fetchCustomerOrders();
  }, [customer]);

  // Load preferences into the form
  const loadPreferences = (preferences: Partial<DeerT>) => {
    Object.entries(preferences).forEach(([key, value]) => {
      form.setValue(key as any, value as any);
    });
  };

  // Handle order selection
  const handleSelectOrder = (order: OrderOption) => {
    loadPreferences(order.preferences);
    setFlowStep('deer-info');
  };

  // Handle deer info submission
  const handleDeerInfoNext = async () => {
    // Validate deer info fields
    const isValid = await form.trigger(['tagNumber', 'stateHarvestedIn', 'buckOrDoe', 'dateHarvested', 'dateFound']);
    if (isValid) {
      setFlowStep('summary');
    }
  };

  // Handle section editing
  const handleEditSection = (section: EditableSection) => {
    setEditingSection(section);
    setFlowStep('editing');
  };

  const handleEditDone = () => {
    setEditingSection(null);
    setFlowStep('summary');
  };

  const handleEditCancel = () => {
    setEditingSection(null);
    setFlowStep('summary');
  };

  // Handle "Same as Last Time" submission
  const handleSameAsLastTime = async () => {
    const formData = form.getValues();
    const totalPrice = calculateTotalPrice(formData);
    const capeHideTotal = calculateCapeHideTotal(formData);

    // Split name into first/last if not already set
    let firstName = formData.firstName;
    let lastName = formData.lastName;
    if (!firstName && formData.name) {
      const nameParts = formData.name.split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    }

    const data = {
      ...formData,
      _id: formData.tagNumber + Date.now(),
      hasPrinted: 'false',
      name: formData.name || `${firstName} ${lastName}`,
      firstName,
      lastName,
      totalPrice: totalPrice,
      capeHideTotal: capeHideTotal,
      historicalItemPrices: buildHistoricalItemPrices(formData),
      pricingSnapshot: buildCompletePricingSnapshot(),
    };

    mutation.mutate(data as any);
  };

  // Handle "Start Fresh" - go to full wizard with customer info pre-filled
  const handleStartFresh = () => {
    const customerInfo = extractCustomerInfo(form.getValues());
    onStartFresh(customerInfo);
  };

  // Handle back from order selection
  const handleBackFromOrderSelection = () => {
    onCancel();
  };

  // Render loading state
  if (flowStep === 'loading') {
    return (
      <div className='fixed inset-0 flex items-center justify-center bg-gradient-to-b from-tan-1 to-white'>
        <div className='text-center'>
          <svg className='mx-auto h-12 w-12 animate-spin text-primary-blue' viewBox='0 0 24 24'>
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
          <p className='mt-4 text-lg text-gray-600'>Loading your orders...</p>
        </div>
      </div>
    );
  }

  // Render order selection step
  if (flowStep === 'order-selection') {
    return (
      <OrderSelectionScreen
        customerName={customer.name.split(' ')[0]}
        orders={uniqueOrders}
        onSelectOrder={handleSelectOrder}
        onBack={handleBackFromOrderSelection}
      />
    );
  }

  // Render deer info step
  if (flowStep === 'deer-info') {
    return (
      <div className='fixed inset-0 overflow-auto bg-gradient-to-b from-tan-1 to-white'>
        <div className='container mx-auto max-w-2xl px-4 py-8'>
          {/* Header */}
          <div className='mb-6 flex items-center justify-between'>
            <button
              type='button'
              onClick={uniqueOrders.length > 1 ? () => setFlowStep('order-selection') : onCancel}
              className='flex items-center gap-2 text-gray-600 hover:text-gray-900'
            >
              <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 19l-7-7 7-7'
                />
              </svg>
              Back
            </button>

            <h2 className='text-xl font-bold text-gray-900'>New Deer Information</h2>

            <div className='w-20' /> {/* Spacer for centering */}
          </div>

          {/* Welcome message */}
          <div className='mb-6 text-center'>
            <h1 className='mb-2 text-2xl font-bold text-gray-900'>Welcome back, {customer.name.split(' ')[0]}!</h1>
            <p className='text-gray-600'>
              Let&apos;s get the details for this deer. Your preferences are saved.
            </p>
          </div>

          {error && (
            <div className='mb-6 rounded-md border border-amber-200 bg-amber-50 p-4'>
              <div className='flex'>
                <svg className='h-5 w-5 text-amber-400' viewBox='0 0 20 20' fill='currentColor'>
                  <path
                    fillRule='evenodd'
                    d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
                <p className='ml-3 text-sm text-amber-700'>
                  {error} You can still continue with a new order.
                </p>
              </div>
            </div>
          )}

          {/* Deer Info Form */}
          <div className='rounded-xl bg-white p-6 shadow-sm'>
            <FormProvider {...form}>
              <DeerInfo form={form} onNext={handleDeerInfoNext} />
            </FormProvider>
          </div>

          {/* Navigation */}
          <div className='mt-6 flex justify-between'>
            <Button onClick={onCancel} color='gray' size='lg'>
              Cancel
            </Button>
            <Button onClick={handleDeerInfoNext} size='lg'>
              Continue to Summary
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render summary step
  if (flowStep === 'summary') {
    return (
      <div className='fixed inset-0 overflow-auto bg-gradient-to-b from-tan-1 to-white'>
        {/* Back button */}
        <div className='container mx-auto max-w-2xl px-4 pt-4'>
          <button
            type='button'
            onClick={() => setFlowStep('deer-info')}
            className='flex items-center gap-2 text-gray-600 hover:text-gray-900'
          >
            <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
            Back to Deer Info
          </button>
        </div>

        <PreviousOrderSummary
          formData={form.getValues()}
          customerName={customer.name.split(' ')[0]}
          onSameAsLastTime={handleSameAsLastTime}
          onStartFresh={handleStartFresh}
          onEditSection={handleEditSection}
          isSubmitting={mutation.isLoading}
        />
      </div>
    );
  }

  // Render editing step
  if (flowStep === 'editing' && editingSection) {
    return (
      <SectionEditor
        section={editingSection}
        form={form}
        onDone={handleEditDone}
        onCancel={handleEditCancel}
      />
    );
  }

  // Fallback
  return null;
}
