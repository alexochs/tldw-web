import { Analytics } from '@vercel/analytics/react';
import type { AppProps } from 'next/app'
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { useState } from 'react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/900.css";

const theme = extendTheme({
  fonts: {
    heading: "'Roboto', sans-serif",
    body: "'Roboto', sans-serif",
  }
});

export default function App({ Component, pageProps }: AppProps) {
  const [supabase] = useState(() => createBrowserSupabaseClient())

  return (
    <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
        <Analytics/>
      </ChakraProvider>
    </SessionContextProvider>
  );
}
