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

          // Convert the usersMap to an array if needed
          let usersArray = Object.values(usersMap);

          console.log(usersArray);

          const rawFriendsLocations = addLocations(usersArray);

          const processedLocations = processLocations(rawFriendsLocations);
          const sortedData = Object.entries(processedLocations)
            .sort(([, a], [, b]) => Number(b) - Number(a))
            .map(([location, count]) => ({
              location,
              count,
            }));

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
