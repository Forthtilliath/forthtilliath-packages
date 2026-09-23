import { S3Client } from "@aws-sdk/client-s3";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: vi.fn(() => Promise.resolve("https://r2.test/signed")),
}));

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { createPresignHandler, createR2Client, isSafeKey } from "./server.js";

const client = {} as S3Client;
const allow = () => Promise.resolve(null);

function post(body: unknown): Request {
  return new Request("http://localhost/presign", {
    method: "POST",
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("createR2Client", () => {
  it("builds an S3 client with R2-friendly checksum settings", async () => {
    const r2 = createR2Client({
      endpoint: "https://account.r2.cloudflarestorage.com",
      accessKeyId: "id",
      secretAccessKey: "secret",
    });
    expect(r2).toBeInstanceOf(S3Client);
    expect(await r2.config.region()).toBe("auto");
    expect(r2.config.requestChecksumCalculation).toBeDefined();
  });
});

describe("isSafeKey", () => {
  it("accepts a plain key", () => {
    expect(isSafeKey("songs/a/1.mp3")).toBe(true);
  });

  it.each(["", "../x", "a/../b", "/abs", "a\0b"])("rejects %j", (key) => {
    expect(isSafeKey(key)).toBe(false);
  });
});

describe("createPresignHandler", () => {
  beforeEach(() => {
    vi.mocked(getSignedUrl).mockClear();
  });

  it("returns only uploadUrl for a private bucket", async () => {
    const handler = createPresignHandler({
      client,
      bucket: "b",
      authorize: allow,
    });
    const res = await handler(
      post({ key: "songs/1.mp3", contentType: "audio/mpeg" }),
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ uploadUrl: "https://r2.test/signed" });
  });

  it("adds publicUrl when publicBaseUrl is set, without a double slash", async () => {
    const handler = createPresignHandler({
      client,
      bucket: "b",
      authorize: allow,
      publicBaseUrl: "https://cdn.test/",
    });
    const res = await handler(
      post({ key: "home/hero.webp", contentType: "image/webp" }),
    );
    expect(await res.json()).toEqual({
      uploadUrl: "https://r2.test/signed",
      publicUrl: "https://cdn.test/home/hero.webp",
    });
  });

  it("forwards expiresIn to the presigner (300s by default)", async () => {
    const body = { key: "a.webp", contentType: "image/webp" };
    await createPresignHandler({ client, bucket: "b", authorize: allow })(
      post(body),
    );
    await createPresignHandler({
      client,
      bucket: "b",
      authorize: allow,
      expiresIn: 60,
    })(post(body));
    expect(vi.mocked(getSignedUrl).mock.calls[0]?.[2]).toEqual({
      expiresIn: 300,
    });
    expect(vi.mocked(getSignedUrl).mock.calls[1]?.[2]).toEqual({
      expiresIn: 60,
    });
  });

  it("returns 400 on missing parameters or a non-JSON body", async () => {
    const handler = createPresignHandler({
      client,
      bucket: "b",
      authorize: allow,
    });
    expect((await handler(post({ key: "a" }))).status).toBe(400);
    expect((await handler(post("not json"))).status).toBe(400);
  });

  it("returns 400 on an unsafe key without calling authorize", async () => {
    const authorize = vi.fn(allow);
    const handler = createPresignHandler({ client, bucket: "b", authorize });
    const res = await handler(post({ key: "../x", contentType: "image/webp" }));
    expect(res.status).toBe(400);
    expect(authorize).not.toHaveBeenCalled();
  });

  it("relays authorize's rejection without presigning", async () => {
    const handler = createPresignHandler({
      client,
      bucket: "b",
      authorize: () => Promise.resolve({ status: 403, error: "Forbidden" }),
    });
    const res = await handler(
      post({ key: "a.webp", contentType: "image/webp" }),
    );
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: "Forbidden" });
    expect(getSignedUrl).not.toHaveBeenCalled();
  });

  it("delegates presign errors to onError", async () => {
    vi.mocked(getSignedUrl).mockRejectedValueOnce(new Error("boom"));
    const onError = vi.fn(() => Response.json({ error: "x" }, { status: 502 }));
    const handler = createPresignHandler({
      client,
      bucket: "b",
      authorize: allow,
      onError,
    });
    const res = await handler(
      post({ key: "a.webp", contentType: "image/webp" }),
    );
    expect(res.status).toBe(502);
    expect(onError).toHaveBeenCalledOnce();
  });

  it("returns 500 on presign errors when no onError is given", async () => {
    vi.mocked(getSignedUrl).mockRejectedValueOnce(new Error("boom"));
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const handler = createPresignHandler({
      client,
      bucket: "b",
      authorize: allow,
    });
    const res = await handler(
      post({ key: "a.webp", contentType: "image/webp" }),
    );
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Presign failed" });
    consoleError.mockRestore();
  });
});
