// Stub: cloud replica sync removed — local-only mode
export type ReplicaKind = 'dictionary' | 'font' | 'texture' | 'opds_catalog' | 'settings';

export interface UseReplicaPullOpts {
  kinds: readonly ReplicaKind[];
  delayMs?: number;
}

// No-op: all cloud sync disabled
export const useReplicaPull = (_opts: UseReplicaPullOpts): void => {};

export const __resetReplicaPullForTests = (): void => {};
