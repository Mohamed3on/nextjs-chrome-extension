import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useProContext } from '@/lib/ProContext';
import { useTwitterHandleContext } from '@/lib/StorageContext';
import { trackEvent } from '@/lib/useGoogleAnalytics';
import { DialogClose } from '@radix-ui/react-dialog';
import React from 'react';
import { toast } from 'sonner';

export const ProDialog = ({ onBuyClick }: { onBuyClick?: () => void }) => {
  const { setPro } = useProContext();
  const { twitterHandle } = useTwitterHandleContext();
  return (
    <DialogContent className='sm:max-w-md'>
      <DialogHeader>
        <DialogTitle>
          Get Tribe Finder Pro for <span className='font-extrabold'>50% OFF</span>
        </DialogTitle>
      </DialogHeader>

      <DialogDescription>
        <ul className='list-disc list-inside text-gray-700 space-y-2'>
          <li className='font-bold'>Get an early bird 50% discount</li>
          <li>Access to the Tribe Finder Web App to view your tribe on the go</li>
          <li>Include your lists & their members in your Tribe</li>
          <li>View Sunshine hours for each city</li>
          <li>Run Tribe Finder on unlimited usernames</li>
          <li>Support the indie developers behind Tribe Finder</li>
        </ul>
      </DialogDescription>

      <DialogFooter className='sm:justify-start'>
        <DialogClose asChild>
          <Button
            onClick={async () => {
              toast(
                <p>
                  <span className='font-bold'>Thank you for supporting us!</span> 🎉
                  <br />
                  You now have access to Tribe Finder Pro.
                </p>
              );
              setPro(true);
              onBuyClick?.();
              await trackEvent('pro_dialog_get_pro_button_click', {
                twitterHandle,
              });
            }}
            className='w-full sm:w-auto block'
          >
            {`Get Tribe Finder Pro for `}
            <span className='line-through'>{` $20`}</span>
            {` $10`}
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button
            onClick={async () => {
              await trackEvent('pro_dialog_no_thanks_button_click', {
                twitterHandle,
              });
            }}
            className='w-full sm:w-auto block'
            variant='secondary'
          >
            {`No, thanks`}
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};
