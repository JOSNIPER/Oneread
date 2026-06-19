// Stub: KOSync client
export interface KoSyncProgress {
  progress: number;
  timestamp: number;
}

export class KOSyncClient {
  async push() {}
  async pull() {
    return null;
  }
  async check() {
    return null;
  }
}
