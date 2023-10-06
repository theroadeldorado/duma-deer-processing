'use client';
import 'styles/globals.css';

// Fix FA for nextjs https://fontawesome.com/docs/web/use-with/react/use-with
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

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

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang='en'>
      <body>
        <QueryClientProvider client={queryClient}>
          <UserProvider>
            <ModalProvider>
              <Toaster containerStyle={{ zIndex: 10001 }} />
              {children}
            </ModalProvider>
          </UserProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
