import React from 'react';

const formatLocation = (location) => {
  let formattedLocation = location.replace(/'/g, '');
  const parts = formattedLocation.split(', ');

  if (parts.length > 1) {
    formattedLocation = parts
      .map((part, index) => {
        return index === 0 ? part.charAt(0).toUpperCase() + part.slice(1) : part.toUpperCase();
      })
      .join(', ');
  }

  return formattedLocation;
};

const determineEmoji = (countChange) => {
  if (countChange === null || countChange === undefined || countChange === 0) return '';
  return countChange > 0 ? '🔥' : '❄️';
};

const formatChange = (countChange) => {
  if (countChange === null || countChange === undefined || countChange === 0) return '';
  return countChange > 0 ? `+${countChange}` : `${countChange}`;
};

export const LocationList = ({ locations }) => {
  return (
    <div className='bg-gray-800 text-white p-8 max-w-md mx-auto rounded-lg shadow-lg'>
      <h1 className='text-3xl font-semibold mb-6'>Where do your twitter friends live?</h1>
      <ul className='space-y-4'>
        {locations.map((location, index) => (
          <li
            key={index}
            className='flex justify-between items-center p-4 bg-gray-700 rounded-lg shadow-xl'
          >
            <span className='text-lg  text-white'>{formatLocation(location.location)}</span>
            <div className='flex items-center space-x-2'>
              <span className='text-gray-300 py-1 px-3 text-center text-lg'>{location.count}</span>
              {location.countChange !== null && location.countChange !== undefined && (
                <span
                  className={` w-8 text-center ${
                    location.countChange > 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {formatChange(location.countChange)}
                </span>
              )}
              <span className='w-5 text-center'>{determineEmoji(location.countChange)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
