import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';

import AdminPage from '@/components/layouts/Admin';
import Button from 'components/Button';
import Input from 'components/Input';
import Form from 'components/Form';
import RadioButtonGroup from '@/components/RadioButtonGroup';
import Textarea from '@/components/Textarea';
import Select from '@/components/Select';
import SpecialtyMeatsAdminSection from '@/components/admin/SpecialtyMeatsAdminSection';

import { DeerT, DeerInputT } from 'lib/types';
import {
  calculateTotalPrice,
  calculateCapeHideTotal,
  getCapeHideTotalForDisplay,
  buildHistoricalItemPrices,
  buildCompletePricingSnapshot,
} from 'lib/priceCalculations';
import { DeerZ } from '@/lib/zod';
import useMutation from 'hooks/useMutation';
import getSecureServerSideProps from '@/lib/getSecureServerSideProps';
import { getDeer } from '@/lib/mongo';
import { ParsedUrlQuery } from 'querystring';
import {
  getSkinnedOrBonelessOptions,
  getCapeDropdownOptions,
  getHideDropdownOptions,
  getEuroMountDropdownOptions,
  getGroundVenisonOptions,
  getHindLegPreferenceOptions,
  getTenderizedCubedSteaksPrice,
  formatPrice,
} from '@/lib/priceUtils';

// Define your props type
type Props = {
  data?: DeerT;
  isNew?: boolean;
};

