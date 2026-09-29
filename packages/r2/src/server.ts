import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import type { PresignRequest, PresignResponse } from "./protocol.js";

export interface R2Config {
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export function createR2Client({
  endpoint,
  accessKeyId,
  secretAccessKey,
}: R2Config): S3Client {
  return new S3Client({
    region: "auto",
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
    // Disable automatic checksums — R2 rejects x-amz-checksum-* params in presigned PUTs sent by a browser
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });
}

/** Max length of an S3/R2 object key, in UTF-8 bytes. */
const MAX_KEY_BYTES = 1024;

/**
 * Rejects empty or oversized keys, and keys that could escape the expected
 * prefix or confuse a path-based consumer (`..`, leading `/`, backslashes,
 * control characters).
 */
export function isSafeKey(key: string): boolean {
  return (
    !!key &&
    new TextEncoder().encode(key).length <= MAX_KEY_BYTES &&
    !key.includes("..") &&
    !key.startsWith("/") &&
    !key.includes("\\") &&
    // eslint-disable-next-line no-control-regex -- control characters are exactly what's rejected here
    !/[\u0000-\u001f\u007f]/.test(key)
  );
}

/**
 * Content types a browser renders as a document or executes: served from a
 * public bucket, an uploaded file of one of these types is a stored XSS on
 * the bucket's domain. Rejected by default when `publicBaseUrl` is set.
 */
export const ACTIVE_CONTENT_TYPES: readonly string[] = [
  "text/html",
  "application/xhtml+xml",
  "image/svg+xml",
  "text/xml",
  "application/xml",
  "text/javascript",
  "application/javascript",
  "application/ecmascript",
  "text/ecmascript",
];

/** `"Image/PNG; charset=x"` → `"image/png"`, or `null` if not a `type/subtype`. */
function normalizeContentType(contentType: string): string | null {
  // eslint-disable-next-line no-control-regex -- would end up in a signed header
  if (/[\u0000-\u001f\u007f]/.test(contentType)) return null;
  const [essence = ""] = contentType.split(";");
  const normalized = essence.trim().toLowerCase();
  return /^[\w.+-]+\/[\w.+-]+$/.test(normalized) ? normalized : null;
}

/** Matches exact types (`"application/pdf"`) and wildcards (`"image/*"`). */
function matchesContentType(
  contentType: string,
  patterns: readonly string[],
): boolean {
  return patterns.some((pattern) => {
    const normalized = pattern.trim().toLowerCase();
    return normalized.endsWith("/*")
      ? contentType.startsWith(normalized.slice(0, -1))
      : contentType === normalized;
  });
}

export interface Rejection {
  status: number;
  error: string;
}

/** What `authorize` gets besides the key, to decide who may upload what. */
export interface AuthorizeContext {
  /** The incoming presign request (cookies, headers… to identify the caller). */
  request: Request;
  /** The requested content type, normalized (`"image/webp"`). */
  contentType: string;
  /** The declared file size in bytes, when the client sent one. */
  size?: number;
}

export interface PresignHandlerOptions {
  client: S3Client;
  bucket: string;
  /**
   * Access control: returns a rejection, or `null` when the upload is
   * allowed. Only called once the key, content type and size passed the
   * built-in checks.
   */
  authorize: (
    key: string,
    context: AuthorizeContext,
  ) => Promise<Rejection | null>;
  /** Bucket's public base URL; when set, the response includes `publicUrl`. */
  publicBaseUrl?: string;
  /**
   * Content types accepted for upload, exact (`"application/pdf"`) or
   * wildcard (`"image/*"`); anything else gets a 415. When omitted, a public
   * bucket (`publicBaseUrl` set) rejects {@link ACTIVE_CONTENT_TYPES} and a
   * private one accepts any type.
   */
  allowedContentTypes?: readonly string[];
  /**
   * Max file size in bytes. When set, the client must send the file's `size`
   * (the bundled client does) and it gets signed into the URL, so the upload
   * can't exceed it (413 above the limit, 400 without a valid size).
   */
  maxSizeBytes?: number;
  /** Presigned URL lifetime, in seconds. */
  expiresIn?: number;
  onError?: (error: unknown) => Response;
}

function reject(status: number, error: string): Response {
  return Response.json({ error }, { status });
}

/** Route handler (`Request` → `Response`) returning a presigned `PUT` URL. */
export function createPresignHandler({
  client,
  bucket,
  authorize,
  publicBaseUrl,
  allowedContentTypes,
  maxSizeBytes,
  expiresIn = 300,
  onError,
}: PresignHandlerOptions): (request: Request) => Promise<Response> {
  return async (request) => {
    const body = (await request
      .json()
      .catch(() => ({}))) as Partial<PresignRequest>;
    const { key, size } = body;
    if (!key || !body.contentType) return reject(400, "Missing parameters");
    if (!isSafeKey(key)) return reject(400, "Invalid key");

    const contentType = normalizeContentType(body.contentType);
    if (!contentType) return reject(400, "Invalid content type");
    const allowed = allowedContentTypes
      ? matchesContentType(contentType, allowedContentTypes)
      : !publicBaseUrl || !ACTIVE_CONTENT_TYPES.includes(contentType);
    if (!allowed) return reject(415, "Unsupported content type");

    const hasValidSize =
      typeof size === "number" && Number.isSafeInteger(size) && size >= 0;
    if (maxSizeBytes !== undefined) {
      if (!hasValidSize) return reject(400, "Missing or invalid size");
      if (size > maxSizeBytes) return reject(413, "File too large");
    }

    const rejection = await authorize(key, {
      request,
      contentType,
      ...(hasValidSize ? { size } : {}),
    });
    if (rejection) return reject(rejection.status, rejection.error);

    try {
      const uploadUrl = await getSignedUrl(
        client,
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          // Signed as sent (not normalized): the browser's PUT repeats this
          // exact string in its Content-Type header.
          ContentType: body.contentType,
          // Signed into the URL: the upload must match this exact size.
          ...(maxSizeBytes !== undefined ? { ContentLength: size } : {}),
        }),
        {
          expiresIn,
          // Not signed by default: without this, the browser could PUT the
          // file under any Content-Type (e.g. text/html) despite the checks above.
          signableHeaders: new Set(["content-type"]),
        },
      );
      const encodedKey = key.split("/").map(encodeURIComponent).join("/");
      const response: PresignResponse = publicBaseUrl
        ? {
            uploadUrl,
            publicUrl: `${publicBaseUrl.replace(/\/+$/, "")}/${encodedKey}`,
          }
        : { uploadUrl };
      return Response.json(response);
    } catch (e) {
      if (onError) return onError(e);
      console.error("[presign]", e);
      return reject(500, "Presign failed");
    }
  };
}
