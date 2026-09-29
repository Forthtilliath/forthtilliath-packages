import type { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: vi.fn(() => Promise.resolve("https://r2.test/signed")),
}));

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { createPresignHandler, type PresignHandlerOptions } from "./server.js";

const client = {} as S3Client;
const allow = () => Promise.resolve(null);

function post(body: unknown): Request {
  return new Request("http://localhost/presign", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

function handler(options: Partial<PresignHandlerOptions> = {}) {
  return createPresignHandler({
    client,
    bucket: "b",
    authorize: allow,
    ...options,
  });
}

/** Input of the `PutObjectCommand` passed to the n-th presign call. */
function presignedInput(index = 0) {
  const command = vi.mocked(getSignedUrl).mock.calls[index]?.[1] as
    PutObjectCommand | undefined;
  return command?.input;
}

beforeEach(() => {
  vi.mocked(getSignedUrl).mockClear();
});

describe("createPresignHandler — content type", () => {
  it("signs the Content-Type header, as sent by the client", async () => {
    await handler()(post({ key: "a.webp", contentType: "image/webp" }));
    expect(presignedInput()?.ContentType).toBe("image/webp");
    const options = vi.mocked(getSignedUrl).mock.calls[0]?.[2];
    expect(options?.signableHeaders).toEqual(new Set(["content-type"]));
  });

  it.each([
    "text/html",
    "image/svg+xml",
    "TEXT/HTML; charset=utf-8",
    "application/javascript",
  ])(
    "rejects active content %j on a public bucket, before authorize",
    async (contentType) => {
      const authorize = vi.fn(allow);
      const res = await handler({
        publicBaseUrl: "https://cdn.test",
        authorize,
      })(post({ key: "a", contentType }));
      expect(res.status).toBe(415);
      expect(authorize).not.toHaveBeenCalled();
      expect(getSignedUrl).not.toHaveBeenCalled();
    },
  );

  it("accepts any type on a private bucket by default", async () => {
    const res = await handler()(
      post({ key: "a.html", contentType: "text/html" }),
    );
    expect(res.status).toBe(200);
  });

  it("only accepts allowedContentTypes (exact or wildcard) when set", async () => {
    const h = handler({ allowedContentTypes: ["image/*", "application/pdf"] });
    expect((await h(post({ key: "a", contentType: "image/png" }))).status).toBe(
      200,
    );
    expect(
      (await h(post({ key: "a", contentType: "application/pdf" }))).status,
    ).toBe(200);
    expect(
      (await h(post({ key: "a", contentType: "audio/mpeg" }))).status,
    ).toBe(415);
  });

  it("lets allowedContentTypes opt a public bucket into an active type", async () => {
    const res = await handler({
      publicBaseUrl: "https://cdn.test",
      allowedContentTypes: ["image/svg+xml"],
    })(post({ key: "logo.svg", contentType: "image/svg+xml" }));
    expect(res.status).toBe(200);
  });

  it.each(["nope", "image/png\r\nx-evil: 1", ""])(
    "returns 400 on a malformed content type %j",
    async (contentType) => {
      const res = await handler()(post({ key: "a", contentType }));
      expect(res.status).toBe(400);
    },
  );
});

describe("createPresignHandler — size", () => {
  it("returns 400 without a valid size when maxSizeBytes is set", async () => {
    const h = handler({ maxSizeBytes: 100 });
    for (const size of [undefined, -1, 1.5, "10"]) {
      const res = await h(post({ key: "a", contentType: "image/png", size }));
      expect(res.status).toBe(400);
    }
  });

  it("returns 413 above maxSizeBytes, before authorize", async () => {
    const authorize = vi.fn(allow);
    const res = await handler({ maxSizeBytes: 100, authorize })(
      post({ key: "a", contentType: "image/png", size: 101 }),
    );
    expect(res.status).toBe(413);
    expect(authorize).not.toHaveBeenCalled();
  });

  it("signs the exact size into the URL when maxSizeBytes is set", async () => {
    await handler({ maxSizeBytes: 100 })(
      post({ key: "a", contentType: "image/png", size: 100 }),
    );
    expect(presignedInput()?.ContentLength).toBe(100);
  });

  it("doesn't sign a size without maxSizeBytes", async () => {
    await handler()(post({ key: "a", contentType: "image/png", size: 100 }));
    expect(presignedInput()?.ContentLength).toBeUndefined();
  });
});

describe("createPresignHandler — authorize and publicUrl", () => {
  it("passes the request, normalized content type and size to authorize", async () => {
    const authorize = vi.fn<PresignHandlerOptions["authorize"]>(allow);
    const request = post({ key: "a", contentType: "Image/PNG", size: 42 });
    await handler({ authorize })(request);
    expect(authorize).toHaveBeenCalledWith("a", {
      request,
      contentType: "image/png",
      size: 42,
    });
  });

  it("URL-encodes each key segment in publicUrl", async () => {
    const res = await handler({ publicBaseUrl: "https://cdn.test" })(
      post({ key: "docs/mon fichier#1.pdf", contentType: "application/pdf" }),
    );
    expect(await res.json()).toMatchObject({
      publicUrl: "https://cdn.test/docs/mon%20fichier%231.pdf",
    });
  });
});
