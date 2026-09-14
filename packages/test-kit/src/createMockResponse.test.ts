import { describe, expect, it } from "vitest";

import { createMockResponse } from "./createMockResponse.js";

describe("createMockResponse", () => {
  it("defaults to a 200 ok response", async () => {
    const response = createMockResponse({ id: 1 });
    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ id: 1 });
  });

  it("derives ok from status when not given explicitly", () => {
    expect(createMockResponse({}, { status: 404 }).ok).toBe(false);
    expect(createMockResponse({}, { status: 500 }).ok).toBe(false);
    expect(createMockResponse({}, { status: 201 }).ok).toBe(true);
  });

  it("lets ok be overridden explicitly", () => {
    expect(createMockResponse({}, { status: 200, ok: false }).ok).toBe(false);
  });

  it("text() stringifies a non-string body", async () => {
    const response = createMockResponse({ id: 1 });
    await expect(response.text()).resolves.toBe('{"id":1}');
  });

  it("text() returns a string body as-is", async () => {
    const response = createMockResponse("plain text");
    await expect(response.text()).resolves.toBe("plain text");
  });

  it("exposes the given headers via the Headers API", () => {
    const response = createMockResponse(
      {},
      { headers: { "content-type": "application/json" } },
    );
    expect(response.headers.get("content-type")).toBe("application/json");
  });
});
