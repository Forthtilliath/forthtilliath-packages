import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { uploadViaPresignedUrl } from "./client.js";

/** Just enough of XMLHttpRequest for putWithProgress; the test drives it. */
class FakeXhr {
  static last: FakeXhr | undefined;
  method = "";
  url = "";
  headers: Record<string, string> = {};
  body: unknown;
  status = 0;
  aborted = false;
  upload: { onprogress: ((event: ProgressEvent) => void) | null } = {
    onprogress: null,
  };
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onabort: (() => void) | null = null;
  onloadend: (() => void) | null = null;

  constructor() {
    FakeXhr.last = this;
  }
  open(method: string, url: string) {
    this.method = method;
    this.url = url;
  }
  setRequestHeader(name: string, value: string) {
    this.headers[name] = value;
  }
  send(body: unknown) {
    this.body = body;
  }
  abort() {
    this.aborted = true;
    this.onabort?.();
    this.onloadend?.();
  }

  progress(loaded: number, total: number, lengthComputable = true) {
    this.upload.onprogress?.({
      loaded,
      total,
      lengthComputable,
    } as ProgressEvent);
  }
  respond(status: number) {
    this.status = status;
    this.onload?.();
    this.onloadend?.();
  }
  fail() {
    this.onerror?.();
    this.onloadend?.();
  }
}

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  vi.stubGlobal("XMLHttpRequest", FakeXhr);
  fetchMock.mockResolvedValueOnce(
    new Response(JSON.stringify({ uploadUrl: "https://r2.test/put" })),
  );
  FakeXhr.last = undefined;
});

afterEach(() => {
  vi.unstubAllGlobals();
  fetchMock.mockReset();
});

const file = new File(["hello"], "a.txt", { type: "text/plain" });

/** Starts an upload, and waits until it reaches the XHR (after presign). */
async function start(options: { signal?: AbortSignal } = {}) {
  const onProgress = vi.fn();
  const promise = uploadViaPresignedUrl({
    file,
    key: "k",
    endpoint: "/presign",
    onProgress,
    ...options,
  });
  const xhr = await vi.waitFor(() => {
    if (!FakeXhr.last) throw new Error("XHR not started yet");
    return FakeXhr.last;
  });
  return { promise, onProgress, xhr };
}

describe("uploadViaPresignedUrl with onProgress", () => {
  it("PUTs through XMLHttpRequest and reports progress", async () => {
    const { promise, onProgress, xhr } = await start();

    expect(xhr).toMatchObject({
      method: "PUT",
      url: "https://r2.test/put",
      headers: { "Content-Type": "text/plain" },
      body: file,
    });
    xhr.progress(2, 5);
    xhr.progress(3, 0, false);
    xhr.respond(200);

    await expect(promise).resolves.toEqual({
      uploadUrl: "https://r2.test/put",
    });
    expect(onProgress.mock.calls).toEqual([
      [{ loaded: 2, total: 5 }],
      // No computable length: falls back to the body's size.
      [{ loaded: 3, total: 5 }],
      // Always ends on 100%.
      [{ loaded: 5, total: 5 }],
    ]);
    // Only the presign went through fetch.
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("rejects on a non-2xx status, without reporting 100%", async () => {
    const { promise, onProgress, xhr } = await start();
    xhr.respond(403);

    await expect(promise).rejects.toThrow("Upload failed (403)");
    expect(onProgress).not.toHaveBeenCalled();
  });

  it("rejects on a network error", async () => {
    const { promise, xhr } = await start();
    xhr.fail();

    await expect(promise).rejects.toThrow("Upload failed (network error)");
  });

  it("aborts the request when the signal fires", async () => {
    const controller = new AbortController();
    const { promise, xhr } = await start({ signal: controller.signal });
    const reason = new Error("user cancelled");
    controller.abort(reason);

    await expect(promise).rejects.toBe(reason);
    expect(xhr.aborted).toBe(true);
  });

  it("rejects with an AbortError when the XHR is aborted without a signal", async () => {
    const { promise, xhr } = await start();
    xhr.abort();

    await expect(promise).rejects.toMatchObject({ name: "AbortError" });
  });

  it("does not start the XHR when aborted during presign", async () => {
    const controller = new AbortController();
    fetchMock.mockReset();
    fetchMock.mockImplementationOnce(() => {
      controller.abort();
      return Promise.resolve(
        new Response(JSON.stringify({ uploadUrl: "https://r2.test/put" })),
      );
    });

    await expect(
      uploadViaPresignedUrl({
        file,
        key: "k",
        endpoint: "/presign",
        onProgress: vi.fn(),
        signal: controller.signal,
      }),
    ).rejects.toMatchObject({ name: "AbortError" });
    expect(FakeXhr.last).toBeUndefined();
  });
});
