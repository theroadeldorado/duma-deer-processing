import PageWrapper from '../PageWrapper';
import { getMetadata } from '@/lib/helpers';
import SignupForm from './SignupForm';

export const metadata = getMetadata({
  title: 'Sign Up',
});

export default function Page() {
  return (
    <PageWrapper heading='Sign Up'>
      <SignupForm />
    </PageWrapper>
  );
}
