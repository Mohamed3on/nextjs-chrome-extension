import { UsersMap } from '@/components/LocationsWrapper';
import { BATCH_SIZE, fetchLocationMappings } from '@/utils/fetchLocationMappings';
import { addAddressParts } from '@/utils/locationProcessing';
import { LocationMapping } from '@/utils/locationTypes';
import { getCachedLocationMapping, setCachedLocationMapping } from '@/utils/mappingStorage';

export const getMappedLocations = async (locations: { [key: string]: UsersMap }) => {
  const locationNames = Object.keys(locations);
  let mappedLocations: { [key: string]: UsersMap } = {};
  let locationNamesToFetch: string[] = [];
  const locationToTypeMapping: { [key: string]: string } = {};
  const cityToCountryMapping: { [key: string]: string } = {};

  for (const locationName of locationNames) {
    if (locationName === 'Washington D.C.') {
      mappedLocations[locationName] = locations[locationName];
      continue;
    }

    const cachedMapping: LocationMapping | null = await getCachedLocationMapping(locationName);

    if (cachedMapping) {
      mappedLocations = addAddressParts(
        locations[locationName],
        cachedMapping.addressParts,
        mappedLocations,
        locationToTypeMapping,
        cityToCountryMapping
      );
    } else {
      locationNamesToFetch.push(locationName);
    }
  }

  try {
    let batchPromises = [];
    for (let i = 0; i < locationNamesToFetch.length; i += BATCH_SIZE) {
      const batch = locationNamesToFetch.slice(i, i + BATCH_SIZE);
      batchPromises.push(processBatch(batch));
    }

    const batchMappings = await Promise.all(batchPromises);

    // Merge results from all batches
    batchMappings.forEach((batchResult) => {
      Object.keys(batchResult).forEach((locationName) => {
        const locationData = batchResult[locationName];

        const addressParts = locationData.addressParts;

        mappedLocations = addAddressParts(
          locations[locationName],
          addressParts,
          mappedLocations,
          locationToTypeMapping,
          cityToCountryMapping
        );
      });
    });

    return {
      mappedLocations,
      locationToTypeMapping,
      cityToCountryMapping,
    };
  } catch (error) {
    console.warn('Failed to fetch mappings, returning original locations', error);
    return {
      ...locations,
      ...mappedLocations,
    };
  }
};
export const processBatch = async (batch: string[]) => {
  const batchMapping: { [key: string]: LocationMapping } = await fetchLocationMappings(batch);

  for (const location of Object.keys(batchMapping)) {
    await setCachedLocationMapping(location, batchMapping[location]);
  }

  return batchMapping;
};
