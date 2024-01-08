declare const chrome: any;
export const readLocalStorage = async (keys: string[] | string) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(keys, function (result) {
      if (Object.keys(result).length === 0) {
        reject();
      }
      resolve(result);
    });
  });
};
