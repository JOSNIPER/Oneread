'use client';

import React, { createContext, useContext } from 'react';

// Stub: cloud sync removed
interface SyncContextType {
  syncClient: null;
}

const SyncContext = createContext<SyncContextType>({ syncClient: null });

export const useSyncContext = () => useContext(SyncContext);

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <SyncContext.Provider value={{ syncClient: null }}>{children}</SyncContext.Provider>;
};
