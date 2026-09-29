/**
 * Downloads a text blob as a file.
 * @param filename The filename to save to.
 * @param text The text to save.
 */
export function downloadText(filename: string, text: string): void {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text),
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

/**
 * How long the object URL stays valid after the click. Revoking it right
 * away can cancel the download in Firefox and Safari, which start it
 * asynchronously; FileSaver.js uses the same 40 s delay.
 */
const REVOKE_DELAY_MS = 40_000;

/**
 * Downloads a text blob as a file.
 * @param filename The filename to save to.
 * @param text The text to save.
 * @param mimeType The MIME type of the blob (defaults to `"text/plain"`).
 */
export function downloadTextBlob(
  filename: string,
  text: string,
  mimeType = "text/plain",
): void {
  const url = URL.createObjectURL(
    new Blob([text], { type: `${mimeType};charset=utf-8` }),
  );

  const a = document.createElement("a");
  a.setAttribute("download", filename);
  a.setAttribute("href", url);
  a.style.setProperty("display", "none");
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, REVOKE_DELAY_MS);
}
