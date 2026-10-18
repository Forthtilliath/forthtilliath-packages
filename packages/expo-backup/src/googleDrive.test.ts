import { afterEach, describe, expect, it, vi } from "vitest";

import { uploadAppDataFile } from "./googleDrive.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("uploadAppDataFile", () => {
  it("never sends the token to an upload session outside Google", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve(
        new Response(null, {
          status: 200,
          headers: { Location: "https://evil.example/upload?upload_id=1" },
        }),
      ),
    );
    vi.stubGlobal("fetch", fetchMock);
    await expect(
      uploadAppDataFile("token", "app-backup.json", "{}", null),
    ).rejects.toThrow("no valid upload session");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
