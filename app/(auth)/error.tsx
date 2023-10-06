'use client';
import ErrorMessage from '@/components/ErrorMessage';

type Props = {
  reset: () => void;
  error: Error;
};

export default function Error({ error, reset }: Props) {
  return <ErrorMessage error={error} reset={reset} />;
}
