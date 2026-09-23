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

/** Rejects empty keys and keys that could escape the expected prefix. */
export function isSafeKey(key: string): boolean {
  return (
    !!key && !key.includes("..") && !key.startsWith("/") && !key.includes("\0")
  );
}

export interface Rejection {
  status: number;
  error: string;
}

export interface PresignHandlerOptions {
  client: S3Client;
  bucket: string;
  /** Access control: returns a rejection, or `null` when the key is allowed. */
  authorize: (key: string) => Promise<Rejection | null>;
  /** Bucket's public base URL; when set, the response includes `publicUrl`. */
  publicBaseUrl?: string;
  /** Presigned URL lifetime, in seconds. */
  expiresIn?: number;
  onError?: (error: unknown) => Response;
}

/** Route handler (`Request` → `Response`) returning a presigned `PUT` URL. */
export function createPresignHandler({
  client,
  bucket,
  authorize,
  publicBaseUrl,
  expiresIn = 300,
  onError,
}: PresignHandlerOptions): (request: Request) => Promise<Response> {
  return async (request) => {
    const { key, contentType } = (await request
      .json()
      .catch(() => ({}))) as Partial<PresignRequest>;
    if (!key || !contentType) {
      return Response.json({ error: "Missing parameters" }, { status: 400 });
    }
    if (!isSafeKey(key)) {
      return Response.json({ error: "Invalid key" }, { status: 400 });
    }

    const rejection = await authorize(key);
    if (rejection) {
      return Response.json(
        { error: rejection.error },
        { status: rejection.status },
      );
    }

    try {
      const uploadUrl = await getSignedUrl(
        client,
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          ContentType: contentType,
        }),
        { expiresIn },
      );
      const body: PresignResponse = publicBaseUrl
        ? {
            uploadUrl,
            publicUrl: `${publicBaseUrl.replace(/\/+$/, "")}/${key}`,
          }
        : { uploadUrl };
      return Response.json(body);
    } catch (e) {
      if (onError) return onError(e);
      console.error("[presign]", e);
      return Response.json({ error: "Presign failed" }, { status: 500 });
    }
  };
}
