import { useProContext } from '@/lib/ProContext';
import React from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';

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
            <Dialog>
              <DialogTrigger>
                <span className='bg-green-500 text-white font-semibold rounded-full px-2.5 py-0.5 shine-on-hover cursor-pointer'>
                  GO PRO
                </span>
              </DialogTrigger>
              <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                  <DialogTitle>Share link</DialogTitle>
                  <DialogDescription>
                    Anyone who has this link will be able to view this.
                  </DialogDescription>
                </DialogHeader>
                <div className='flex items-center space-x-2'>
                  <div className='grid flex-1 gap-2'>
                    <Label htmlFor='link' className='sr-only'>
                      Link
                    </Label>
                    <Input
                      id='link'
                      defaultValue='https://ui.shadcn.com/docs/installation'
                      readOnly
                    />
                  </div>
                </div>
                <DialogFooter className='sm:justify-start'>
                  <DialogClose asChild>
                    <Button type='button' variant='secondary'>
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </nav>
    </div>
  );
};
