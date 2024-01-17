import { useEffect, useState } from 'react';
import { Config } from '../components/Config';
import { LocationDetails } from '@/components/LocationDetails'; // Import LocationDetails
import { LocationsWrapper } from '@/components/LocationsWrapper';
import { LocationsProvider } from '@/lib/LocationContext';
import { NavBar } from '@/components/ui/NavBar';
import {
  StorageProvider,
  useEnableListsContext,
  useTwitterHandleContext,
} from '@/lib/StorageContext';
import { ProProvider } from '@/lib/ProContext';

export function Home() {
  const [route, setRoute] = useState('');

  const { twitterHandle, setTwitterHandle } = useTwitterHandleContext();

  const { enableLists, setEnableLists } = useEnableListsContext();

  useEffect(() => {
    const handleHashChange = () => {
      window.scrollTo(0, 0);
      const hashValue = decodeURIComponent(window.location.hash.substring(1));
      if (hashValue === 'config') {
        setRoute('config');
      } else if (hashValue === 'all_locations') {
        setRoute('all_locations');
      } else {
        setRoute(hashValue);
      }
    };

    window.addEventListener('hashchange', handleHashChange, false);
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const renderContentBasedOnRoute = () => {
    if (route === 'config' || !twitterHandle) {
      return (
        <Config
          onDataSubmit={onSubmit}
          initialData={
            twitterHandle
              ? {
                  twitterHandle,
                  enableLists,
                }
              : undefined
          }
        />
      );
    }

    if (route.startsWith('location/')) {
      const locationName = route.substring('location/'.length);
      return (
        <LocationsProvider>
          <LocationDetails locationName={locationName} />
        </LocationsProvider>
      );
    }

    return (
      <LocationsProvider>
        <LocationsWrapper />
      </LocationsProvider>
    );
  };

  const onSubmit = ({
    twitterHandle,
    enableLists,
  }: {
    twitterHandle: string;
    enableLists: boolean;
  }) => {
    setTwitterHandle(twitterHandle.replace('@', ''));
    setEnableLists(enableLists);
  };

  return (
    <div className='bg-background relative flex min-h-screen flex-col'>
      <NavBar userName={twitterHandle ? `@${twitterHandle}` : 'Config'} />
      {renderContentBasedOnRoute()}
    </div>
  );
}

const WithStorage = () => (
  <ProProvider>
    <StorageProvider>
      <Home />
    </StorageProvider>
  </ProProvider>
);

export default WithStorage;
