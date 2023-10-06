import PageWrapper from '../PageWrapper';
import { getMetadata } from '@/lib/helpers';
import LoginForm from './LoginForm';

export const metadata = getMetadata({
  title: 'Login',
});

export default function Page() {
  return (
    <PageWrapper heading='Login'>
      <LoginForm />
    </PageWrapper>
  );
}
