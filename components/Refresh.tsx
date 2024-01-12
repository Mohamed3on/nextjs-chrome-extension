import { Progress } from '@/components/ui/progress';
import React from 'react';

export const Refresh = () => {
  const [progress, setProgress] = React.useState(10);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(33);
    }, 1000);
    const timer2 = setTimeout(() => {
      setProgress(66);
    }, 3000);

    const timer3 = setTimeout(() => {
      setProgress(90);
    }, 5000);

    const timer4 = setTimeout(() => {
      setProgress(100);
    }, 7000);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <div className='flex items-center justify-center flex-col gap-7'>
      <Progress value={progress} className='w-[60%]' />

      <h1 className='text-2xl font-bold text-center text-gray-400'>
        The more people you follow, the longer this may take
      </h1>

      <h2 className='text-xl font-bold text-center text-gray-500'>
        Please wait while we fetch your data (and don&apos;t close the open twitter tab!)
      </h2>
    </div>
  );
};
