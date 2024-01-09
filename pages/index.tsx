import { useEffect, useState } from 'react';
import { Username } from '../components/Username';
import { readLocalStorage } from '../utils/localStorage';
import { LocationsWrapper } from '@/components/LocationsWrapper';
import { LocationsProvider } from '@/lib/LocationContext';

declare const chrome: any;

function errorCallback(error) {
  console.error(error);
}
export default function Home() {
  const [userDetails, setUserDetails] = useState(null);

  const onSubmit = ({
    twitterHandle,
    listIDs,
  }: {
    twitterHandle: string;
    listIDs: {
      value: string;
    }[];
  }) => {
    const data = {
      twitterHandle,
      listIDs: listIDs.map((list) => list.value),
    };
    setUserDetails(data);
    chrome.storage.local.set(data);
  };

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

  return (
    <div>
      {userDetails ? (
        <LocationsProvider>
          <LocationsWrapper />
        </LocationsProvider>
      ) : (
        <Username onDataSubmit={onSubmit} />
      )}
    </div>
  );
}
