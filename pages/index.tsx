import { useEffect, useState } from 'react';
import { Config } from '../components/Config';
import { LocationDetails } from '@/components/LocationDetails'; // Import LocationDetails
import { readLocalStorage } from '../utils/localStorage';
import { LocationsWrapper } from '@/components/LocationsWrapper';
import { LocationsProvider } from '@/lib/LocationContext';
import { NavBar } from '@/components/ui/NavBar';

declare const chrome: any;

export default function Home() {
  const [userDetails, setUserDetails] = useState(null);
  const [route, setRoute] = useState('');

  const [storageData, setStorageData] = useState({}); // State to hold storage data

  useEffect(() => {
    // Function to handle storage changes
    const handleStorageChange = (changes, areaName) => {
      if (areaName === 'local') {
        // Update component state based on storage changes

        console.log('Storage change detected', changes);

        if (changes.hasOwnProperty('twitterHandle')) {
          chrome.storage.local.remove('userData');
          const newHandle = changes['twitterHandle'].newValue;
          window.open(`https://twitter.com/${newHandle}`, '_blank');
        }

        if (changes.hasOwnProperty('userData')) {
          console.log('YES');
          if (changes['userData'].newValue) {
            // go to #all_locations in the url
            window.location.hash = 'all_locations';
          }
        }
        setStorageData((prevData) => ({
          ...prevData,
          ...Object.keys(changes).reduce((acc, key) => {
            acc[key] = changes[key].newValue;
            return acc;
          }, {}),
        }));
      }
    };

    // Add storage change listener
    chrome.storage.onChanged.addListener(handleStorageChange);

    // Cleanup function to remove the listener
    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await readLocalStorage(['twitterHandle', 'enableLists']);

        if (!result?.['twitterHandle']) {
          setRoute('config');
          return;
        }

        setUserDetails({
          twitterHandle: result?.['twitterHandle'],
          enableLists: result?.['enableLists'],
        });
      } catch (error) {
        console.log('Twitter handle not set yet');
      }
    };

    fetchData();
  }, []);

  const renderContentBasedOnRoute = () => {
    if (route === 'config' || !userDetails) {
      return (
        <Config
          onDataSubmit={onSubmit}
          initialData={
            userDetails
              ? {
                  twitterHandle: userDetails?.twitterHandle,
                  enableLists: userDetails?.enableLists,
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

    if (userDetails || route === 'all_locations') {
      return (
        <LocationsProvider>
          <LocationsWrapper />
        </LocationsProvider>
      );
    }
  };

  const onSubmit = ({
    twitterHandle,
    enableLists,
  }: {
    twitterHandle: string;
    enableLists: boolean;
  }) => {
    const data = {
      twitterHandle,
      enableLists,
    };
    setUserDetails(data);
    chrome.storage.local.set(data);
  };

  return (
    <div className='bg-background relative flex min-h-screen flex-col'>
      <NavBar />
      {renderContentBasedOnRoute()}
    </div>
  );
}
