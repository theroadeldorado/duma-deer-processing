import Button from '@/components/Button';
import { DeerT } from '@/lib/types';
import OrderPreferenceCard from './OrderPreferenceCard';

interface OrderOption {
  orderId: string;
  orderDate: string;
  preferences: Partial<DeerT>;
}

interface OrderSelectionScreenProps {
  customerName: string;
  orders: OrderOption[];
  onSelectOrder: (order: OrderOption) => void;
  onBack: () => void;
}

export default function OrderSelectionScreen({
  customerName,
  orders,
  onSelectOrder,
  onBack,
}: OrderSelectionScreenProps) {
  return (
    <div className='fixed inset-0 overflow-auto bg-gradient-to-b from-tan-1 to-white'>
      <div className='container mx-auto max-w-4xl px-4 py-8'>
        {/* Back button */}
        <button
          type='button'
          onClick={onBack}
          className='mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900'
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

        {/* Header */}
        <div className='mb-8 text-center'>
          <h1 className='mb-2 text-3xl font-bold text-gray-900'>
            Welcome back, {customerName}!
          </h1>
          <p className='text-lg text-gray-600'>
            You&apos;ve had {orders.length} different orders. Which preferences would you like to use?
          </p>
        </div>

        {/* Order Cards Grid */}
        <div className='mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {orders.map((order) => (
            <OrderPreferenceCard
              key={order.orderId}
              order={order.preferences}
              orderDate={order.orderDate}
              onSelect={() => onSelectOrder(order)}
            />
          ))}
        </div>

        {/* Help text */}
        <p className='text-center text-sm text-gray-500'>
          Don&apos;t worry - you can edit any options after selecting.
        </p>
      </div>
    </div>
  );
}
