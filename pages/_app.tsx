import Head from 'next/head';
import '../styles/globals.css';
import { Toaster } from '@/components/ui/sonner';

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>Tribe Finder</title>
        <link rel='icon' type='image/svg+xml' href='/logo.svg' />
      </Head>
      <main className={`font-sans min-h-screen bg-background min-w-fit px-10 dark`}>
        <Component {...pageProps} />
        <Toaster />
      </main>
    </div>
  );
}

export default MyApp;
