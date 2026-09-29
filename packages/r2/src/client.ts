import type { PresignRequest, PresignResponse } from "./protocol.js";

/** Bytes sent so far, out of `total` (the body's size). */
export interface UploadProgress {
  loaded: number;
  total: number;
}

export interface UploadOptions {
  file: File;
  key: string;
  /** Presign route, called with `POST` (e.g. `/api/r2/presign-upload`). */
  endpoint: string;
  /** Transformation applied before upload (e.g. image compression). */
  transform?: (file: File) => Promise<File>;
  /** Aborts the presign request and the upload. */
  signal?: AbortSignal;
  /**
   * Called as the file is sent to the bucket, e.g. for a progress bar
   * (`loaded / total`). The upload then goes through `XMLHttpRequest`, since
   * `fetch` doesn't report upload progress.
   */
  onProgress?: (progress: UploadProgress) => void;
}

/**
 * Uploads a file straight from the browser to an S3/R2 bucket via a presigned URL.
 * The file never goes through the app server (Vercel rejects request bodies > 4.5 MB).
 * Requires a CORS rule on the bucket allowing `PUT` from the site's origin.
 */
export async function uploadViaPresignedUrl<
  R extends PresignResponse = PresignResponse,
>({
  file,
  key,
  endpoint,
  transform,
  signal,
  onProgress,
}: UploadOptions): Promise<R> {
  const body = transform ? await transform(file) : file;
  const contentType = body.type || "application/octet-stream";
  // `size` lets a presign route enforce `maxSizeBytes`; ignored otherwise.
  const presignRequest: PresignRequest = { key, contentType, size: body.size };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(presignRequest),
    signal,
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error ?? `Presign failed (${res.status})`);
  }

  const presign = (await res.json()) as R;
  const put = { url: presign.uploadUrl, body, contentType, signal };
  const status = onProgress
    ? await putWithProgress({ ...put, onProgress })
    : (
        await fetch(put.url, {
          method: "PUT",
          headers: { "Content-Type": contentType },
          body,
          signal,
        })
      ).status;
  if (status < 200 || status >= 300) {
    throw new Error(`Upload failed (${status})`);
  }

  return presign;
}

interface ProgressPut {
  url: string;
  body: File;
  contentType: string;
  signal?: AbortSignal;
  onProgress: (progress: UploadProgress) => void;
}

/** A `PUT` through `XMLHttpRequest`, reporting upload progress; resolves the status. */
function putWithProgress({
  url,
  body,
  contentType,
  signal,
  onProgress,
}: ProgressPut): Promise<number> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortReason(signal));
      return;
    }
    const xhr = new XMLHttpRequest();
    const abort = () => {
      xhr.abort();
    };

    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.upload.onprogress = (event) => {
      onProgress({
        loaded: event.loaded,
        total: event.lengthComputable ? event.total : body.size,
      });
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress({ loaded: body.size, total: body.size });
      }
      resolve(xhr.status);
    };
    xhr.onerror = () => {
      reject(new Error("Upload failed (network error)"));
    };
    xhr.onabort = () => {
      reject(abortReason(signal));
    };
    xhr.onloadend = () => {
      signal?.removeEventListener("abort", abort);
    };
    signal?.addEventListener("abort", abort, { once: true });
    xhr.send(body);
  });
}

/** Like `fetch` on abort: the signal's reason (when an Error), else an `AbortError`. */
function abortReason(signal: AbortSignal | undefined): Error {
  const reason: unknown = signal?.reason;
  return reason instanceof Error
    ? reason
    : new DOMException("Upload aborted", "AbortError");
}
