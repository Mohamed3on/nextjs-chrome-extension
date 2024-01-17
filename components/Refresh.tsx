import { useTwitterHandleContext, useUserDataContext } from '@/lib/StorageContext';
import { LoaderIcon } from 'lucide-react';
import React, { useEffect } from 'react';

export const Refresh = () => {
  const userData = useUserDataContext();
  const [refreshing, setRefreshing] = React.useState(true);

  const { twitterHandle } = useTwitterHandleContext();
  const [errorMessage, setErrorMessage] = React.useState('');

  useEffect(() => {
    if (!userData)
      chrome.tabs.query({ currentWindow: true }, function (tabs) {
        const allMatchingTabs = tabs.filter((tab) => tab.url.includes('twitter.com'));

        if (allMatchingTabs.length > 0) {
          try {
            const mostRecentTab = allMatchingTabs[allMatchingTabs.length - 1];

            chrome.tabs.sendMessage(mostRecentTab.id, { message: 'refresh' }, function (response) {
              if (response?.type === 'success') {
                setRefreshing(false);
              } else if (response?.type === 'error') {
                setErrorMessage(
                  'Something went wrong. The user account may be private or suspended.'
                );
              } else {
                chrome.tabs.create({ url: `https://twitter.com/`, active: false });
              }
            });
          } catch (error) {
            // runs inject.js to fetch the new data

            console.log(error);
          }
        } else {
          chrome.tabs.create({ url: `https://twitter.com/`, active: false });
        }
      });
  }, [twitterHandle, userData]);

  if (errorMessage) {
    return (
      <div className='flex items-center justify-center flex-col gap-7'>
        <h1 className='text-2xl font-bold text-center text-gray-400'>{errorMessage}</h1>

        <h2 className='text-xl font-bold text-center text-gray-500'>
          Head over to{' '}
          <a
            className='text-blue-500 hover:underline hover:text-blue-100 transition-colors ease-in-out'
            href='#config'
          >
            config
          </a>{' '}
          to change the username
        </h2>
      </div>
    );
  }
  return refreshing ? (
    <div className='flex items-center justify-center flex-col gap-7'>
      <LoaderIcon className='w-16 h-16 text-gray-400 animate-spin' />

      <h1 className='text-2xl font-bold text-center text-gray-400'>
        Crunching the data for @{twitterHandle}, please wait
      </h1>

      <h2 className='text-xl font-bold text-center text-gray-500'>
        The more people you follow, the longer this may take
      </h2>
      <div className='text-sm font-semibold text-red-500'>
        Please don&apos;t close the open twitter tab!
      </div>
    </div>
  ) : null;
};
