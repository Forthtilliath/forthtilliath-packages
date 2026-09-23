import { afterEach, describe, expect, it, vi } from "vitest";

import { uploadViaPresignedUrl } from "./client.js";

const fetchMock = vi.fn<typeof fetch>();
vi.stubGlobal("fetch", fetchMock);

afterEach(() => {
  fetchMock.mockReset();
});

const jsonResponse = (body: object, status = 200) =>
  new Response(JSON.stringify(body), { status });

function callInit(index: number): RequestInit {
  const init = fetchMock.mock.calls[index]?.[1];
  if (!init) throw new Error(`fetch call #${index} has no init`);
  return init;
}

describe("uploadViaPresignedUrl", () => {
  it("presigns, then PUTs the file to uploadUrl", async () => {
    fetchMock
      .mockResolvedValueOnce(
        jsonResponse({
          uploadUrl: "https://r2.test/put",
          publicUrl: "https://cdn/a",
        }),
      )
      .mockResolvedValueOnce(new Response(null, { status: 200 }));
    const file = new File(["x"], "a.pdf", { type: "application/pdf" });

    const result = await uploadViaPresignedUrl({
      file,
      key: "docs/a.pdf",
      endpoint: "/presign",
    });

    expect(result).toEqual({
      uploadUrl: "https://r2.test/put",
      publicUrl: "https://cdn/a",
    });
    expect(fetchMock.mock.calls[0]?.[0]).toBe("/presign");
    expect(JSON.parse(callInit(0).body as string)).toEqual({
      key: "docs/a.pdf",
      contentType: "application/pdf",
    });
    expect(fetchMock.mock.calls[1]?.[0]).toBe("https://r2.test/put");
    expect(callInit(1)).toMatchObject({ method: "PUT", body: file });
  });

  it("applies transform and sends the transformed file's type", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ uploadUrl: "https://r2.test/put" }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }));
    const transformed = new File(["y"], "a.webp", { type: "image/webp" });

    await uploadViaPresignedUrl({
      file: new File(["x"], "a.png", { type: "image/png" }),
      key: "k",
      endpoint: "/presign",
      transform: () => Promise.resolve(transformed),
    });

    expect(
      (JSON.parse(callInit(0).body as string) as { contentType: string })
        .contentType,
    ).toBe("image/webp");
    expect(callInit(1).body).toBe(transformed);
  });

  it("falls back to application/octet-stream for untyped files", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ uploadUrl: "https://r2.test/put" }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }));

    await uploadViaPresignedUrl({
      file: new File(["x"], "a"),
      key: "k",
      endpoint: "/presign",
    });

    expect(callInit(1).headers).toEqual({
      "Content-Type": "application/octet-stream",
    });
  });

  it("surfaces the presign route's error message", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ error: "Invalid key" }, 400),
    );
    await expect(
      uploadViaPresignedUrl({
        file: new File(["x"], "a"),
        key: "k",
        endpoint: "/presign",
      }),
    ).rejects.toThrow("Invalid key");
  });

  it("falls back to a status-based message when the error body isn't JSON", async () => {
    fetchMock.mockResolvedValueOnce(new Response("oops", { status: 502 }));
    await expect(
      uploadViaPresignedUrl({
        file: new File(["x"], "a"),
        key: "k",
        endpoint: "/presign",
      }),
    ).rejects.toThrow("Presign failed (502)");
  });

  it("fails when the PUT to the bucket fails", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ uploadUrl: "https://r2.test/put" }))
      .mockResolvedValueOnce(new Response(null, { status: 403 }));
    await expect(
      uploadViaPresignedUrl({
        file: new File(["x"], "a"),
        key: "k",
        endpoint: "/presign",
      }),
    ).rejects.toThrow("Upload failed (403)");
  });
});
