import type { PresignRequest, PresignResponse } from "./protocol.js";

export interface UploadOptions {
  file: File;
  key: string;
  /** Presign route, called with `POST` (e.g. `/api/r2/presign-upload`). */
  endpoint: string;
  /** Transformation applied before upload (e.g. image compression). */
  transform?: (file: File) => Promise<File>;
}

/**
 * Uploads a file straight from the browser to an S3/R2 bucket via a presigned URL.
 * The file never goes through the app server (Vercel rejects request bodies > 4.5 MB).
 * Requires a CORS rule on the bucket allowing `PUT` from the site's origin.
 */
export async function uploadViaPresignedUrl<
  R extends PresignResponse = PresignResponse,
>({ file, key, endpoint, transform }: UploadOptions): Promise<R> {
  const body = transform ? await transform(file) : file;
  const contentType = body.type || "application/octet-stream";
  const presignRequest: PresignRequest = { key, contentType };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(presignRequest),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error ?? `Presign failed (${res.status})`);
  }

  const presign = (await res.json()) as R;
  const upload = await fetch(presign.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body,
  });
  if (!upload.ok) throw new Error(`Upload failed (${upload.status})`);

  return presign;
}
