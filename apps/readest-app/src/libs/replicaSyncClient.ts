// Stub: cloud replica sync removed — local-only mode
export interface ReplicaKeyRow {
  saltId: string;
  alg: string;
  salt: string;
  createdAt: string;
}

export class ReplicaSyncClient {
  async push() {
    return [];
  }
  async pull() {
    return [];
  }
  async pullBatch() {
    return [];
  }
  async listReplicaKeys(): Promise<ReplicaKeyRow[]> {
    return [];
  }
  invalidateReplicaKeysCache(): void {}
  async forgetReplicaKeys(): Promise<void> {}
  async createReplicaKey(_alg: string): Promise<ReplicaKeyRow> {
    return { saltId: '', alg: '', salt: '', createdAt: '' };
  }
}

export const replicaSyncClient = new ReplicaSyncClient();
