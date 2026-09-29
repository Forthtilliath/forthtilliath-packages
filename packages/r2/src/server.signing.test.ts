import { describe, expect, it } from "vitest";

import { createPresignHandler, createR2Client } from "./server.js";

// Uses the real AWS presigner (fake credentials, no network): checks which
// headers actually end up in the signature, which the mocked tests can't.
const client = createR2Client({
  endpoint: "https://account.r2.cloudflarestorage.com",
  accessKeyId: "id",
  secretAccessKey: "secret",
});

async function signedHeaders(body: object, maxSizeBytes?: number) {
  const handler = createPresignHandler({
    client,
    bucket: "b",
    authorize: () => Promise.resolve(null),
    ...(maxSizeBytes !== undefined ? { maxSizeBytes } : {}),
  });
  const request = new Request("http://localhost/presign", {
    method: "POST",
    body: JSON.stringify(body),
  });
  const { uploadUrl } = (await (await handler(request)).json()) as {
    uploadUrl: string;
  };
  return new URL(uploadUrl).searchParams.get("X-Amz-SignedHeaders");
}

describe("presigned URL signature", () => {
  it("covers Content-Type, so the upload can't switch to another type", async () => {
    expect(
      await signedHeaders({ key: "a.webp", contentType: "image/webp" }),
    ).toBe("content-type;host");
  });

  it("also covers Content-Length when maxSizeBytes is set", async () => {
    expect(
      await signedHeaders(
        { key: "a.webp", contentType: "image/webp", size: 10 },
        100,
      ),
    ).toBe("content-length;content-type;host");
  });
});
