import Head from 'next/head';
import '../styles/globals.css';
import { Toaster } from '@/components/ui/sonner';

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>Twitter Friends Mapper</title>
        <link rel='icon' type='image/svg+xml' href='/logo.svg' />
      </Head>
      <main className={`font-sans min-h-screen min-w-max bg-background px-11 dark`}>
        <Component {...pageProps} />
        <Toaster />
      </main>
    </div>
  );
}

export default MyApp;
