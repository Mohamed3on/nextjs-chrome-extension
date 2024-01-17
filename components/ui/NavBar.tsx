import { useProContext } from '@/lib/ProContext';
import React from 'react';

export const NavBar = ({ userName }: { userName: string }) => {
  const { isPro } = useProContext();

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
          {isPro ? (
            <div className='flex items-center text-base'>
              <a
                href='#config'
                className='hover:text-foreground/80 text-foreground/60 transition-colors ease-in-out duration-200'
              >
                {userName}
              </a>
              <span className='ml-2 inline-block bg-pink-400 text-xs text-white font-semibold rounded-full px-2.5 py-0.5'>
                PRO
              </span>
              :
            </div>
          ) : (
            <a
              href='https://tribefinder.app'
              target='_blank'
              rel='noopener noreferrer'
              className='bg-green-500 text-white font-semibold rounded-full px-2.5 py-0.5 shine-on-hover cursor-pointer'
            >
              GO PRO
            </a>
          )}
        </div>
      </nav>
    </div>
  );
};
