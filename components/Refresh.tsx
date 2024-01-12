import { Progress } from '@/components/ui/progress';
import React from 'react';

export const Refresh = () => {
  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='flex items-center justify-center'>
      <Progress value={progress} className='w-[60%]' />
    </div>
  );
};
