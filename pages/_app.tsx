import React from 'react';
import 'styles/globals.css';

// Fix FA for nextjs https://fontawesome.com/docs/web/use-with/react/use-with
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

// Types
import type { AppProps } from 'next/app';

// Providers
import { UserProvider } from '@/providers/UserProvider';
import { ModalProvider } from '@/providers/ModalProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Lib
import { Toaster } from 'react-hot-toast';
import { get } from 'lib/helpers';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => get(queryKey[0] as string, (queryKey[1] || {}) as any),
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <ModalProvider>
          <Toaster containerStyle={{ zIndex: 10001 }} />
          <Component {...pageProps} />
        </ModalProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
