import React, { createContext, useState, useEffect } from 'react';
import { readLocalStorage } from '@/utils/localStorage';
import { UsersMap } from '@/components/LocationsWrapper';
import { processLocations } from '@/utils/data';

export const LocationsContext = createContext(null);

export const useLocationContext = () => {
  const context = React.useContext(LocationsContext);

  if (context === undefined) {
    throw new Error('useLocationContext must be used within a LocationsProvider');
  }

  return context;
};

export const LocationsProvider = ({ children }) => {
  const [data, setData] = useState({
    locations: {},
    sortedLocations: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await readLocalStorage(['userData', 'enableLists']);

        if (result?.['userData']) {
          const userListData = result?.['userData']['userListData'];
          const friends = result?.['userData']['friends'];

          // Initialize an empty object to store user data
          let usersMap = {};

          if (userListData && result?.['enableLists']) {
            userListData.forEach((list) =>
              list.users.forEach((user) => {
                if (!usersMap[user.screen_name]) {
                  usersMap[user.screen_name] = { ...user, lists: [list.name], isFriend: false };
                } else {
                  usersMap[user.screen_name].lists.push(list.name);
                }
              })
            );
          }

          // Process friends
          friends.forEach((friend) => {
            if (!usersMap[friend.screen_name]) {
              usersMap[friend.screen_name] = { ...friend, lists: [], isFriend: true };
            } else {
              usersMap[friend.screen_name].isFriend = true;
            }
          });

          const processedLocations = processLocations(Object.values(usersMap));

          const sortedData = Object.entries(processedLocations)
            .filter(([, items]: [string, UsersMap]) => {
              return Object.keys(items).length > 1;
            })

            .sort(
              ([, a]: [string, UsersMap], [, b]: [string, UsersMap]) =>
                Object.keys(b).length - Object.keys(a).length
            )
            .map(([location, items]: [string, UsersMap]) => ({
              location,
              users: items,
            }));

          setData({ locations: processedLocations, sortedLocations: sortedData });

          return;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return <LocationsContext.Provider value={{ ...data }}>{children}</LocationsContext.Provider>;
};
