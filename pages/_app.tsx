import '../styles/globals.css';
import { Toaster } from '@/components/ui/sonner';

function MyApp({ Component, pageProps }) {
  return (
    <main className={`font-sans min-h-screen min-w-max bg-background  p-8 dark`}>
      <Component {...pageProps} />
      <Toaster />
    </main>
  );
}

export default MyApp;
