/* eslint-disable react/display-name */
import React, { createContext, useState, useEffect } from 'react';
import { User, UsersMap } from '@/components/LocationsWrapper';
import { getMappedLocations } from '@/utils/processLocations';
import { processLocations } from '@/utils/locationProcessing';
import { useEnableListsContext, useUserDataContext } from '@/lib/StorageContext';

export const LocationsContext = createContext(null);

export const useLocationContext = () => {
  const context: LocationsContextProps = React.useContext(LocationsContext);

  if (context === undefined) {
    throw new Error('useLocationContext must be used within a LocationsProvider');
  }

  return context;
};

export type LocationsContextProps = {
  locations: { [key: string]: UsersMap };
  sortedLocations: {
    location: string;
    users: UsersMap;
  }[];
  userListData: {
    name: string;
    users: User[];
    avatar: string;
    id: string;
  }[];

  numberOfFriends?: number;
  locationToTypeMapping?: { [key: string]: string };
  cityToCountryMapping?: { [key: string]: string };
};

export const LocationsProvider: React.FC<{ children: React.ReactNode }> = React.memo(function ({
  children,
}) {
  const [data, setData] = useState<LocationsContextProps>({
    locations: {},
    sortedLocations: [],
    userListData: [],
  });

  const [users, setUsers] = useState<UsersMap>({});

  const userData = useUserDataContext();

  const { enableLists, excludedLists } = useEnableListsContext();

  useEffect(() => {
    if (userData) {
      // Initialize an empty object to store user data
      let usersMap = {};

      const friends = userData?.['friends'];

      const userListData: {
        name: string;
        users: User[];
        avatar: string;
        id: string;
      }[] = userData?.['userListData'];

      if (userListData && enableLists) {
        userListData.forEach((list) => {
          if (excludedLists.includes(list.id)) {
            return;
          }
          list.users.forEach((user) => {
            if (!usersMap[user.screen_name]) {
              usersMap[user.screen_name] = { ...user, lists: [list.id], isFriend: false };
            } else {
              usersMap[user.screen_name].lists.push(list.id);
            }
          });
        });
      }

      // Process friends
      friends.forEach((friend) => {
        if (!usersMap[friend.screen_name]) {
          usersMap[friend.screen_name] = { ...friend, lists: [], isFriend: true };
        } else {
          usersMap[friend.screen_name].isFriend = true;
        }
      });

      setUsers(usersMap);
    }
  }, [userData, enableLists, excludedLists]);

  const setDataWithProcessedLocations = (
    locations: { [key: string]: UsersMap },
    locationToTypeMapping,
    cityToCountryMapping
  ) => {
    const sortedData = Object.entries(locations)
      .sort(([, a], [, b]) => Object.keys(b).length - Object.keys(a).length)

      .map(([location, items]) => ({
        location,
        users: items,
      }));
    setData({
      locations: locations,
      sortedLocations: sortedData,
      userListData: userData?.['userListData'] || [],
      numberOfFriends: Object.keys(users).length,
      locationToTypeMapping,
      cityToCountryMapping,
    });
  };

  useEffect(() => {
    let isMounted = true; // Flag to manage async calls

    const fetchData = async () => {
      try {
        if (users) {
          const processedLocations: {
            [key: string]: UsersMap;
          } = processLocations(Object.values(users));

          // filter out locations with only one user
          const filtered = Object.fromEntries(
            Object.entries(processedLocations).filter(([, items]) => Object.keys(items).length > 1)
          );

          const {
            mappedLocations: newLocations,
            locationToTypeMapping,
            cityToCountryMapping,
          } = await getMappedLocations(filtered);
          if (newLocations && isMounted) {
            setDataWithProcessedLocations(
              newLocations,
              locationToTypeMapping,
              cityToCountryMapping
            );
          }
        } else {
          setData({
            locations: {},
            sortedLocations: [],
            userListData: [],
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Clean up the flag when the component unmounts
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  return <LocationsContext.Provider value={{ ...data }}>{children}</LocationsContext.Provider>;
});
