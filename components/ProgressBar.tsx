import { Progress } from '@/components/ui/progress';
import React from 'react';

export function ProgressBar() {
  const [progress, setProgress] = React.useState(5);

  React.useEffect(() => {
    const progressSteps = [10, 20, 33, 45, 66, 75, 80, 90, 95, 97, 99, 100];
    let currentStep = 0;

    const timer = setInterval(() => {
      setProgress(progressSteps[currentStep]);
      currentStep++;

      if (currentStep === progressSteps.length) {
        clearInterval(timer);
      }
    }, 2500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return <Progress value={progress} className='w-[60%]' />;
}
