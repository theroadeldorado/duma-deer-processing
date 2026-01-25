import Button from '@/components/Button';
import { CustomerSummary } from '@/lib/types';
import CustomerCard from './CustomerCard';

interface CustomerSelectionScreenProps {
  customers: CustomerSummary[];
  onSelect: (customer: CustomerSummary) => void;
  onCancel: () => void;
  onNewCustomer: () => void;
}

export default function CustomerSelectionScreen({
  customers,
  onSelect,
  onCancel,
  onNewCustomer,
}: CustomerSelectionScreenProps) {
  return (
    <div className='fixed inset-0 overflow-auto bg-gradient-to-b from-tan-1 to-white'>
      <div className='container mx-auto max-w-4xl px-4 py-8'>
        {/* Header */}
        <div className='mb-8 text-center'>
          <h1 className='mb-2 text-3xl font-bold text-gray-900'>Welcome Back!</h1>
          <p className='text-lg text-gray-600'>
            We found {customers.length} {customers.length === 1 ? 'account' : 'accounts'} with that
            phone number. Select yours to continue.
          </p>
        </div>

        {/* Customer Cards Grid */}
        <div className='mb-8 grid gap-4 sm:grid-cols-2'>
          {customers.map((customer) => (
            <CustomerCard key={customer.lastOrderId} customer={customer} onSelect={onSelect} />
          ))}
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col items-center gap-4'>
          <div className='relative w-full max-w-xs'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300' />
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='bg-gradient-to-b from-tan-1 to-white px-4 text-gray-500'>
                Not your account?
              </span>
            </div>
          </div>

          <div className='flex flex-wrap justify-center gap-3'>
            <Button onClick={onNewCustomer} color='default' size='lg'>
              None of These - New Customer
            </Button>
            <Button onClick={onCancel} color='gray' size='lg'>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
