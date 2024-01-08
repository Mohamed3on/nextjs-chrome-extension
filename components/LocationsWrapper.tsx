import React, { useEffect, useState } from 'react';
import { LocationList } from '@/components/LocationList';
import { Refresh } from '@/components/Refresh';
import { readLocalStorage } from '@/utils/localStorage';
import { addLocations, processLocations } from '@/utils/data';

export const LocationsWrapper = () => {
  const [locationsToUse, setLocationsToUse] = useState({
    friends: true,
    lists: true,
  });
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await readLocalStorage(['locationData', 'userData']);

        if (result?.['userData']) {
          const listUsers = result?.['userData']['lists'];
          const friends = result?.['userData']['friends'];

          // Initialize an empty object to store user data
          let usersMap = {};

          // Process each list and its users
          for (let listID in listUsers) {
            listUsers[listID].forEach((user) => {
              if (!usersMap[user.screen_name]) {
                usersMap[user.screen_name] = { ...user, lists: [listID], isFriend: false };
              } else {
                usersMap[user.screen_name].lists.push(listID);
              }
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

          let usersArray: {
            location: string;
            name: string;
            screen_name: string;
          }[] = Object.values(usersMap);

          const processedLocations = processLocations(usersArray);
          const sortedData = Object.entries(processedLocations)
            .filter(([, items]: [string, { size: number }]) => {
              return items.size > 1;
            })

            .sort(
              ([, a]: [string, { size: number }], [, b]: [string, { size: number }]) =>
                b.size - a.size
            )
            .map(
              ([location, items]: [
                string,
                {
                  size: number;
                }
              ]) => ({
                location,
                count: items.size,
              })
            );

          setData(sortedData);

          return;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {data ? (
        <div className='flex items-center justify-center'>
          <LocationList locations={data} />
        </div>
      ) : (
        <Refresh></Refresh>
      )}
    </div>
  );
};
