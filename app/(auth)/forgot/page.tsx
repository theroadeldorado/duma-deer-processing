import React from 'react';
import PageWrapper from '../PageWrapper';
import { getMetadata } from '@/lib/helpers';
import ForgotForm from './ForgotForm';

export const metadata = getMetadata({
  title: 'Forgot Password',
});

export default function Page() {
  return (
    <PageWrapper heading='Forgot Password'>
      <ForgotForm />
    </PageWrapper>
  );
}
