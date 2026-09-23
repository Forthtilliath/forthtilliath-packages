// Contract shared by the browser (`./client`) and the presign route (`./server`).

export interface PresignRequest {
  key: string;
  contentType: string;
}

export interface PresignResponse {
  /** Presigned URL for the direct `PUT` to the bucket. */
  uploadUrl: string;
  /** Permanent public URL — only for a public bucket. */
  publicUrl?: string;
}

export type PublicPresignResponse = PresignResponse & { publicUrl: string };
