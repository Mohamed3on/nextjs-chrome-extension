import { User, UsersMap } from '@/components/LocationsWrapper';
import React from 'react';

export const LocationList = ({
  locations,
}: {
  locations: {
    location: string;
    users: UsersMap;
  }[];
}) => {
  // console.table(locations[0].users);
  // sort users of first location by follower count
  const sortedUsers = Object.values(locations[0].users).sort((a, b) => {
    return b.followers_count - a.followers_count;
  });

  console.table(sortedUsers);
  return (
    <div className='bg-gray-800 text-white p-8 max-w-md mx-auto rounded-lg shadow-lg'>
      <h1 className='text-3xl font-semibold mb-6'>Where do your twitter friends live?</h1>
      <ul className='space-y-4'>
        {locations.map((location, index) => (
          <li
            key={index}
            className='flex justify-between items-center p-4 bg-gray-700 rounded-lg shadow-xl'
          >
            <span className='text-lg text-white'>{location.location}</span>
            <div className='flex items-center space-x-2'>
              <span className='text-gray-300 py-1 px-3 text-center text-lg'>
                {Object.keys(location.users).length}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
