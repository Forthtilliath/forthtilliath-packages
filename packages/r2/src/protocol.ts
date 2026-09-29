// Contract shared by the browser (`./client`) and the presign route (`./server`).

export interface PresignRequest {
  key: string;
  contentType: string;
  /** File size in bytes — required by a presign route that sets `maxSizeBytes`. */
  size?: number;
}

export interface PresignResponse {
  /** Presigned URL for the direct `PUT` to the bucket. */
  uploadUrl: string;
  /** Permanent public URL — only for a public bucket. */
  publicUrl?: string;
}

export type PublicPresignResponse = PresignResponse & { publicUrl: string };
