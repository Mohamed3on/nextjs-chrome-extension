import { UsersMap } from '@/components/LocationsWrapper';

import React from 'react';

export const Wrapper = ({ children }) => {
  return <div className='bg-gray-800 text-white p-8 w-full rounded-lg shadow-lg'>{children}</div>;
};
export const LocationList = ({
  sortedLocations,
}: {
  sortedLocations: {
    location: string;
    users: UsersMap;
  }[];
}) => {
  return (
    <Wrapper>
      <h1 className='text-3xl font-semibold mb-6'>Where do your twitter friends live?</h1>
      <ul className='space-y-4'>
        {sortedLocations.map((location, index) => (
          <li key={index}>
            <a
              href={`#location/${encodeURIComponent(location.location)}`}
              className='hover:bg-gray-300 hover:text-gray-900

              active:bg-gray-500 transition-colors ease-in-out flex justify-between items-center p-4 bg-gray-700 rounded-lg shadow-xl'
            >
              <span className='text-lg  '>{location.location}</span>
              <div className='flex items-center space-x-2'>
                <span className='text-gray-300 py-1 px-3 text-center text-lg'>
                  {Object.keys(location.users).length}
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </Wrapper>
  );
};
