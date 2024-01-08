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

// export function normalizeLocation(name) {
//   let _s = name ? name.toLowerCase() : '';

//   // Removal of specific substrings
//   _s = removeSubstr(_s);

//   if (
//     [
//       'home',
//       'subscribe',
//       '.com',
//       '.net',
//       '.org',
//       '.eth',
//       'solana',
//       'blue/green sphere',
//       'pale blue dot',
//       'zoom',
//       'newsletter',
//       'free',
//       '.ai',
//       'everywhere',
//       'online',
//     ].some((sub) => _s.includes(sub))
//   )
//     return '';

//   // Complex string processing
//   _s = _s.replace(/ \([^)]*\)/g, ''); // Remove anything in parentheses
//   _s = _s.replace(/( bay)? area$/gi, ''); // Handle "bay area"
//   _s = _s.split(/\/| and |\||→|·|•|✈️/).pop();
//   _s = _s.split('➡️').pop();
//   _s = _s.replace(/,$/g, ''); // Remove trailing comma
//   _s = _s.replace(/[^a-zA-Z,]/g, ' '); // Replace non-letter/non-comma with space
//   _s = _s.trim();

//   return _s;
// }

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
};

export function consolidateDuplicates(data) {
  const consolidated_data = {};
  for (const item of data) {
    const [key, value] = item;
    // Map to representative if duplicate

    const mappedKey = duplicate_mapping[key] || key;
    if (mappedKey in consolidated_data) {
      consolidated_data[mappedKey] += value;
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
    /home|subscribe|\.com|\.net|\.org|\.eth|solana|sphere|zoom|join|sign up|ethereum|👉|newsletter|free|\.ai|everywhere|online|⬇️|127\.0\.0\.1|they\/them|he\/him|http|she\/her|earth|worldwide|global|🟩|internet|ios|🌴|🍁|\bhere\b|\d+°|🇪🇺|cloud|future|moon|web|network/;

  // Early return for irrelevant locations
  if (irrelevantRegex.test(lowerCaseLocation)) {
    return null;
  }

  const matchRegex = /🇪🇺/;

  if (matchRegex.test(lowerCaseLocation)) {
    console.log('matchRegex', lowerCaseLocation);
  }

  // Remove specific terms
  const removeRegex = /europe|the?\s*world|🌎|🌍|🌏|🌐|☁️/;
  let processedLocation = lowerCaseLocation.replace(removeRegex, '');

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

export const processLocations = (locations: {}) => {
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
          locations[location] += 1;
        } else {
          locations[location] = 1;
        }
      });
    }
  });
  return locations;
};
