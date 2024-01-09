import { UsersMap } from '@/components/LocationsWrapper';
import Link from 'next/link';
import React from 'react';

export const LocationList = ({
  sortedLocations,
}: {
  sortedLocations: {
    location: string;
    users: UsersMap;
  }[];
}) => {
  return (
    <div className='bg-gray-800 text-white p-8 max-w-md mx-auto rounded-lg shadow-lg'>
      <h1 className='text-3xl font-semibold mb-6'>Where do your twitter friends live?</h1>
      <ul className='space-y-4'>
        {sortedLocations.map((location, index) => (
          <li
            key={index}
            className='flex justify-between items-center p-4 bg-gray-700 rounded-lg shadow-xl'
          >
            <a href={`#location/${encodeURIComponent(location.location)}`}>
              <span className='text-lg text-white'>{location.location}</span>
            </a>
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
