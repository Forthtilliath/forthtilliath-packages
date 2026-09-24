// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";

import { downloadCsv } from "./downloadCsv.js";

describe("downloadCsv", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    Reflect.deleteProperty(URL, "createObjectURL");
    Reflect.deleteProperty(URL, "revokeObjectURL");
  });

  it("downloads a text/csv blob prefixed with a UTF-8 BOM", async () => {
    const createObjectURL = vi.fn<(blob: Blob) => string>(
      () => "blob:mock-url",
    );
    URL.createObjectURL = createObjectURL;
    URL.revokeObjectURL = vi.fn();
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {
        /* jsdom does not implement navigation, avoid the console warning */
      });
    const appendSpy = vi.spyOn(document.body, "appendChild");

    downloadCsv("members.csv", '"name"\n"Zoé"');

    const blobArg = createObjectURL.mock.calls[0]?.[0];
    if (!blobArg) throw new Error("createObjectURL was not called with a Blob");
    expect(blobArg.type).toBe("text/csv;charset=utf-8");
    const bytes = new Uint8Array(await blobArg.arrayBuffer());
    expect([...bytes.slice(0, 3)]).toEqual([0xef, 0xbb, 0xbf]);
    expect(new TextDecoder().decode(bytes.slice(3))).toBe('"name"\n"Zoé"');

    const anchor = appendSpy.mock.calls[0]?.[0] as HTMLAnchorElement;
    expect(anchor.getAttribute("download")).toBe("members.csv");
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });
});
