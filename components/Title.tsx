import Head from 'next/head';
import { siteName } from '@/config';

type TitleProps = {
  children?: string;
};

export default function Title({ children }: TitleProps) {
  return (
    <Head>
      <title>{children ? `${children} - ${siteName}` : siteName}</title>
    </Head>
  );
}