export default function EditDeer({ data, isNew }: Props) {
  const router = useRouter();

  // Original price from when order was created (stored in database)
  const originalTotalPrice = Number(data?.totalPrice) || 0;
  const originalCapeHideTotal = data?.capeHideTotal ?? 0;

  // Current calculated price using today's pricing
  const [currentCalculatedPrice, setCurrentCalculatedPrice] = useState<number>(0);
  const [currentCapeHidePrice, setCurrentCapeHidePrice] = useState<number>(0);

  // Pricing mode: 'original' (default for existing), 'current', or 'manual'
  const [pricingMode, setPricingMode] = useState<'original' | 'current' | 'manual'>(isNew ? 'current' : 'original');
  const [manualPrice, setManualPrice] = useState<number>(originalTotalPrice + originalCapeHideTotal);

  // The actual price that will be saved
  const getFinalPrice = () => {
    if (pricingMode === 'manual') return manualPrice;
    if (pricingMode === 'current') return currentCalculatedPrice + currentCapeHidePrice;
    // 'original' mode - for new orders, use calculated; for existing, use stored
    return isNew ? currentCalculatedPrice + currentCapeHidePrice : originalTotalPrice + originalCapeHideTotal;
  };

  const form = useForm<DeerInputT>({
    defaultValues: data,
    resolver: zodResolver(DeerZ),
  });

  // Parse existing data to handle backward compatibility with combined values
  // e.g., "Whole Muscle Jerky - Hot" -> hindLegPreference1: "Whole Muscle Jerky", hindLegJerky1Flavor: "Hillbilly Hot"
  useEffect(() => {
    if (!data) return;

    // Helper function to parse combined jerky values
    const parseJerkyValue = (value: string | undefined): { preference: string; flavor: string } => {
      if (!value) return { preference: 'Grind', flavor: '' };

      // Check if it's a combined value like "Whole Muscle Jerky - Hot" or "Whole Muscle Jerk - Hot"
      if (value.includes('Whole Muscle Jerk')) {
        const parts = value.split(' - ');
        if (parts.length === 2) {
          const flavorPart = parts[1].trim();
          // Map flavor names to match products config
          let flavor = '';
          if (flavorPart === 'Mild' || flavorPart === 'Appalachian Mild') {
            flavor = 'Appalachian Mild';
          } else if (flavorPart === 'Hot' || flavorPart === 'Hillbilly Hot') {
            flavor = 'Hillbilly Hot';
          } else if (flavorPart === 'Teriyaki') {
            flavor = 'Teriyaki';
          }
          return { preference: 'Whole Muscle Jerky', flavor };
        }
      }

      // If it's already the correct format, return as-is
      return { preference: value, flavor: '' };
    };

    // Parse hind leg 1
    const leg1Parsed = parseJerkyValue(data.hindLegPreference1);
    if (leg1Parsed.preference !== data.hindLegPreference1 || leg1Parsed.flavor) {
      form.setValue('hindLegPreference1', leg1Parsed.preference);
      if (leg1Parsed.flavor) {
        form.setValue('hindLegJerky1Flavor', leg1Parsed.flavor);
      }
    }

    // Parse hind leg 2
    const leg2Parsed = parseJerkyValue(data.hindLegPreference2);
    if (leg2Parsed.preference !== data.hindLegPreference2 || leg2Parsed.flavor) {
      form.setValue('hindLegPreference2', leg2Parsed.preference);
      if (leg2Parsed.flavor) {
        form.setValue('hindLegJerky2Flavor', leg2Parsed.flavor);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // State for balance calculation
  const [balance, setBalance] = useState<number>(0);

  // Check if prices have changed (for showing the pricing comparison UI)
  const pricesHaveChanged = !isNew && Math.abs((currentCalculatedPrice + currentCapeHidePrice) - (originalTotalPrice + originalCapeHideTotal)) > 0.01;

  // Update calculated price whenever form values change
  useEffect(() => {
    const subscription = form.watch((formData) => {
      const processingPrice = calculateTotalPrice(formData as DeerInputT);
      const capeHidePrice = calculateCapeHideTotal(formData as DeerInputT);
      setCurrentCalculatedPrice(processingPrice);
      setCurrentCapeHidePrice(capeHidePrice);

      // Calculate balance using the appropriate price based on pricing mode
      const totalDeposits = Number(formData.deposit || 0) + Number(formData.capeHideDeposit || 0) + Number(formData.amountPaid || 0);
      const priceToUse = pricingMode === 'manual' ? manualPrice :
        pricingMode === 'current' ? processingPrice + capeHidePrice :
        isNew ? processingPrice + capeHidePrice : originalTotalPrice + originalCapeHideTotal;
      setBalance(priceToUse - totalDeposits);
    });

    return () => subscription.unsubscribe();
  }, [form, pricingMode, manualPrice, isNew, originalTotalPrice, originalCapeHideTotal]);

  const mutation = useMutation({
    url: isNew ? '/api/deers/add' : `/api/deers/${data?._id}/update`,
    method: isNew ? 'POST' : 'PUT',
    successMessage: isNew ? 'Deer added successfully' : 'Deer updated successfully',
    onSuccess: (response) => {
      router.push('/admin/deers');
    },
    onError: (error) => {
      console.error('Edit Form - Mutation error:', error);
    },
  });

  const del = useMutation({
    url: `/api/deers/${encodeURIComponent(data?._id || '')}/delete`,
    method: 'DELETE',
    successMessage: 'Deer deleted successfully',
    onSuccess: () => {
      router.push('/admin/deers');
    },
    onError: (error) => {
      console.error('Delete error:', error);
    },
  });

  const deleteDeer = async () => {
    if (!data?._id) {
      console.error('No deer ID available for deletion');
      return;
    }
    if (!confirm('Are you sure you want to permanently delete this deer record?')) return;
    del.mutate(null);
  };

  const handleSubmit = async (formData: DeerInputT) => {
    // Parse numeric fields to ensure they're saved as numbers
    const capeHideDepositValue = formData.capeHideDeposit && formData.capeHideDeposit !== '' ? Number(formData.capeHideDeposit) : undefined;
    const depositValue = formData.deposit && formData.deposit !== '' ? Number(formData.deposit) : undefined;
    const amountPaidValue = formData.amountPaid && formData.amountPaid !== '' ? Number(formData.amountPaid) : undefined;
    const approxNeckMeasurementValue =
      formData.approxNeckMeasurement && formData.approxNeckMeasurement !== '' ? Number(formData.approxNeckMeasurement) : undefined;

    // Determine final pricing based on pricing mode
    let finalTotalPrice: number;
    let finalCapeHideTotal: number;
    let finalHistoricalItemPrices: Record<string, number> | undefined;
    let finalPricingSnapshot: Record<string, any> | undefined;

    if (isNew) {
      // New orders always use current pricing and create new snapshots
      finalTotalPrice = pricingMode === 'manual' ? manualPrice : currentCalculatedPrice + currentCapeHidePrice;
      finalCapeHideTotal = currentCapeHidePrice;
      finalHistoricalItemPrices = buildHistoricalItemPrices(formData);
      finalPricingSnapshot = buildCompletePricingSnapshot();
    } else {
      // Existing orders - preserve or update based on pricing mode
      switch (pricingMode) {
        case 'original':
          // Keep original pricing - preserve all historical data
          finalTotalPrice = originalTotalPrice + originalCapeHideTotal;
          finalCapeHideTotal = originalCapeHideTotal;
          finalHistoricalItemPrices = data?.historicalItemPrices;
          finalPricingSnapshot = data?.pricingSnapshot;
          break;
        case 'current':
          // Update to current pricing - rebuild historical data
          finalTotalPrice = currentCalculatedPrice + currentCapeHidePrice;
          finalCapeHideTotal = currentCapeHidePrice;
          finalHistoricalItemPrices = buildHistoricalItemPrices(formData);
          finalPricingSnapshot = buildCompletePricingSnapshot();
          break;
        case 'manual':
          // Manual override - keep original historical data but use manual total
          finalTotalPrice = manualPrice;
          finalCapeHideTotal = data?.capeHideTotal ?? currentCapeHidePrice;
          finalHistoricalItemPrices = data?.historicalItemPrices;
          finalPricingSnapshot = data?.pricingSnapshot;
          break;
      }
    }

    // Make sure we're explicitly including all cape/hide fields
    const updatedData = {
      ...formData,
      totalPrice: finalTotalPrice,
      // Numeric fields
      capeHideDeposit: capeHideDepositValue,
      capeHideTotal: finalCapeHideTotal,
      deposit: depositValue,
      amountPaid: amountPaidValue,
      approxNeckMeasurement: approxNeckMeasurementValue,
      // Historical pricing - preserved or rebuilt based on pricing mode
      historicalItemPrices: finalHistoricalItemPrices,
      pricingSnapshot: finalPricingSnapshot,
      // String fields - explicitly included to ensure they're saved
      hideCondition: formData.hideCondition,
      facialFeatures: formData.facialFeatures,
      rackId: formData.rackId,
      capeId: formData.capeId,
      capeMorseCode: formData.capeMorseCode,
      formOrdered: formData.formOrdered,
      shoulderMountHeadPosition: formData.shoulderMountHeadPosition,
      shoulderMountEarPosition: formData.shoulderMountEarPosition,
      shoulderMountSpecialInstructions: formData.shoulderMountSpecialInstructions,
    };

    mutation.mutate(updatedData);
  };

  return (
    <AdminPage title={isNew ? 'Add Deer' : 'Edit Deer'}>
      <Form form={form} onSubmit={handleSubmit} className='mx-auto max-w-6xl bg-white shadow sm:rounded-lg'>
        <div className='mb-20 flex flex-col gap-12 p-8'>
          <div className='grid grid-cols-4 gap-4'>
            <div className='col-span-4 mb-10 flex items-center justify-start gap-4'>
              <div className='mt-2 h-px w-full grow bg-gray-500'></div>
              <h3 className='shrink-0 text-center text-display-md font-bold'>Customer Information</h3>
              <div className='mt-2 h-px w-full grow bg-gray-500'></div>
            </div>
            <div className='hidden'>
              <Input label='Full Address' type='text' name='fullAddress' />
              <Input label='Full Name' type='text' name='name' />
            </div>

            <Input
              label='First Name'
              type='text'
              name='firstName'
              required
              onChange={(e) => {
                form.setValue('name', e.target.value + ' ' + form.watch('lastName'));
              }}
            />
            <Input
              label='Last Name'
              type='text'
              name='lastName'
              required
              onChange={(e) => {
                form.setValue('name', form.watch('firstName') + ' ' + e.target.value);
              }}
            />

            <Input label='Confirmation Number' type='text' name='tagNumber' required />
            <Select
              name='stateHarvestedIn'
              label='State Harvested In'
              placeholder='Select State'
              defaultValue='OH'
              required
              options={[
                { value: 'OH', label: 'Ohio' },
                { value: 'WV', label: 'West Virginia' },
                { value: 'PA', label: 'Pennsylvania' },
                { value: 'Other', label: 'Other' },
              ]}
            ></Select>

            <Select
              name='buckOrDoe'
              label='Deer Type'
              placeholder='Select Type'
              required
              options={[
                { value: 'Doe', label: 'Doe' },
                { value: 'Buck', label: 'Buck' },
                { value: 'Button Buck', label: 'Button Buck' },
                { value: 'Boneless', label: 'Boneless' },
                { value: 'Other', label: 'Other' },
              ]}
            ></Select>

            <Input
              label='Date Harvested (Shot)'
              type='date'
              name='dateHarvested'
              placeholder='Select date deer was harvested'
              max={new Date().toISOString().split('T')[0]} // Can't be in the future
              required
            />

            <Input
              label='Date Found'
              type='date'
              name='dateFound'
              placeholder='Select date deer was found'
              min={form.watch('dateHarvested') || undefined}
              required
            />

            <Input
              label='Address'
              type='text'
              name='address'
              required
              onChange={(e) => {
                form.setValue('fullAddress', e.target.value + '\n ' + form.watch('city') + ', ' + form.watch('state') + ' ' + form.watch('zip'));
              }}
            />

            <Input
              label='City'
              type='text'
              name='city'
              required
              onChange={(e) => {
                form.setValue('fullAddress', form.watch('address') + '\n ' + e.target.value + ', ' + form.watch('state') + ' ' + form.watch('zip'));
              }}
            />

            <Input
              label='State'
              type='text'
              name='state'
              defaultValue='OH'
              required
              onChange={(e) => {
                form.setValue('fullAddress', form.watch('address') + '\n ' + form.watch('city') + ', ' + e.target.value + ' ' + form.watch('zip'));
              }}
            />

            <Input
              label='Zip'
              type='number'
              maxLength={5}
              name='zip'
              required
              onChange={(e) => {
                form.setValue('fullAddress', form.watch('address') + '\n ' + form.watch('city') + ', ' + form.watch('state') + ' ' + e.target.value);
              }}
            />

            <Input label='Phone' type='text' name='phone' required />
            <RadioButtonGroup
              name='communication'
              required
              options={[
                { value: 'Call', label: 'Call' },
                { value: 'Text', label: 'Text' },
              ]}
              defaultCheckedValue='Text'
              wrapperLabel='Communication'
            />
          </div>
          <div className='flex flex-col'>
            <div className='mb-10 flex items-center justify-start gap-4'>
              <div className='mt-2 h-px w-full grow bg-gray-500'></div>
              <h3 className='shrink-0 text-center text-display-md font-bold'>Cutting Instructions</h3>
              <div className='mt-2 h-px w-full grow bg-gray-500'></div>
            </div>

            {/* Skinned or Boneless */}
            <div className='mb-10 grid grid-cols-2 gap-4 border-b border-dashed border-gray-300 pb-10'>
              <div>
                <p className='mb-1 font-bold'>Skinned or Boneless</p>
                <Select
                  className='w-full'
                  name='skinnedOrBoneless'
                  required
                  options={getSkinnedOrBonelessOptions()}
                ></Select>
              </div>
              <Textarea rows={3} name={`skinnedBonelessNotes`} label='Special Instructions' />
            </div>

            {/* Cape, Hide and Euro Mount */}
            <div className='mb-10 grid grid-cols-2 gap-4 border-b border-dashed border-gray-300 pb-10'>
              <div className='flex flex-col gap-2'>
                <div>
                  <p className='mb-1 font-bold'>Cape for shoulder mount</p>
                  <Select
                    className='w-full'
                    name='cape'
                    required
                    options={getCapeDropdownOptions()}
                  ></Select>
                </div>
                <div>
                  <p className='mb-1 font-bold'>Hide Options</p>
                  <Select
                    className='w-full'
                    name='hide'
                    required
                    options={getHideDropdownOptions()}
                  ></Select>
                </div>
                <p className='font-bold'>Euro Mount Options</p>
                <Select
                  className='w-full'
                  name='euroMount'
                  options={getEuroMountDropdownOptions()}
                ></Select>
              </div>
              <div className='flex flex-col gap-4'>
                <Textarea rows={3} name={`capeHideNotes`} label='Special Instructions' />

                {/* Shoulder Mount Pose Details - Always present but hidden when not needed */}
                <div
                  className={(() => {
                    const capeValue = form.watch('cape');
                    return capeValue === 'Shoulder mount' ? 'border-green-200 bg-green-50 space-y-4 rounded-md border p-4' : 'hidden';
                  })()}
                >
                  <h4 className='text-green-800 text-lg font-medium'>Shoulder Mount Pose Details</h4>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='mb-1 block text-sm font-medium text-gray-700'>Head position - deer faces from the wall</label>
                      <Select
                        className='w-full'
                        name='shoulderMountHeadPosition'
                        options={[
                          { value: '', label: 'Select Position' },
                          { value: 'Upright Left', label: 'Upright Left' },
                          { value: 'Upright Right', label: 'Upright Right' },
                          { value: 'Semi Upright Left', label: 'Semi Upright Left' },
                          { value: 'Semi Upright Right', label: 'Semi Upright Right' },
                          { value: 'Semi Sneak Left', label: 'Semi Sneak Left' },
                          { value: 'Semi Sneak Right', label: 'Semi Sneak Right' },
                        ]}
                      />
                    </div>

                    <div>
                      <label className='mb-1 block text-sm font-medium text-gray-700'>Ear Position</label>
                      <Select
                        className='w-full'
                        name='shoulderMountEarPosition'
                        options={[
                          { value: '', label: 'Select Position' },
                          { value: 'Forward', label: 'Forward' },
                          { value: 'Back', label: 'Back' },
                          { value: 'Rotated', label: 'Rotated' },
                        ]}
                      />
                    </div>

                    <div>
                      <label className='mb-1 block text-sm font-medium text-gray-700'>Rack ID</label>
                      <Input type='text' className='w-full' name='rackId' placeholder='Rack ID' />
                    </div>

                    <div>
                      <label className='mb-1 block text-sm font-medium text-gray-700'>Cape ID</label>
                      <Input type='text' className='w-full' name='capeId' placeholder='Cape ID' />
                    </div>

                    <div>
                      <label className='mb-1 block text-sm font-medium text-gray-700'>Cape Morse Code #</label>
                      <Input type='text' className='w-full' name='capeMorseCode' placeholder='Cape Morse Code #' />
                    </div>

                    <div>
                      <label className='mb-1 block text-sm font-medium text-gray-700'>Approx Neck Measurement (inches)</label>
                      <Input
                        type='number'
                        step='0.1'
                        min='0'
                        className='w-full'
                        name='approxNeckMeasurement'
                        placeholder='0.0'
                        onChange={(e) => {
                          const numValue = e.target.value && e.target.value !== '' ? Number(e.target.value) : undefined;
                          form.setValue('approxNeckMeasurement', numValue);
                        }}
                      />
                    </div>

                    <div>
                      <label className='mb-1 block text-sm font-medium text-gray-700'>Form Ordered</label>
                      <Input type='text' className='w-full' name='formOrdered' placeholder='Form Ordered' />
                    </div>

                    <div>
                      <label className='mb-1 block text-sm font-medium text-gray-700'>Hide Condition</label>
                      <Textarea name='hideCondition' rows={2} placeholder='Gray marks, tick marks, scars, cut, etc...' />
                    </div>

                    <div>
                      <label className='mb-1 block text-sm font-medium text-gray-700'>Facial Features/Coloring/notches</label>
                      <Textarea name='facialFeatures' rows={2} placeholder='Facial features, coloring, or notches...' />
                    </div>
                  </div>

                  <div className='col-span-2'>
                    <label className='mb-1 block text-sm font-medium text-gray-700'>Special Instructions</label>
                    <Textarea name='shoulderMountSpecialInstructions' rows={3} placeholder='Any special requests or specific pose instructions...' />
                  </div>
                </div>
              </div>
            </div>

            {/* Back Straps */}
            <div className='mb-10 grid grid-cols-2 gap-4 border-b border-dashed border-gray-300 pb-10'>
              <div>
                <p className='mb-1 font-bold'>Back Straps Preference</p>
                <Select
                  className='w-full'
                  name='backStrapsPreference'
                  options={[
                    { value: 'Cut in half', label: 'Cut in half' },
                    { value: 'Sliced', label: 'Sliced' },
                    { value: 'Butterfly', label: 'Butterfly' },
                    { value: 'Whole', label: 'Whole' },
                    { value: 'Grind', label: 'Grind' },
                  ]}
                  defaultValue='Cut in half'
                ></Select>
              </div>
              <Textarea rows={3} name={`backStrapNotes`} label='Special Instructions' />
            </div>

            {/* Hind Legs Preference */}
            <div className='mb-10 grid grid-cols-2 gap-4 border-b border-dashed border-gray-300 pb-10'>
              <div>
                <p className='mb-1 font-bold'>Hind Leg 1 Preference</p>
                <Select
                  className='w-full'
                  name='hindLegPreference1'
                  required
                  options={getHindLegPreferenceOptions()}
                  defaultValue='Grind'
                  onChange={(value: string) => {
                    form.setValue('hindLegPreference1', value);
                    if (value === 'Whole Muscle Jerky') {
                      // Default to Mild when jerky is selected
                      if (!form.getValues('hindLegJerky1Flavor')) {
                        form.setValue('hindLegJerky1Flavor', 'Appalachian Mild');
                      }
                    } else {
                      // Clear jerky flavor when jerky is not selected
                      form.setValue('hindLegJerky1Flavor', '');
                    }
                    // Reset tenderized option if no steaks selected
                    if (value !== 'Steaks' && form.getValues('hindLegPreference2') !== 'Steaks') {
                      form.setValue('tenderizedCubedSteaks', 'false');
                    }
                  }}
                ></Select>
                {form.watch('hindLegPreference1') === 'Whole Muscle Jerky' && (
                  <div className='mt-2'>
                    <p className='mb-1 text-sm font-medium'>Jerky Flavor</p>
                    <Select
                      className='w-full'
                      name='hindLegJerky1Flavor'
                      options={[
                        { value: 'Appalachian Mild', label: 'Appalachian Mild' },
                        { value: 'Hillbilly Hot', label: 'Hillbilly Hot' },
                        { value: 'Teriyaki', label: 'Teriyaki' },
                      ]}
                    ></Select>
                  </div>
                )}
              </div>
              <div>
                <p className='mb-1 font-bold'>Hind Leg 2 Preference</p>
                <Select
                  className='w-full'
                  name='hindLegPreference2'
                  options={getHindLegPreferenceOptions()}
                  defaultValue='Grind'
                  onChange={(value: string) => {
                    form.setValue('hindLegPreference2', value);
                    if (value === 'Whole Muscle Jerky') {
                      // Default to Mild when jerky is selected
                      if (!form.getValues('hindLegJerky2Flavor')) {
                        form.setValue('hindLegJerky2Flavor', 'Appalachian Mild');
                      }
                    } else {
                      // Clear jerky flavor when jerky is not selected
                      form.setValue('hindLegJerky2Flavor', '');
                    }
                    // Reset tenderized option if no steaks selected
                    if (value !== 'Steaks' && form.getValues('hindLegPreference1') !== 'Steaks') {
                      form.setValue('tenderizedCubedSteaks', 'false');
                    }
                  }}
                ></Select>
                {form.watch('hindLegPreference2') === 'Whole Muscle Jerky' && (
                  <div className='mt-2'>
                    <p className='mb-1 text-sm font-medium'>Jerky Flavor</p>
                    <Select
                      className='w-full'
                      name='hindLegJerky2Flavor'
                      options={[
                        { value: 'Appalachian Mild', label: 'Appalachian Mild' },
                        { value: 'Hillbilly Hot', label: 'Hillbilly Hot' },
                        { value: 'Teriyaki', label: 'Teriyaki' },
                      ]}
                    ></Select>
                  </div>
                )}
              </div>

              <div className='col-span-2'>
                {(form.watch('hindLegPreference1') === 'Steaks' || form.watch('hindLegPreference2') === 'Steaks') && (
                  <div className='mb-3'>
                    <div className='flex flex-wrap items-center justify-start gap-2 font-normal'>
                      <input name='tenderizedCubedSteaks' type='checkbox' className='checkbox' />
                      <label htmlFor='tenderizedCubedSteaks'>Tenderized Cubed Steaks - {formatPrice(getTenderizedCubedSteaksPrice())}</label>
                    </div>
                  </div>
                )}

                <Textarea rows={3} name={`hindLegNotes`} label='Special Instructions' />
              </div>
            </div>

            {/* Roasts Preference */}
            <div className='mb-10 grid grid-cols-2 gap-4 border-b border-dashed border-gray-300 pb-10'>
              <div>
                <p className='mb-1 font-bold'>Roasts Preference</p>
                <Select
                  className='w-full'
                  name='roast'
                  options={[
                    { value: '2 Roasts, Grind Rest', label: '2 Roasts, Ground Venison for the rest' },
                    { value: 'As many as possible', label: 'As many as possible' },
                    { value: 'Grind', label: 'Ground Venison' },
                  ]}
                  defaultValue='Grind'
                ></Select>
              </div>
              <Textarea rows={2} name={`roastNotes`} label='Special Instructions' />
            </div>
          </div>

          <div className='flex items-center justify-start '>
            <div className='mt-2 h-px w-full grow bg-gray-500'></div>
            <h3 className='shrink-0 text-center text-display-md font-bold'>Specialty Meats</h3>
            <div className='mt-2 h-px w-full grow bg-gray-500'></div>
          </div>

          <div>
            <div className='mb-10 grid grid-cols-3 gap-4 border-b border-dashed border-gray-300 pb-10 '>
              <Select
                name='groundVenison'
                label='Ground Venison Options'
                placeholder='Select Option'
                defaultValue='Plain'
                options={getGroundVenisonOptions()}
              ></Select>

              <Select
                name='groundVenisonAmount'
                label='Ground Venison Amount'
                placeholder='Select Option'
                defaultValue='Remainder'
                options={[
                  { value: 'Remainder', label: 'Remainder of meat' },
                  { value: 'None - All specialty meat', label: 'None - All specialty meat' },
                ]}
              ></Select>
              <div className='col-span-3'>
                <Textarea rows={2} name={`groundVenisonNotes`} label='Special Instructions' />
              </div>
            </div>
            {/* Data-driven specialty meats section - renders all meats from productsConfig */}
            <SpecialtyMeatsAdminSection />

            <div className='mt-6 border-t border-dashed border-gray-300 pt-6'>
              <h3 className='mb-4 text-xl font-bold'>Payment Information</h3>

              {/* Pricing Comparison Alert - Only show for existing orders with price changes */}
              {!isNew && pricesHaveChanged && (
                <div className='mb-6 rounded-lg border-2 border-amber-300 bg-amber-50 p-4'>
                  <div className='flex items-start gap-3'>
                    <svg className='mt-0.5 h-6 w-6 flex-shrink-0 text-amber-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' />
                    </svg>
                    <div className='flex-1'>
                      <h4 className='font-bold text-amber-800'>Pricing Has Changed</h4>
                      <p className='mt-1 text-sm text-amber-700'>
                        Current pricing differs from when this order was submitted. Choose how to handle the price:
                      </p>
                      <div className='mt-3 grid grid-cols-2 gap-4 text-sm'>
                        <div className='rounded bg-white p-3'>
                          <p className='font-medium text-gray-600'>Original Price (at submission)</p>
                          <p className='text-xl font-bold text-gray-900'>${(originalTotalPrice + originalCapeHideTotal).toFixed(2)}</p>
                        </div>
                        <div className='rounded bg-white p-3'>
                          <p className='font-medium text-gray-600'>Current Price (today&apos;s rates)</p>
                          <p className='text-xl font-bold text-gray-900'>${(currentCalculatedPrice + currentCapeHidePrice).toFixed(2)}</p>
                          <p className='text-xs text-gray-500'>
                            {(currentCalculatedPrice + currentCapeHidePrice) > (originalTotalPrice + originalCapeHideTotal) ? '+' : ''}
                            ${((currentCalculatedPrice + currentCapeHidePrice) - (originalTotalPrice + originalCapeHideTotal)).toFixed(2)} difference
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pricing Mode Selection - Only show for existing orders */}
              {!isNew && (
                <div className='mb-6'>
                  <label className='mb-2 block font-medium text-gray-700'>Pricing Option</label>
                  <div className='flex flex-wrap gap-3'>
                    <label className={`flex cursor-pointer items-center gap-2 rounded-lg border-2 px-4 py-2 transition-colors ${pricingMode === 'original' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input
                        type='radio'
                        name='pricingMode'
                        value='original'
                        checked={pricingMode === 'original'}
                        onChange={() => setPricingMode('original')}
                        className='text-blue-600'
                      />
                      <span className='font-medium'>Keep Original Price</span>
                      <span className='text-sm text-gray-500'>(${(originalTotalPrice + originalCapeHideTotal).toFixed(2)})</span>
                    </label>
                    <label className={`flex cursor-pointer items-center gap-2 rounded-lg border-2 px-4 py-2 transition-colors ${pricingMode === 'current' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input
                        type='radio'
                        name='pricingMode'
                        value='current'
                        checked={pricingMode === 'current'}
                        onChange={() => setPricingMode('current')}
                        className='text-blue-600'
                      />
                      <span className='font-medium'>Update to Current Price</span>
                      <span className='text-sm text-gray-500'>(${(currentCalculatedPrice + currentCapeHidePrice).toFixed(2)})</span>
                    </label>
                    <label className={`flex cursor-pointer items-center gap-2 rounded-lg border-2 px-4 py-2 transition-colors ${pricingMode === 'manual' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input
                        type='radio'
                        name='pricingMode'
                        value='manual'
                        checked={pricingMode === 'manual'}
                        onChange={() => setPricingMode('manual')}
                        className='text-blue-600'
                      />
                      <span className='font-medium'>Manual Override</span>
                    </label>
                  </div>
                  {pricingMode === 'manual' && (
                    <div className='mt-3'>
                      <label className='mb-1 block text-sm font-medium text-gray-700'>Override Total Price</label>
                      <div className='flex items-center gap-2'>
                        <span className='text-lg'>$</span>
                        <input
                          type='number'
                          step='0.01'
                          min='0'
                          value={manualPrice}
                          onChange={(e) => setManualPrice(Number(e.target.value) || 0)}
                          className='w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-4'>
                  <div>
                    <label className='mb-1 block font-medium text-gray-700'>Processing Deposit</label>
                    <Input
                      type='number'
                      step='0.01'
                      min='0'
                      className='w-full'
                      name='deposit'
                      placeholder='0.00'
                      onChange={(e) => {
                        // Ensure the value is registered as a number
                        const numValue = e.target.value && e.target.value !== '' ? Number(e.target.value) : undefined;
                        form.setValue('deposit', numValue);
                      }}
                    />
                  </div>
                  <div>
                    <label className='mb-1 block font-medium text-gray-700'>Taxidermy Deposit</label>
                    <Input
                      type='number'
                      step='0.01'
                      min='0'
                      className='w-full'
                      name='capeHideDeposit'
                      placeholder='0.00'
                      onChange={(e) => {
                        // Ensure the value is registered as a number
                        const numValue = e.target.value && e.target.value !== '' ? Number(e.target.value) : undefined;
                        form.setValue('capeHideDeposit', numValue);
                      }}
                    />
                  </div>
                  <div>
                    <label className='mb-1 block font-medium text-gray-700'>Amount Paid</label>
                    <Input
                      type='number'
                      step='0.01'
                      min='0'
                      className='w-full'
                      name='amountPaid'
                      placeholder='0.00'
                      onChange={(e) => {
                        // Ensure the value is registered as a number
                        const numValue = e.target.value && e.target.value !== '' ? Number(e.target.value) : undefined;
                        form.setValue('amountPaid', numValue);
                      }}
                    />
                  </div>
                </div>
                <div className='space-y-2 text-right'>
                  <div>
                    <p className='mb-1 font-bold'>Processing Total</p>
                    <p className='text-lg'>
                      {pricingMode === 'original' && !isNew
                        ? `$${originalTotalPrice.toFixed(2)}`
                        : `$${currentCalculatedPrice.toFixed(2)}`}
                      {pricingMode === 'original' && !isNew && (
                        <span className='ml-1 text-xs text-gray-500'>(original)</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className='mb-1 font-bold'>Cape/Hide Total</p>
                    <p className='text-lg'>
                      {pricingMode === 'original' && !isNew
                        ? `$${originalCapeHideTotal.toFixed(2)}`
                        : `$${currentCapeHidePrice.toFixed(2)}`}
                      {pricingMode === 'original' && !isNew && (
                        <span className='ml-1 text-xs text-gray-500'>(original)</span>
                      )}
                    </p>
                  </div>
                  <div className='border-t border-gray-200 pt-2'>
                    <p className='mb-1 font-bold'>Grand Total</p>
                    <p className='text-xl font-bold'>
                      ${getFinalPrice().toFixed(2)}
                      {pricingMode === 'manual' && <span className='ml-1 text-xs text-gray-500'>(manual)</span>}
                      {pricingMode === 'original' && !isNew && <span className='ml-1 text-xs text-gray-500'>(original)</span>}
                    </p>
                  </div>
                  <div>
                    <p className='mb-1 font-bold text-blue-600'>Balance</p>
                    <p className='text-lg text-blue-600'>${balance.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='flex rounded-b-lg bg-gray-50 px-4 py-3 sm:px-6'>
          {!isNew && (
            <Button color='danger' onClick={deleteDeer} disabled={del.isLoading}>
              Delete Entry
            </Button>
          )}
          <div className='ml-auto flex gap-3'>
            <Button type='button' color='secondary' onClick={() => router.push('/admin/deers')} className='font-medium'>
              Cancel
            </Button>
            <Button type='submit' disabled={mutation.isLoading} className='font-medium'>
              {isNew ? 'Add Deer' : 'Save Entry'}
            </Button>
          </div>
        </div>
      </Form>
    </AdminPage>
  );
}

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getServerSideProps = getSecureServerSideProps(async (context) => {
  const { id } = context.query as Params;

  if (id === 'new') {
    return {
      props: { isNew: true },
    };
  }

  try {
    const deer = await getDeer(id);
    if (!deer) {
      console.log(`Deer with ID ${id} not found.`);
      return { notFound: true };
    }
    return {
      props: { data: deer },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return { notFound: true };
  }
}, true);
