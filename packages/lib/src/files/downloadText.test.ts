// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";

import { downloadText, downloadTextBlob } from "./downloadText.js";

describe("downloadText", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("creates a data-uri download link, clicks it, then removes it", () => {
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {
        /* jsdom does not implement navigation, avoid the console warning */
      });
    const appendSpy = vi.spyOn(document.body, "appendChild");
    const removeSpy = vi.spyOn(document.body, "removeChild");

    downloadText("notes.txt", "hello world");

    expect(appendSpy).toHaveBeenCalledTimes(1);
    const anchor = appendSpy.mock.calls[0]?.[0] as HTMLAnchorElement;

    expect(anchor.tagName).toBe("A");
    expect(anchor.getAttribute("download")).toBe("notes.txt");
    expect(anchor.getAttribute("href")).toBe(
      "data:text/plain;charset=utf-8," + encodeURIComponent("hello world"),
    );
    expect(anchor.style.display).toBe("none");
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(removeSpy).toHaveBeenCalledWith(anchor);
  });

  it("URL-encodes special characters in the text content", () => {
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {
      /* jsdom does not implement navigation, avoid the console warning */
    });
    const appendSpy = vi.spyOn(document.body, "appendChild");

    downloadText("data.txt", "a & b = c?");

    const anchor = appendSpy.mock.calls[0]?.[0] as HTMLAnchorElement;
    expect(anchor.getAttribute("href")).toBe(
      "data:text/plain;charset=utf-8," + encodeURIComponent("a & b = c?"),
    );
  });
});

describe("downloadTextBlob", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    Reflect.deleteProperty(URL, "createObjectURL");
    Reflect.deleteProperty(URL, "revokeObjectURL");
  });

  it("creates a blob download link, clicks it, then revokes the URL and removes the link", () => {
    const createObjectURL = vi.fn<(blob: Blob) => string>(
      () => "blob:mock-url",
    );
    const revokeObjectURL = vi.fn();
    URL.createObjectURL = createObjectURL;
    URL.revokeObjectURL = revokeObjectURL;

    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {
        /* jsdom does not implement navigation, avoid the console warning */
      });
    const appendSpy = vi.spyOn(document.body, "appendChild");
    const removeSpy = vi.spyOn(document.body, "removeChild");

    downloadTextBlob("report.txt", "some content");

    expect(createObjectURL).toHaveBeenCalledTimes(1);
    const blobArg = createObjectURL.mock.calls[0]?.[0];
    if (!blobArg) throw new Error("createObjectURL was not called with a Blob");
    expect(blobArg).toBeInstanceOf(Blob);
    expect(blobArg.type).toBe("text/plain");

    expect(appendSpy).toHaveBeenCalledTimes(1);
    const anchor = appendSpy.mock.calls[0]?.[0] as HTMLAnchorElement;
    expect(anchor.getAttribute("download")).toBe("report.txt");
    expect(anchor.getAttribute("href")).toBe("blob:mock-url");
    expect(anchor.style.display).toBe("none");

    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
    expect(removeSpy).toHaveBeenCalledWith(anchor);
  });
});
