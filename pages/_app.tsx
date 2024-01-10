import Head from 'next/head';
import '../styles/globals.css';
import { Toaster } from '@/components/ui/sonner';

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>Twitter Friends Mapper</title>
      </Head>
      <main className={`font-sans min-h-screen min-w-max bg-background dark`}>
        <Component {...pageProps} />
        <Toaster />
      </main>
    </div>
  );
}

export default MyApp;
