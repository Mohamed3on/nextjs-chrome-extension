import { UsersMap } from '@/components/LocationsWrapper';

export function titleCaseWithAcronyms(str) {
  // If the location is an acronym, Uppercase it (SF, USA, UK, etc.)
  if (str.length <= 3) {
    return str.toUpperCase();
  }
  const newStr = str
    .split(' ')
    .map((word) => {
      // Otherwise, title case the location
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');

  return newStr;
}

const duplicate_mapping = {
  // CA: 'California',
  California: 'CA',
  NY: 'New York',
  NYC: 'New York',
  TX: 'Texas',
  WA: 'Washington',
  UK: 'United Kingdom',
  MA: 'Massachusetts',
  FL: 'Florida',
  DC: 'Washington D.C.',
  'D.c.': 'Washington D.C.',
  USA: 'United States',
  SF: 'San Francisco',
  PA: 'Pennsylvania',
  CO: 'Colorado',
  VA: 'Virginia',
  IL: 'Illinois',
  TN: 'Tennessee',
  LA: 'Los Angeles',
  AZ: 'Arizona',
  NC: 'North Carolina',
  OR: 'Oregon',
  MD: 'Maryland',
  GA: 'Georgia',
  CT: 'Connecticut',
  MO: 'Missouri',
  'New York City': 'New York',
  AMS: 'Amsterdam',
  BCN: 'Barcelona',
  BER: 'Berlin',
  '🇺🇸': 'United States',
  '🇬🇧': 'United Kingdom',
  '🇸🇬': 'Singapore',
  MI: 'Michigan',
  NJ: 'New Jersey',
  UT: 'Utah',
  US: 'United States',
  OH: 'Ohio',
  'Washington Dc': 'Washington D.C.',
  MN: 'Minnesota',
  Montréal: 'Montreal',
  BC: 'British Columbia',
  NV: 'Nevada',
  Deutschland: 'Germany',
  RI: 'Rhode Island',
  ATL: 'Atlanta',
  WI: 'Wisconsin',
  VT: 'Vermont',
  KSA: 'Saudi Arabia',
  AR: 'Arkansas',
  PNW: 'Pacific Northwest',
  KY: 'Kentucky',
  NZ: 'New Zealand',
  AU: 'Australia',
  NE: 'Nebraska',
  BLR: 'Bangalore',
  ON: 'Ontario',
  '🇨🇦': 'Canada',
  '🇩🇪': 'Germany',
  '🇪🇬': 'Egypt',
  Polska: 'Poland',
  'New York Ny': 'New York',
  'Ma Usa': 'Massachusetts',
  UAE: 'United Arab Emirates',
  Wien: 'Vienna',
  Roma: 'Rome',
  Köln: 'Cologne',
  Milano: 'Milan',
  España: 'Spain',
  München: 'Munich',
  'Comunidad De Madrid': 'Madrid',
  Bengaluru: 'Bangalore',
  Nederland: 'Netherlands',
  NL: 'Netherlands',
  '🇳🇱': 'Netherlands',
  'The Netherlands': 'Netherlands',
  Québec: 'Quebec',
  MT: 'Montana',
  DET: 'Detroit',
  IN: 'Indiana',
  ATX: 'Austin',
  SD: 'San Diego',
  BK: 'Brooklyn',
  Cdmx: 'Mexico City',
  America: 'United States',
  NH: 'New Hampshire',
  Lisboa: 'Lisbon',
  'Ciudad De México': 'Mexico City',
  OK: 'Oklahoma',
  Warszawa: 'Warsaw',
};

export function consolidateDuplicates(data) {
  const consolidatedData = {};

  for (const [key, valueObj] of Object.entries(data)) {
    const mappedKey = duplicate_mapping[key] || key;

    if (!consolidatedData[mappedKey]) {
      consolidatedData[mappedKey] = {};
    }

    Object.assign(consolidatedData[mappedKey], valueObj);
  }

  return consolidatedData;
}

const getLocationParts = (location, alsoSplitComma = true) => {
  const splitRegex = alsoSplitComma
    ? /\s*(?:via|,|\/|\\|&|\+|\||·|\/\/|\|\||→|•|✈️|➡️)\s*|\s+and\s+/
    : /\s*(?:via|\/|\\|&|\+|\||·|\/\/|\|\||→|•|✈️|➡️)\s*|\s+and\s+/;
  return location
    .replace(/\s*\([^)]*\)/g, '') // Remove content within parentheses
    .replace(/\b\d+k?\b|\b\d+m?\b/gi, '') // Remove numbers and numbers followed by 'k', 'K', 'M', or 'm'
    .split(splitRegex) // Split by delimiters
    .map((l) => {
      if (l.includes('bay area') || l.includes('silicon valley')) {
        return 'california';
      }
      return l.trim();
    })
    .filter((l) => l !== '');
};

export const processLocation = (location: string) => {
  const lowerCaseLocation = location.toLowerCase();

  // Combine irrelevant substrings into a single regex for efficiency
  const irrelevantRegex =
    /home|subscribe|\.com|\.net|\.org|\.eth|solana|sphere|zoom|join|sign up|ethereum|👉|newsletter|free|\.ai|everywhere|online|⬇️|127\.0\.0\.1|they\/them|he\/him|http|she\/her|earth|worldwide|global|🟩|internet|ios|🌴|🍁|\bhere\b|\d+°|🇪🇺|cloud|future|moon|web|network|remote|international|youtube|metaverse|monday|crypto|space|anywhere|beyond/;

  // Early return for irrelevant locations
  if (irrelevantRegex.test(lowerCaseLocation)) {
    return null;
  }

  // Remove specific terms
  const removeRegex = /europe|(?:the\s+)?world|🌎|🌍|🌏|🌐|☁️|!/g;

  let processedLocation = lowerCaseLocation.replace(removeRegex, '');

  // Handle coordinates
  const coords = processedLocation.match(/-?\d+\.\d+,-?\d+\.\d+/g);
  if (coords) {
    return coords;
  }

  if (processedLocation.includes('washington, ')) {
    return ['washington dc'];
  }

  // Further process the location string
  return getLocationParts(processedLocation, true);
};

export const processLocations = (users) => {
  const locations = addLocations(users);

  const titledLocations = {};

  for (let location in locations) {
    titledLocations[titleCaseWithAcronyms(location)] = locations[location];
  }

  const consolidated = consolidateDuplicates(titledLocations);

  return consolidated;
};

export const addLocations = (theList) => {
  const locations = {};

  theList.forEach((member) => {
    if (member.location && member.location !== '') {
      const processedLocations = processLocation(member.location);

      processedLocations?.forEach((location) => {
        if (!locations[location]) {
          locations[location] = {};
        }
        locations[location][member.screen_name] = member;
      });
    }
  });

  return locations;
};

const getCachedLocationMapping = async (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result[key]);
      }
    });
  });
};

