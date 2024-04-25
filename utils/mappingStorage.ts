import { LocationMapping } from './locationTypes';

export const getCachedLocationMapping = async (key: string): Promise<LocationMapping | null> => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result[key] ? (result[key] as LocationMapping) : null);
      }
    });
  });
};

export const setCachedLocationMapping = async (
  key: string,
  value: LocationMapping
): Promise<void> => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [key]: value }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
};
