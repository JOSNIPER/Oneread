// Stub: cloud sync removed
const noopManager = {
  startAutoSync: () => {},
  stopAutoSync: () => {},
  pull: async () => [],
  pullMany: async () => new Map(),
};

export const initReplicaSync = () => ({ manager: noopManager });
export const getReplicaSync = () => ({ manager: noopManager });
export const subscribeReplicaSyncReady = (cb: () => void) => {
  cb();
  return () => {};
};