const setCachedLocationMapping = (key, value) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [key]: value }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(true);
      }
    });
  });
};

const fetchLocationMapping = async (location) => {
  const queryParams = new URLSearchParams({
    types: 'country,region,locality,district,place',
    access_token:
      'pk.eyJ1IjoibW9oYW1lZDNvbiIsImEiOiJjbHJlczV6M3ExbGR6MnV2eDc3aXQxNGFtIn0.-vM88zzygjbSRdf_BD6l1Q',
  });

  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?${queryParams}`
  );
  const data = await response.json();

  if (!data.features || data.features.length === 0) {
    return null;
  }
  const firstMatch = data.features[0];
  const components = [firstMatch?.text];

  if (firstMatch?.context)
    for (const component of firstMatch.context) {
      if (!component.id.includes('district')) {
        components.push(component.text);
      }
    }
  return components;
};

export const getMappedLocations = async (locations: { [key: string]: UsersMap }) => {
  const mappedLocations = {};

  for (const [key, valueObj] of Object.entries(locations)) {
    if (key === 'Washington D.C.') {
      mappedLocations[key] = valueObj;
      continue;
    }
    let placeNameParts = await getCachedLocationMapping(key);

    if (!placeNameParts) {
      console.log(`Fetching mapping for ${key}`);

      try {
        placeNameParts = await fetchLocationMapping(key);
        if (placeNameParts) {
          await setCachedLocationMapping(key, placeNameParts);
        } else {
          console.log(`No place name found for ${key}`);
          await setCachedLocationMapping(key, [key]);

          mappedLocations[key] = valueObj;
          continue;
        }
      } catch (error) {
        console.error(`Error fetching location data for ${key}: ${error}`);
        mappedLocations[key] = valueObj;
        continue;
      }
    } else {
      console.log(`Using cached mapping for ${key}`);
    }

    for (const placeNamePart of placeNameParts as string[]) {
      if (!mappedLocations[placeNamePart]) {
        mappedLocations[placeNamePart] = valueObj;
      } else {
        mappedLocations[placeNamePart] = {
          ...mappedLocations[placeNamePart],
          ...valueObj,
        };
      }
    }
  }

  return mappedLocations;
};
