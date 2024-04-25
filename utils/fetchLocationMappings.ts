export const API_URL = 'https://location-coords-cache.vercel.app/api/';
export const BATCH_SIZE = 40;

export const fetchLocationMappings = async (locations) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ placeNames: locations }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Failed to load data:', error);
    return null;
  }
};
