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
  UAE: 'United Arab Emirates',
  Wien: 'Vienna',
  Roma: 'Rome',
  Köln: 'Cologne',
  Milano: 'Milan',
  España: 'Spain',
  München: 'Munich',
  'Comunidad De Madrid': 'Madrid',
  Bengaluru: 'Bangalore',
  'Sillicon Valley': 'California',
  Nederland: 'Netherlands',
  NL: 'Netherlands',
  '🇳🇱': 'Netherlands',
  'The Netherlands': 'Netherlands',
  Québec: 'Quebec',
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

  // Further process the location string
  return processedLocation
    .replace(/\s*\([^)]*\)/g, '') // Remove content within parentheses
    .replace(/\b\d+k?\b|\b\d+m?\b/gi, '') // Remove numbers and numbers followed by 'k', 'K', 'M', or 'm'
    .split(/\s*(?:via|,|\/|\\|&|\+|\||·|\/\/|\|\||→|•|✈️|➡️)\s*|\s+and\s+/) // Split by delimiters
    .map((l) => {
      if (l.includes('bay area')) {
        return 'california';
      }
      return l.trim();
    })
    .filter((l) => l !== '');
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
