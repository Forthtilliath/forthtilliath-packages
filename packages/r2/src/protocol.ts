// Contract shared by the browser (`./client`) and the presign route (`./server`).

/** Body the client sends (`POST`, JSON) to the presign route. */
export interface PresignRequest {
  /** Object key in the bucket. */
  key: string;
  /**
   * The file's MIME type, signed into the URL: the bucket rejects a `PUT` with
   * another `Content-Type`.
   */
  contentType: string;
  /**
   * File size in bytes — required by a presign route that sets `maxSizeBytes`.
   */
  size?: number;
}

/** Body the presign route answers with (`200`, JSON). */
export interface PresignResponse {
  /** Presigned URL for the direct `PUT` to the bucket. */
  uploadUrl: string;
  /** Permanent public URL — only for a public bucket. */
  publicUrl?: string;
}

/**
 * {@link PresignResponse} of a route configured with `publicBaseUrl`:
 * `publicUrl` is always there.
 */
export type PublicPresignResponse = PresignResponse & { publicUrl: string };
