import React, { useEffect, useState } from 'react';
import { GOOGLE_IMG_SCRAP } from 'google-img-scrap';
import { cn } from '@/lib/utils';

const LocationImage = ({
  locationName,
  minHeight = 600,
  className,
}: {
  locationName: string;
  minHeight?: number;
  className?: string;
}) => {
  const [image, setImage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (locationName) {
        const images = await GOOGLE_IMG_SCRAP({
          search: locationName,
        });
        // Get the first image that's taller than the given min height:
        const foundImage = images.result.find((img) => img.height > minHeight);
        setImage(foundImage.url);
      }
    };

    fetchData();
  }, [locationName, minHeight]);

  if (!image) {
    return <div>Loading...</div>; // Or any other placeholder content
  }

  return <img src={image} alt={locationName} className={cn('w-full object-cover', className)} />;
};

export default LocationImage;
