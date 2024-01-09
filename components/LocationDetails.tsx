import { User } from '@/components/LocationsWrapper';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useLocationContext } from '@/lib/LocationContext';
import React from 'react';

const formatNumber = (num) => {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const LocationDetails = ({ locationName }: { locationName?: string }) => {
  const { locations } = useLocationContext();

  const usersObject = locations[locationName];

  if (!usersObject) {
    return <div>No data available for this location.</div>;
  }

  const users: User[] = Object.values(usersObject);

  const sortedUsers = users.sort((a, b) => b.followers - a.followers);

  return (
    <div className='bg-gray-800 text-white p-8 max-w-md mx-auto rounded-lg shadow-lg'>
      <button onClick={() => window.history.back()} className='mb-4 text-white hover:text-gray-300'>
        &#8592; Back
      </button>
      <h1 className='text-3xl font-semibold mb-6'>{locationName}</h1>
      <ul className='space-y-4'>
        {sortedUsers.map((user, index) => (
          <li
            key={index}
            className='flex justify-between items-center p-4 bg-gray-700 rounded-lg shadow-xl'
          >
            <div className='flex items-center space-x-2'>
              <Avatar>
                <AvatarImage src={user.avatar} />
              </Avatar>
              <div className='flex flex-col sm:flex-row'>
                {user.isFriend && <span className='ml-2 text-sm text-green-400'>Following</span>}
                <a
                  href={`https://twitter.com/${user.screen_name}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-lg text-blue-400 hover:text-blue-300 active:text-blue-500'
                >
                  {user.name}
                </a>
              </div>
            </div>
            <div className='flex flex-col items-end'>
              <div className='flex items-center mb-1'>
                <span className='text-gray-300 mr-2'>Lists:</span>
                <span className='text-white'>{user.lists.length}</span>
              </div>
              <div className='flex items-center'>
                <span className='text-gray-300 mr-2'>Followers:</span>
                <span className='text-white'>{formatNumber(user.followers)}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
