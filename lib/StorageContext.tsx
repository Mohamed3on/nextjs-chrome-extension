import { readLocalStorage } from '@/utils/localStorage';
import React, { createContext, useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';

export const TwitterHandleContext = createContext({
  twitterHandle: '',
  setTwitterHandle: (twitterHandle: string) => {},
});
export const EnableListsContext = createContext({
  enableLists: false,
  excludedLists: [],
  setEnableLists: (enableLists: boolean) => {},
  excludeList: (listId: string) => {},
  removeListExclusion: (listId: string) => {},
});
export const UserDataContext = createContext(null);

export const useTwitterHandleContext = () => {
  const context = React.useContext(TwitterHandleContext);

  if (context === undefined) {
    throw new Error('useTwitterHandleContext must be used within a TwitterHandleProvider');
  }

  return context;
};

export const useEnableListsContext = () => {
  const context = React.useContext(EnableListsContext);

  if (context === undefined) {
    throw new Error('useEnableListsContext must be used within a EnableListsProvider');
  }

  return context;
};

export const useUserDataContext = () => {
  const context = React.useContext(UserDataContext);

  if (context === undefined) {
    throw new Error('useUserDataContext must be used within a UserDataProvider');
  }

  return context;
};

export const StorageProvider = ({ children }) => {
  const [twitterHandle, setTwitterHandle] = useState('');
  const [enableLists, setEnableLists] = useState(false);
  const [excludedLists, setExcludedLists] = useState([]);

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch initial data from storage
    const fetchData = async () => {
      let result = {};
      try {
        result = await readLocalStorage([
          'twitterHandle',
          'enableLists',
          'userData',
          'excludedLists',
        ]);
      } catch (error) {
        console.log('no user data was found yet');
      }

      setTwitterHandle(result?.['twitterHandle'] || '');
      setEnableLists(result?.['enableLists'] || false);
      setUserData(result?.['userData'] || null);
      setExcludedLists(result?.['excludedLists'] || []);
    };

    fetchData();

    // Function to handle storage changes
    const handleStorageChange = (changes, areaName) => {
      // Handle changes
      if (areaName === 'local') {
        if (changes.hasOwnProperty('twitterHandle')) {
          toast('Please wait while we fetch your data', {
            description:
              'This might take a few seconds. Please do not close the open twitter tab in the meantime',
            duration: 5000,
            dismissible: true,
          });
        } else if (changes.hasOwnProperty('userData')) {
          setUserData(changes?.['userData']?.newValue || null);
        }
      }
    };

    // Add storage change listener
    chrome.storage.onChanged.addListener(handleStorageChange);

    // Cleanup
    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  const setLocalStorage = (data) => {
    try {
      chrome.storage.local.set(data);
    } catch (error) {
      console.error('Error setting data in storage:', error);
    }
  };

  return (
    <TwitterHandleContext.Provider
      value={useMemo(
        () => ({
          twitterHandle,
          setTwitterHandle: (twitterHandle) => {
            const setUserDataInStorage = (userData) => {
              setLocalStorage({ userData });
              setUserData(userData);
            };

            setTwitterHandle((prevHandle) => {
              if (prevHandle !== twitterHandle) {
                setUserDataInStorage(null);
              }
              setLocalStorage({ twitterHandle });
              return twitterHandle;
            });
          },
        }),
        [twitterHandle, setTwitterHandle]
      )}
    >
      <EnableListsContext.Provider
        value={useMemo(
          () => ({
            enableLists,
            setEnableLists: (enableLists) => {
              setLocalStorage({ enableLists });
              setEnableLists(enableLists);
            },
            excludedLists,
            excludeList: (listId) => {
              setLocalStorage({ excludedLists: [...excludedLists, listId] });
              setExcludedLists((prev) => [...prev, listId]);
            },

            removeListExclusion: (listId) => {
              setLocalStorage({
                excludedLists: excludedLists.filter((id) => id !== listId),
              });
              setExcludedLists((prev) => prev.filter((id) => id !== listId));
            },
          }),
          [enableLists, setEnableLists, excludedLists, setExcludedLists]
        )}
      >
        <UserDataContext.Provider value={userData}>{children}</UserDataContext.Provider>
      </EnableListsContext.Provider>
    </TwitterHandleContext.Provider>
  );
};
