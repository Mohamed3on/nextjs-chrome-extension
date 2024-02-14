import { useLocationContext } from '@/lib/LocationContext';
import { useEffect, useState } from 'react';

const Sunshine = ({ locationName, className }: { locationName: string; className?: string }) => {
  const [yearlySunshineHours, setYearlySunshineHours] = useState(null);

  const { cityToCountryMapping, locationToTypeMapping } = useLocationContext();

  useEffect(() => {
    let isMounted = true;

    const fetchSunshineHours = async () => {
      const query = `${locationName} site:weather-and-climate.com "On average, the total annual amount of sun is"`;
      const results = await fetch(
        `https://vercel-cors-proxy-nine.vercel.app/api/google?q=${query}`
      ).then((res) => res.json());

      for (const result of results) {
        const matches = result.snippet.match(
          /On average, the total annual amount of sun is (\d+) hours/
        );

        if (matches) {
          setYearlySunshineHours(matches[1]);
          break;
        }
      }
    };

    if (locationToTypeMapping[locationName] === 'city') {
      if (isMounted) fetchSunshineHours();
    }

    return () => {
      isMounted = false;
    };
  }, [locationName, cityToCountryMapping, locationToTypeMapping]);

  return (
    <div>
      {yearlySunshineHours ? (
        <div className={className}>
          <p>{yearlySunshineHours} hours of sunshine per year</p>
        </div>
      ) : null}
    </div>
  );
};

export default Sunshine;
