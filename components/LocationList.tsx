import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocationContext } from '@/lib/LocationContext';

import React from 'react';
import { ListsSection } from './ListsSection';
import { cn } from '@/lib/utils';
import { useProContext } from '@/lib/ProContext';
import { Badge } from '@/components/ui/badge';

const HeaderSection = () => {
  const { sortedLocations } = useLocationContext();
  const tweetText = `Most of my Twitter friends live in:%0A%0A${sortedLocations
    .slice(0, 3)
    .map((location, index) => `${index + 1}. ${location.location}`)
    .join('%0A')}.%0A%0ACheck out where your friends live at https://tribefinder.app`;

  return (
    <div>
      <h1 className='text-5xl font-extrabold mb-6 text-center text-gradient'>
        Where do your twitter friends live?
      </h1>
      <a
        className='flex items-center justify-center py-4 px-6 mb-6 max-w-sm mx-auto cta-gradient text-white font-semibold rounded-md shadow-md hover:shadow-lg
active:scale-95 transition-transform ease-in-out duration-100
focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 text-lg'
        href={`https://twitter.com/intent/tweet?text=${tweetText}`}
        target='_blank'
        rel='noreferrer'
      >
        Share the results on Twitter!
      </a>
    </div>
  );
};

export const Wrapper = ({ children }) => {
  return <div className=' text-gray-200 p-8 w-full rounded-lg shadow-lg'>{children}</div>;
};
export const LocationList = () => {
  const { sortedLocations, numberOfFriends, locationToTypeMapping } = useLocationContext();

  const { isPro } = useProContext();

  return (
    <Wrapper>
      <HeaderSection></HeaderSection>

      <ListsSection />

      <ul className='grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3 max-w-screen-xl'>
        {sortedLocations.map((location, index) => {
          const locationType = locationToTypeMapping?.[location.location];
          const percentage = Math.round(
            (Object.keys(location.users).length / numberOfFriends) * 100
          );
          return (
            <li key={index}>
              <Card>
                <a
                  href={`#location/${encodeURIComponent(location.location)}`}
                  className='
              hover:text-gray-300 active:text-gray-500 transition-colors ease-in-out'
                >
                  <CardHeader>
                    <CardTitle className='flex gap-2 items-center'>
                      <div>
                        <span className='mr-1'>#{index + 1}</span>
                        <span>{location.location}</span>
                      </div>
                      {locationType && (
                        <Badge className='bg-green-200 hover:bg-green-300 text-green-800'>
                          <span>{locationType}</span>
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      <span>{percentage > 1 ? percentage : '<1'}% of your Twitter friends</span>
                    </CardDescription>
                  </CardHeader>

                  <CardFooter className='flex text-lg justify-between'>
                    <div className='flex -space-x-2'>
                      {Object.values(location.users)
                        .slice(0, 8)
                        .sort((a, b) => b.followers - a.followers)
                        .map((user) => (
                          <Avatar key={user.screen_name} className='h-7 w-7'>
                            <AvatarImage
                              src={user.avatar}
                              className={cn(
                                'hover:opacity-60 transition-opacity ease-in-out duration-100 cursor-pointer',
                                isPro ? '' : 'blur-[1px]'
                              )}
                            />
                          </Avatar>
                        ))}
                    </div>

                    <div>
                      <span>{Object.keys(location.users).length}</span>
                      <span> friends</span>
                    </div>
                  </CardFooter>
                </a>
              </Card>
            </li>
          );
        })}
      </ul>
    </Wrapper>
  );
};
