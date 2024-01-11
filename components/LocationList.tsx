import { UsersMap } from '@/components/LocationsWrapper';

import React from 'react';

export const Wrapper = ({ children }) => {
  return (
    <div className='bg-gray-800 text-gray-200 p-8 w-full rounded-lg shadow-lg'>{children}</div>
  );
};
export const LocationList = ({
  sortedLocations,
}: {
  sortedLocations: {
    location: string;
    users: UsersMap;
  }[];
}) => {
  const tweetText = `Most of my Twitter friends live in:%0A%0A${sortedLocations
    .slice(0, 3)
    .map((location, index) => `${index + 1}. ${location.location}`)
    .join(
      '%0A'
    )}.%0A%0ACheck out where your friends live at https://twitter-friends-location.vercel.app`;

  return (
    <Wrapper>
      <h1 className='text-3xl font-semibold mb-6'>Where do your twitter friends live?</h1>
      <a
        className='flex items-center justify-center py-3 px-6 mb-6 max-w-sm mx-auto bg-blue-500 hover:bg-blue-700 active:bg-blue-900
        text-white  rounded-md ease-in-out shadow-lg'
        href={`https://twitter.com/intent/tweet?text=${tweetText}`}
        target='_blank'
        rel='noreferrer'
      >
        Tweet The Result!
      </a>
      <ul className='space-y-4'>
        {sortedLocations.map((location, index) => (
          <li key={index}>
            <a
              href={`#location/${encodeURIComponent(location.location)}`}
              className='hover:bg-gray-300 hover:text-gray-900

              active:bg-gray-500 transition-colors ease-in-out flex justify-between items-center p-4 bg-gray-700 rounded-lg shadow-xl'
            >
              <div>
                <span className='text-lg mr-1'>#{index + 1}</span>
                <span className='text-lg'>{location.location}</span>
              </div>
              <div className='flex items-center space-x-2'>
                <span className='py-1 px-3 text-center text-lg'>
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
