import { useEffect, useState } from 'react';
import { Config } from '../components/Config';
import { LocationDetails } from '@/components/LocationDetails'; // Import LocationDetails
import { readLocalStorage } from '../utils/localStorage';
import { LocationsWrapper } from '@/components/LocationsWrapper';
import { LocationsProvider } from '@/lib/LocationContext';

declare const chrome: any;

export default function Home() {
  const [userDetails, setUserDetails] = useState(null);
  const [route, setRoute] = useState('');

  useEffect(() => {
    const handleHashChange = () => {
      window.scrollTo(0, 0);
      const hashValue = decodeURIComponent(window.location.hash.substring(1));
      if (hashValue === 'config') {
        setRoute('config');
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await readLocalStorage(['twitterHandle', 'listIDs']);
        if (!result) {
          return;
        }

        setUserDetails({
          twitterHandle: result?.['twitterHandle'],
          listIDs: result?.['listIDs'] || [],
        });
      } catch (error) {
        console.log('Twitter handle not set yet');
      }
    };

    fetchData();
  }, []);

  const renderContentBasedOnRoute = () => {
    if (route === 'config') {
      return <Config onDataSubmit={onSubmit} />;
    }

    if (route.startsWith('location/')) {
      const locationName = route.substring('location/'.length);
      return (
        <LocationsProvider>
          <LocationDetails locationName={locationName} />
        </LocationsProvider>
      );
    }

    if (userDetails) {
      return (
        <LocationsProvider>
          <LocationsWrapper />
        </LocationsProvider>
      );
    }

    return <Config onDataSubmit={onSubmit} />;
  };

  const onSubmit = ({
    twitterHandle,
    listIDs,
  }: {
    twitterHandle: string;
    listIDs: { value: string }[];
  }) => {
    const data = {
      twitterHandle,
      listIDs: listIDs.map((list) => list.value),
    };
    setUserDetails(data);
    chrome.storage.local.set(data);
  };

  return <div>{renderContentBasedOnRoute()}</div>;
}
