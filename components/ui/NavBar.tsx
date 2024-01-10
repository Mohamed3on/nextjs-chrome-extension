import React from 'react';

export const NavBar = () => {
  return (
    <div className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mb-4'>
      <nav className='p-4'>
        <ul className='flex space-x-4 justify-center text-base'>
          <li>
            <a
              href='#all_locations'
              className='hover:text-foreground/80 text-foreground/60 cursor-pointer'
            >
              Locations
            </a>
          </li>
          <li>
            <a href='#config' className='hover:text-foreground/80 text-foreground/60'>
              Config
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};
