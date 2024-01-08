import { useEffect, useState } from 'react';
import { Username } from '../components/Username';
import { readLocalStorage } from '../utils/localStorage';
import { LocationsWrapper } from '@/components/LocationsWrapper';

declare const chrome: any;

function successCallback(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  console.log('🚀 ~ file: index.tsx:13 ~ successCallback ~ latitude', latitude);
  console.log('🚀 ~ file: index.tsx:14 ~ successCallback ~ longitude', longitude);
}

function errorCallback(error) {
  console.error(error);
}
export default function Home() {
  // const [twitterHandle, setTwitterHandle] = useState('');

  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      // Request the user's location
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    }
  }, []);

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

  return <div>{userDetails ? <LocationsWrapper /> : <Username onDataSubmit={onSubmit} />}</div>;
}
