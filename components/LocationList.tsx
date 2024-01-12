import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocationContext } from '@/lib/LocationContext';
import { useStorageContext } from '@/lib/StorageContext';

import React from 'react';

const ListsSection = () => {
  const { userListData } = useLocationContext();

  const {
    storageData: { enableLists },
  } = useStorageContext();
  if (userListData.length === 0) return null;

  if (!enableLists) {
    return (
      <div className='mb-4'>
        <p className='text-center text-gray-500'>
          Tip: You can include your lists in the results by enabling them in the{' '}
          <a href='#config' className='text-blue-500 hover:underline'>
            config
          </a>
          .
        </p>
      </div>
    );
  }
  return (
    <Accordion type='single' collapsible className='mb-3'>
      <AccordionItem value='item-1'>
        <AccordionTrigger className='justify-start gap-2'>Included lists</AccordionTrigger>
        <AccordionContent>
          <div className='flex flex-row items-center space-x-3 mb-4'>
            {userListData.map((list) => (
              <div key={list.id} className='flex items-center'>
                <div className='rounded-full bg-gray-200  p-1 flex justify-between items-center gap-1 pr-2'>
                  <Avatar className='h-6 w-6'>
                    <AvatarImage src={list.avatar} />
                    <AvatarFallback>TTF</AvatarFallback>
                  </Avatar>
                  <span className='text-sm font-semibold text-gray-800'>{list.name}</span>
                </div>
              </div>
            ))}
          </div>
          <a href='#config' className='text-blue-500 hover:underline mt-2'>
            Want to exclude them?
          </a>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export const Wrapper = ({ children }) => {
  return <div className=' text-gray-200 p-8 w-full rounded-lg shadow-lg'>{children}</div>;
};
export const LocationList = () => {
  const { sortedLocations } = useLocationContext();

  const tweetText = `Most of my Twitter friends live in:%0A%0A${sortedLocations
    .slice(0, 3)
    .map((location, index) => `${index + 1}. ${location.location}`)
    .join(
      '%0A'
    )}.%0A%0ACheck out where your friends live at https://twitter-friends-location.vercel.app`;

  return (
    <Wrapper>
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

      <ListsSection />

      <ul className='grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 max-w-screen-xl'>
        {sortedLocations.map((location, index) => (
          <li key={index}>
            <Card>
              <a
                href={`#location/${encodeURIComponent(location.location)}`}
                className='
              hover:text-gray-300 active:text-gray-500 transition-colors ease-in-out'
              >
                <CardHeader>
                  <CardTitle>
                    <span className='mr-1'>#{index + 1}</span>
                    <span>{location.location}</span>
                  </CardTitle>
                </CardHeader>

                <CardFooter className='flex justify-between'>
                  <div className='flex -space-x-3  justify-center'>
                    {Object.values(location.users)
                      .slice(0, 8)
                      .sort((a, b) => b.followers - a.followers)
                      .map((user) => (
                        <Avatar key={user.screen_name} className='h-7 w-7'>
                          <AvatarImage
                            src={user.avatar}
                            className='hover:opacity-60 transition-opacity ease-in-out duration-100 cursor-pointer '
                          />
                          <AvatarFallback>TTF</AvatarFallback>
                        </Avatar>
                      ))}
                  </div>
                  <div className='text-lg'>
                    <span>{Object.keys(location.users).length}</span>
                    <span> friends</span>
                  </div>
                </CardFooter>
              </a>
            </Card>
          </li>
        ))}
      </ul>
    </Wrapper>
  );
};
