import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { JsonLd } from "./json-ld.js";

function renderScript(data: Record<string, unknown>) {
  const { container } = render(<JsonLd data={data} />);
  return container.querySelectorAll("script");
}

describe("JsonLd", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the data as an application/ld+json script", () => {
    const data = { "@context": "https://schema.org", "@type": "Thing" };
    const [script] = renderScript(data);
    expect(script?.getAttribute("type")).toBe("application/ld+json");
    expect(JSON.parse(script?.innerHTML ?? "")).toEqual(data);
  });

  it("cannot be broken out of by a closing script tag in a value", () => {
    const data = { name: "</script><script>alert(1)</script>" };
    const scripts = renderScript(data);
    expect(scripts).toHaveLength(1);
    expect(scripts[0]?.innerHTML).not.toContain("</script>");
    // The escaped output is still valid JSON for the same data.
    expect(JSON.parse(scripts[0]?.innerHTML ?? "")).toEqual(data);
  });
});
