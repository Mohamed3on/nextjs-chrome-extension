import { readLocalStorage } from '@/utils/localStorage';
import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export const StorageContext = createContext(null);

declare const chrome: any;

export type StorageContextProps = {
  storageData: { twitterHandle: string; enableLists: boolean; userData: any };
  setLocalStorage: (data: any) => void;
};

export const useStorageContext = () => {
  const context: StorageContextProps = React.useContext(StorageContext);

  if (context === undefined) {
    throw new Error('useStorageContext must be used within a StorageProvider');
  }

  return context;
};

export const StorageProvider = ({ children }) => {
  const [storageData, setStorageData] = useState({
    twitterHandle: '',
    enableLists: false,
    userData: {},
  });

  useEffect(() => {
    // Fetch initial data from storage
    const fetchData = async () => {
      try {
        const result = await readLocalStorage(['twitterHandle', 'enableLists', 'userData']);
        setStorageData({
          twitterHandle: result?.['twitterHandle'] || '',
          enableLists: result?.['enableLists'] || false,
          userData: result?.['userData'] || {},
        });
      } catch (error) {
        console.error('Error fetching data from storage:', error);
      }
    };

    fetchData();

    // Function to handle storage changes
    const handleStorageChange = (changes, areaName) => {
      // Handle changes
      if (areaName === 'local') {
        if (changes.hasOwnProperty('twitterHandle')) {
          // send refresh message to inject.js running on twitter.com

          toast('Please wait while we fetch your data', {
            description:
              'This might take a few seconds. Please do not close the open twitter tab in the meantime',
            duration: 5000,
            dismissible: true,
          });
          // data is stale here, so we need to fetch it again
          chrome.storage.local.remove('userData');
          const newHandle = changes['twitterHandle'].newValue;

          if (newHandle) {
            chrome.tabs.query({ currentWindow: true }, function (tabs) {
              const correctTab = tabs.find((tab) => tab.url.includes('twitter.com'));
              if (correctTab)
                chrome.tabs.sendMessage(correctTab.id, { message: 'refresh' }, function (response) {
                  console.log(response);
                });
              // runs inject.js to fetch the new data
              else window.open(`https://twitter.com/${newHandle}`, '_blank');
            });
          }
        }

        if (changes.hasOwnProperty('userData')) {
          if (!changes['userData'].hasOwnProperty('newValue')) {
            window.location.hash = 'all_locations';
          }
        }

        const newResult = (prevData) => ({
          ...prevData,
          ...Object.keys(changes).reduce((acc, key) => {
            acc[key] = changes[key].newValue;
            return acc;
          }, {}),
        });
        setStorageData(newResult);
      }
    };

    // Add storage change listener
    chrome.storage.onChanged.addListener(handleStorageChange);

    // Cleanup
    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  const setLocalStorage = async (data) => {
    setStorageData((prevData) => ({
      ...prevData,
      ...data,
    }));
    try {
      chrome.storage.local.set(data);
    } catch (error) {
      console.error('Error setting data in storage:', error);
    }
  };
  return (
    <StorageContext.Provider value={{ storageData, setLocalStorage }}>
      {children}
    </StorageContext.Provider>
  );
};
