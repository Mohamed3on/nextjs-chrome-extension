import React from 'react';

export const NavBar = ({ userName }: { userName: string }) => {
  return (
    <div className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mb-4'>
      <nav className='flex justify-between items-center p-4'>
        <div className='flex items-center'>
          <img
            src='/logo.svg'
            alt='Logo'
            onClick={() => {
              window.location.href = '/index.html';
            }}
            className='h-10 w-10 hover:opacity-80 transition-opacity ease-in-out duration-300 cursor-pointer'
          />
        </div>

        <div>
          <div className='flex items-center text-base'>
            <a
              href='#config'
              className='hover:text-foreground/80 text-foreground/60 transition-colors ease-in-out duration-200'
            >
              {userName}
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
};
