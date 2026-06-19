// Stub: sync adapter removed
export const settingsAdapter = { kind: 'settings' as const };
export type SettingsRemoteRecord = {
  name: string;
  patch: Record<string, unknown>;
  lastSeenCipher: string | null;
};
