import React from 'react';
import { LocationList } from '@/components/LocationList';
import { Refresh } from '@/components/Refresh';
import { useLocationContext } from '@/lib/LocationContext';

export type UsersMap = {
  [key: string]: User;
};

export type User = {
  name: string;
  screen_name: string;
  location: string;
  lists: string[];
  isFriend: boolean;
  followers_count: number;
  avatar: string;
};

export const LocationsWrapper = () => {
  const { data } = useLocationContext();

  return (
    <div>
      {data ? (
        <div className='flex items-center justify-center'>
          <LocationList {...data} />
        </div>
      ) : (
        <Refresh></Refresh>
      )}
    </div>
  );
};
