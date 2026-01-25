import Button from '@/components/Button';
import { DeerT } from '@/lib/types';

interface OrderPreferenceCardProps {
  order: Partial<DeerT>;
  orderDate: string;
  onSelect: () => void;
}

/**
 * Displays a summary of an order's processing preferences
 */
export default function OrderPreferenceCard({
  order,
  orderDate,
  onSelect,
}: OrderPreferenceCardProps) {
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

  // Get specialty meats that were ordered with amounts
  const specialtyMeats: string[] = [];
  const specialtyMeatLabels: Record<string, string> = {
    trailBolognaRegular: 'Trail Bologna',
    trailBolognaCheddarCheese: 'Trail Bologna (Cheddar)',
    trailBolognaHotPepperJackCheese: 'Trail Bologna (Hot)',
    smokedJalapenoCheddarBrats: 'Jalapeño Cheddar Brats',
    garlicRingBologna: 'Garlic Ring Bologna',
    summerSausageMild: 'Summer Sausage (Mild)',
    summerSausageHot: 'Summer Sausage (Hot)',
    smokedKielbasaSausage: 'Kielbasa',
    italianSausageLinksMild: 'Italian Sausage (Mild)',
    italianSausageLinksHot: 'Italian Sausage (Hot)',
    countryBreakfastSausage: 'Breakfast Sausage',
    babyLinksCountry: 'Breakfast Links (Country)',
    babyLinksMaple: 'Breakfast Links (Maple)',
    snackSticksRegular: 'Snack Sticks',
    snackSticksCheddarCheese: 'Snack Sticks (Cheddar)',
    snackSticksHotPepperJackCheese: 'Snack Sticks (Hot)',
    snackSticksHotHotPepperJackCheese: 'Snack Sticks (Extra Hot)',
    snackSticksHoneyBBQ: 'Snack Sticks (BBQ)',
    hotDogsRegular: 'Hot Dogs',
    hotDogsCheddarCheese: 'Hot Dogs (Cheddar)',
    hotDogsHotPepperJackCheese: 'Hot Dogs (Hot)',
    jerkyRestructuredHot: 'Jerky (Hot)',
    jerkyRestructuredMild: 'Jerky (Mild)',
    jerkyRestructuredTeriyaki: 'Jerky (Teriyaki)',
  };

  for (const [key, label] of Object.entries(specialtyMeatLabels)) {
    const value = order[key];
    if (value && value !== 'false' && value !== '0' && value !== 0) {
      // Convert quantity to pounds (each unit is 5lbs)
      const quantity = typeof value === 'number' ? value : parseInt(value as string, 10) || 1;
      const pounds = quantity * 5;
      specialtyMeats.push(`${pounds}lbs ${label}`);
    }
  }

  // Get cape/hide options
  const mountingOptions: string[] = [];
  if (order.cape && order.cape !== '') {
    if (order.cape === 'Cape for shoulder mount') mountingOptions.push('Keep Cape');
    else if (order.cape === 'Shoulder mount') mountingOptions.push('Shoulder Mount');
  }
  if (order.hide && order.hide !== '') {
    if (order.hide === 'Save Hide') mountingOptions.push('Save Hide');
    else if (order.hide === 'Tanned Hair on') mountingOptions.push('Tanned Hide');
  }
  if (order.euroMount && order.euroMount !== '' && order.euroMount !== 'false' && order.euroMount !== 'none') {
    if (order.euroMount === 'Keep head') mountingOptions.push('Keep Head');
    else mountingOptions.push('Euro Mount');
  }

  return (
    <div className='flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-primary-blue hover:shadow-md'>
      <div className='mb-4 flex-1'>
        {/* Date */}
        <div className='mb-3 flex items-center gap-2 text-sm text-gray-500'>
          <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
            />
          </svg>
          {formatDate(orderDate)}
        </div>

        {/* Processing Type */}
        <div className='mb-3'>
          <span className='text-sm font-medium text-gray-900'>
            {order.skinnedOrBoneless || 'Standard Processing'}
          </span>
        </div>

        {/* Cutting Summary */}
        <div className='mb-3 space-y-1 text-sm text-gray-600'>
          {order.backStrapsPreference && (
            <p>Back Straps: {order.backStrapsPreference}</p>
          )}
          {order.hindLegPreference1 && order.hindLegPreference1 !== 'Grind' && (
            <p>Hind Legs: {order.hindLegPreference1}</p>
          )}
          {order.roast && order.roast !== 'Grind' && (
            <p>Roasts: {order.roast}</p>
          )}
          {order.groundVenison && order.groundVenison !== 'Plain' && (
            <p>Ground: {order.groundVenison}</p>
          )}
        </div>

        {/* Mounting Options */}
        {mountingOptions.length > 0 && (
          <div className='mb-3'>
            <p className='text-sm text-gray-600'>
              <span className='font-medium'>Mounting:</span> {mountingOptions.join(', ')}
            </p>
          </div>
        )}

        {/* Specialty Meats */}
        {specialtyMeats.length > 0 && (
          <div className='mb-2'>
            <p className='mb-1 text-sm font-medium text-gray-700'>Specialty Meats:</p>
            <div className='flex flex-wrap gap-1'>
              {specialtyMeats.slice(0, 4).map((meat) => (
                <span
                  key={meat}
                  className='rounded-full bg-tan-1 px-2 py-0.5 text-xs text-gray-700'
                >
                  {meat}
                </span>
              ))}
              {specialtyMeats.length > 4 && (
                <span className='rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500'>
                  +{specialtyMeats.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {specialtyMeats.length === 0 && (
          <p className='text-sm italic text-gray-400'>No specialty meats</p>
        )}
      </div>

      <Button onClick={onSelect} className='mt-2 w-full' size='md'>
        Use These Preferences
      </Button>
    </div>
  );
}
