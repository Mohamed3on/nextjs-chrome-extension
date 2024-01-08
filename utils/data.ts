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
  CA: 'California',
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
};

export function consolidateDuplicates(data) {
  const consolidated_data = {};
  for (const [key, value] of data) {
    const mappedKey = duplicate_mapping[key] || key;
    if (mappedKey in consolidated_data) {
      consolidated_data[mappedKey] = new Set([...consolidated_data[mappedKey], ...value]);
    } else {
      consolidated_data[mappedKey] = value;
    }
  }
  return consolidated_data;
}

export const mergeMultipleLocations = (locations) => {
  const mergedLocations = {};

  locations.forEach((location) => {
    Object.entries(location).forEach(([key, value]) => {
      if (mergedLocations[key]) {
        mergedLocations[key] += value;
      } else {
        mergedLocations[key] = value;
      }
    });
  });

  return mergedLocations;
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

  const matchRegex = /🇪🇺/;

  if (matchRegex.test(lowerCaseLocation)) {
    console.log('matchRegex', lowerCaseLocation);
  }

  // Remove specific terms
  const removeRegex = /europe|(?:the\s+)?world|🌎|🌍|🌏|🌐|☁️|!/g;

  let processedLocation = lowerCaseLocation.replace(removeRegex, '');

  // check for world OR remote OR !
  const worldRegex = /!/;

  if (worldRegex.test(processedLocation)) {
    console.log(processedLocation, location, 'check this out');
  }

  // Handle coordinates
  const coords = processedLocation.match(/-?\d+\.\d+,-?\d+\.\d+/g);
  if (coords) {
    return coords;
  }

  // Further process the location string
  return processedLocation
    .replace(/\s*\([^)]*\)/g, '') // Remove content within parentheses
    .replace(/\b\d+k?\b|\b\d+m?\b/gi, '') // Remove numbers and numbers followed by 'k', 'K', 'M', or 'm'
    .split(/\s*(?:via|,|\/|\\|&|\+|\||·|\/\/|\|\||→|•|✈️|➡️)\s*|\s+and\s+/) // Split by delimiters
    .map((l) => {
      if (l.includes('bay area')) {
        return 'san francisco';
      }
      return l.trim();
    })
    .filter((l) => l !== '');
};

export const processLocations = (
  users: {
    location: string;
  }[]
) => {
  const locations = addLocations(users);
  const titledLocations = Object.fromEntries(
    Object.entries(locations).map(([k, v]) => [titleCaseWithAcronyms(k), v])
  );

  const consolidated = consolidateDuplicates(Object.entries(titledLocations));

  return consolidated;
};

export const addLocations = (theList) => {
  const locations = {};
  theList.forEach((member) => {
    if (member.location && member.location !== '') {
      const processedLocations = processLocation(member.location);

      processedLocations?.forEach((location) => {
        if (locations[location]) {
          locations[location].add(member.screen_name);
        } else {
          locations[location] = new Set([member.screen_name]);
        }
      });
    }
  });
  return locations;
};
