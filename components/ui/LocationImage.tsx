import React, { useEffect, useState } from 'react';
import { GOOGLE_IMG_SCRAP } from 'google-img-scrap';
import { cn } from '@/lib/utils';

const minWidth = 600;
const minHeight = 400;

const LocationImage = ({
  locationName,
  className,
}: {
  locationName: string;
  className?: string;
}) => {
  const [image, setImage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (locationName) {
        const images = await GOOGLE_IMG_SCRAP({
          search: `${locationName}`,
          limit: 10,
        });
        // Get the first image that's taller than the given min height:
        const foundImage = images.result.find(
          (img) => img.width > minWidth && img.height > minHeight
        );
        setImage(foundImage.url);
      }
    };

    fetchData();
  }, [locationName]);

  if (!image) {
    return <div>Loading...</div>; // Or any other placeholder content
  }

  return <img src={image} alt={locationName} className={cn('w-full object-cover', className)} />;
};

export default LocationImage;
