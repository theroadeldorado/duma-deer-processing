import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from './Input';
import Form from './Form';
import RadioButtonGroup from './RadioButtonGroup';
import CheckboxGroup from './CheckboxGroup';
import Button from './Button';

type CommunicationPreference = 'call' | 'text';
type BackStrapsPreference = 'Cut in half' | 'Sliced' | 'Butterfly';

type Inputs = {
  name: string;
  tagNumber: string;
  phone: string;
  communicationPreference: CommunicationPreference;
  isSkinned: boolean;
  backStrapsPreference: BackStrapsPreference;
};

const TOTAL_STEPS = 6;

const CheckInForm = () => {
  const form = useForm<Inputs>();
  const [currentStep, setCurrentStep] = useState(1);

  const { register, handleSubmit, watch } = form;

  const onSubmit = (data: Inputs) => {
    console.log(data);
  };

  const progressPercentage = (currentStep / TOTAL_STEPS) * 100;

  // Watch the values of the fields based on the current step
  const values = watch();

  // Check if required fields for the current step are filled
  const isCurrentStepFilled = () => {
    switch (currentStep) {
      case 1:
        return values.name && values.tagNumber;
      case 2:
        return values.phone && values.communicationPreference;
      case 3:
        return values.isSkinned !== undefined;
      case 4:
        return values.backStrapsPreference;
      default:
        return true;
    }
  };

  return (
    <div className='flex flex-col gap-6'>
      <div className='relative w-full h-4 overflow-hidden bg-gray-300 rounded-full'>
        <div className='absolute top-0 left-0 h-4 transition-all duration-300 bg-green-500' style={{ width: `${progressPercentage}%` }}></div>
      </div>

      <Form onSubmit={handleSubmit(onSubmit)} form={form} className='flex flex-col gap-6'>
        {currentStep === 1 && (
          <>
            <Input label='Full Name' type='text' name='name' register={register} required />
            <Input label='Tag Number' type='text' name='tagNumber' register={register} required />
          </>
        )}
        {currentStep === 2 && (
          <>
            <Input label='Phone' type='tel' name='phone' register={register} required />
            <RadioButtonGroup
              name='communicationPreference'
              required
              options={[
                { value: 'call', label: 'Call' },
                { value: 'text', label: 'Text' },
              ]}
              register={register}
              wrapperLabel='Communication Preference'
            />
          </>
        )}
        {currentStep === 3 && (
          <>
            <CheckboxGroup
              name='isSkinned'
              options={[{ value: 'skinned', label: 'Skinned, Cut, Ground, Vacuum packed' }]}
              register={register}
              required
              wrapperLabel='Base Price - $95'
            />
            <p className='italic'>May already skinned or quartered.</p>
          </>
        )}
        {currentStep === 4 && (
          <RadioButtonGroup
            name='backStrapsPreference'
            options={[
              { value: 'Cut in half', label: 'Cut in half' },
              { value: 'Sliced', label: 'Sliced' },
              { value: 'Butterfly', label: 'Butterfly' },
            ]}
            register={register}
            wrapperLabel='Back Straps Preference'
          />
        )}

        {currentStep === 5 && (
          <div>
            <h3 className='mb-4 text-lg font-bold'>Review Your Information:</h3>
            <ul>
              <li>
                <strong>Name:</strong> {values.name}
              </li>
              <li>
                <strong>Tag Number:</strong> {values.tagNumber}
              </li>
              <li>
                <strong>Phone:</strong> {values.phone}
              </li>
              <li>
                <strong>Communication Preference:</strong> {values.communicationPreference}
              </li>
              <li>
                <strong>Is Skinned:</strong> {values.isSkinned ? 'Yes' : 'No'}
              </li>
              <li>
                <strong>Back Straps Preference:</strong> {values.backStrapsPreference}
              </li>
            </ul>
            <Button type='submit'>Check-in</Button>
          </div>
        )}

        <div className='flex justify-between gap-4'>
          {/* Back Button */}
          {currentStep > 1 ? (
            <Button type='button' className='inline-flex gap-2' onClick={() => setCurrentStep((prevStep) => prevStep - 1)}>
              <svg xmlns='http://www.w3.org/2000/svg' height='1em' viewBox='0 0 320 512'>
                <path
                  fill='currentColor'
                  d='M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z'
                />
              </svg>
              Back
            </Button>
          ) : (
            <div></div>
          )}

          {/* Next Button */}
          {currentStep < 5 ? (
            <Button
              type='button'
              className='inline-flex gap-2'
              onClick={() => setCurrentStep((prevStep) => prevStep + 1)}
              disabled={!isCurrentStepFilled()}
            >
              Next
              <svg xmlns='http://www.w3.org/2000/svg' height='1em' viewBox='0 0 320 512'>
                <path
                  fill='currentColor'
                  d='M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z'
                />
              </svg>
            </Button>
          ) : (
            <div></div>
          )}
        </div>
      </Form>
    </div>
  );
};

export default CheckInForm;
