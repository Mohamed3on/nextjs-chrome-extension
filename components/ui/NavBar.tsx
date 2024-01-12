import React from 'react';

export const NavBar = ({ userName }: { userName: string }) => {
  return (
    <div className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mb-4'>
      <nav className='flex justify-between items-center p-4'>
        <div>
          <img
            src='/logo.svg'
            alt='Logo'
            onClick={() => {
              window.location.href = '/index.html';
            }}
            className='h-10 w-10 hover:opacity-80 transition-opacity ease-in-out duration-300 cursor-pointer'
          />
        </div>
        <ul className='flex space-x-4 text-base'>
          <li>
            <a
              href='#all_locations'
              className='hover:text-foreground/80 text-foreground/60 cursor-pointer transition-colors ease-in-out duration-300'
            >
              Locations
            </a>
          </li>
          <li>
            <a
              href='#config'
              className='hover:text-foreground/80 text-foreground/60 transition-colors ease-in-out duration-300'
            >
              {userName}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};
