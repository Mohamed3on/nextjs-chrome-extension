import { User } from '@/components/LocationsWrapper';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLocationContext } from '@/lib/LocationContext';
import React from 'react';

import { ArrowLeft } from 'lucide-react';
import { Wrapper } from '@/components/LocationList';
import LocationImage from '@/components/ui/LocationImage';

const formatNumber = (num) => {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const LocationDetails = ({ locationName }: { locationName?: string }) => {
  const { locations } = useLocationContext();

  const usersObject = locations[locationName];

  if (!usersObject) {
    return <div>No data available for this location.</div>;
  }

  const users: User[] = Object.values(usersObject) as unknown as User[];

  const sortedUsers = users.sort((a, b) => b.followers - a.followers);

  return (
    <Wrapper>
      <button
        onClick={() => window.history.back()}
        className='flex gap-1 mb-4 items-center text-gray-200 hover:text-gray-300 text-lg'
      >
        <ArrowLeft></ArrowLeft> <span>Back</span>
      </button>
      <LocationImage locationName={locationName} className='h-64 mb-3 rounded-md' />

      <h1 className='text-3xl font-semibold mb-6'>
        {sortedUsers.length} Friends in {locationName}
      </h1>
      <ul className='space-y-4'>
        {sortedUsers.map((user, index) => (
          <li key={index}>
            <a
              href={`https://twitter.com/${user.screen_name}`}
              target='_blank'
              rel='noopener noreferrer'
              className='flex justify-between items-center p-4  rounded-lg shadow-xl text-base bg-gray-700 hover:bg-gray-300 hover:text-gray-900 active:bg-gray-500 transition-colors ease-in-out'
            >
              <div className='flex items-center space-x-2'>
                <Avatar>
                  <AvatarImage loading='lazy' src={user.avatar} />
                  <AvatarFallback>{user.name}</AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                  {user.isFriend && (
                    <span
                      className='text-sm text-green-400
                  hover:text-green-300 active:text-green-500

                  '
                    >
                      Following
                    </span>
                  )}
                  <div className='flex gap-2 items-center'>
                    <span className='text-lg text-blue-400 hover:text-blue-300 active:text-blue-500'>
                      {user.name}
                    </span>
                    <span className='text-gray-400'>{`@${user.screen_name}`}</span>
                  </div>
                </div>
              </div>
              <div className='flex flex-col items-end'>
                <div className='flex items-center'>
                  <span>{formatNumber(user.followers)}</span>
                  <span className=' ml-1'>Followers</span>
                </div>
                <div className='flex items-center'>
                  <span className=' ml-1'>{user.location}</span>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </Wrapper>
  );
};
