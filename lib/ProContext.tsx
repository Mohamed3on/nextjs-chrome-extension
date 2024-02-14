/* eslint-disable react/display-name */
import React, { createContext, useContext, useEffect, useState } from 'react';

interface ProContextType {
  isPro: boolean;
  setPro: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProContext = createContext<ProContextType>({} as ProContextType);

export const useProContext = () => useContext(ProContext);

export const ProProvider: React.FC<{ children: React.ReactNode }> = React.memo(function ({
  children,
}) {
  const [isPro, setPro] = useState(false);

  useEffect(() => {
    chrome.storage.local.get('isPro', (result) => {
      const cachedProStatus = result.isPro;
      if (cachedProStatus) {
        setPro(true);
      } else if (!cachedProStatus && isPro) {
        chrome.storage.local.set({ isPro: true });
      }
    });
  }, [isPro]);

  return <ProContext.Provider value={{ isPro, setPro }}>{children}</ProContext.Provider>;
});
