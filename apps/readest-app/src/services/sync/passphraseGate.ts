// Stub: passphrase gate removed
export type PassphrasePromptKind = 'unlock' | 'create' | 'change';

export const passphraseGate = {
  ensurePassphraseUnlocked: async () => true,
};

export const ensurePassphraseUnlocked = async () => true;
export const setPassphrasePrompter = () => {};
