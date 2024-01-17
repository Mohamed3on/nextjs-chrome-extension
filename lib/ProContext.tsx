/* eslint-disable react/display-name */
import React, { createContext, useContext } from 'react';

interface ProContextType {
  isPro: boolean;
}

const ProContext = createContext<ProContextType>({ isPro: true });

export const useProContext = () => useContext(ProContext);

export const ProProvider: React.FC<{ children: React.ReactNode }> = React.memo(function ({
  children,
}) {
  return <ProContext.Provider value={{ isPro: true }}>{children}</ProContext.Provider>;
});
