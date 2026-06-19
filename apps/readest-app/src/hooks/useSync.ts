// Stub: cloud sync removed
export const useSync = (_bookKey?: string) => ({
  syncBooks: async () => {},
  syncConfigs: async () => {},
  syncNotes: async () => {},
  syncedConfigs: null as null,
  syncedNotes: null as null,
  lastSyncedAtNotes: 0,
  lastSyncedAtConfigs: 0,
  isSyncCategoryEnabled: () => false,
});
