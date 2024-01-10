import { User } from '@/components/LocationsWrapper';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useLocationContext } from '@/lib/LocationContext';
import React, { useEffect } from 'react';

import { GOOGLE_IMG_SCRAP } from 'google-img-scrap';
import { ArrowLeft } from 'lucide-react';
import { Wrapper } from '@/components/LocationList';

const formatNumber = (num) => {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const LocationDetails = ({ locationName }: { locationName?: string }) => {
  const { locations } = useLocationContext();

  const [image, setImage] = React.useState('');
  useEffect(() => {
    const fetchData = async () => {
      const images = await GOOGLE_IMG_SCRAP({
        search: locationName,
      });
      console.log(images.result);
      // get the first image that's taller than 600px:
      const image = images.result.find((image) => image.height > 600);
      setImage(image.url);
    };

    fetchData();
  }, [locationName]);

  const usersObject = locations[locationName];

  if (!usersObject) {
    return <div>No data available for this location.</div>;
  }

  const users: User[] = Object.values(usersObject);

  const sortedUsers = users.sort((a, b) => b.followers - a.followers);

  return (
    <Wrapper>
      <button
        onClick={() => window.history.back()}
        className='flex gap-1 mb-4 items-center text-white hover:text-gray-300 text-lg'
      >
        <ArrowLeft></ArrowLeft> <span>Back</span>
      </button>
      <img src={image} alt={locationName} className='w-full h-64 mb-3 rounded-md object-cover' />

      <h1 className='text-3xl font-semibold mb-6'>Friends in {locationName}</h1>
      <ul className='space-y-4'>
        {sortedUsers.map((user, index) => (
          <li
            key={index}
            className='flex justify-between items-center p-4 bg-gray-700 rounded-lg shadow-xl text-base'
          >
            <div className='flex items-center space-x-2'>
              <Avatar>
                <AvatarImage src={user.avatar} />
              </Avatar>
              <div className='flex flex-col'>
                {user.isFriend && <span className='text-sm text-green-400'>Following</span>}
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
              {user.lists.length > 0 && (
                <div className='flex items-center mb-4'>
                  <span className='text-gray-300 mr-2'>Lists:</span>
                  <span className='text-white'>{user.lists.length}</span>
                </div>
              )}
              <div className='flex items-center'>
                <span className='text-gray-300 mr-2'>Followers:</span>
                <span className='text-white'>{formatNumber(user.followers)}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Wrapper>
  );
};
