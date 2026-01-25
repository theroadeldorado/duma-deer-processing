import Button from '@/components/Button';
import { CustomerSummary } from '@/lib/types';
import { formatPhoneForDisplay } from '@/lib/phoneUtils';

interface CustomerCardProps {
  customer: CustomerSummary;
  onSelect: (customer: CustomerSummary) => void;
}

export default function CustomerCard({ customer, onSelect }: CustomerCardProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className='flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-primary-blue hover:shadow-md'>
      <div className='mb-4 flex-1'>
        <h3 className='mb-2 text-xl font-semibold text-gray-900'>{customer.name}</h3>

        <div className='space-y-1 text-sm text-gray-600'>
          <p className='flex items-center gap-2'>
            <svg className='h-4 w-4 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
              />
            </svg>
            {formatPhoneForDisplay(customer.phone)}
          </p>

          <p className='flex items-start gap-2'>
            <svg
              className='mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
              />
            </svg>
            <span>
              {customer.address}
              <br />
              {customer.city}, {customer.state} {customer.zip}
            </span>
          </p>

          {customer.lastOrderDate && (
            <p className='flex items-center gap-2 pt-2 text-gray-500'>
              <svg className='h-4 w-4 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                />
              </svg>
              Last order: {formatDate(customer.lastOrderDate)}
            </p>
          )}
        </div>
      </div>

      <Button onClick={() => onSelect(customer)} className='mt-4 w-full' size='lg'>
        This is Me
      </Button>
    </div>
  );
}
