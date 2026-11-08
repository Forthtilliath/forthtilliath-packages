import { act, renderHook } from "@testing-library/react-native";
import { describe, expect, it } from "vitest";

import { usePagedList, type UsePagedListResult } from "./usePagedList.js";

const ITEMS = Array.from({ length: 12 }, (_, i) => i);

interface Hook {
  current: UsePagedListResult<number>;
}

/** Scrolls to `offset` px in a 500 px viewport over `content` px of content. */
async function scrollTo(result: Hook, offset: number, content: number) {
  await act(() => {
    result.current.scrollProps.onScroll({
      nativeEvent: {
        layoutMeasurement: { height: 500 },
        contentOffset: { y: offset },
        contentSize: { height: content },
      },
    } as never);
  });
}

async function measureContent(result: Hook, height: number) {
  await act(() => {
    result.current.scrollProps.onContentSizeChange(0, height);
  });
}

describe("usePagedList", () => {
  it("shows only the first slice, then the next one near the bottom", async () => {
    const { result } = await renderHook(() => usePagedList(ITEMS));
    expect(result.current.visibleItems).toEqual([0, 1, 2, 3, 4]);

    await scrollTo(result, 100, 1500);
    expect(result.current.visibleItems).toHaveLength(5);

    await scrollTo(result, 900, 1500);
    expect(result.current.visibleItems).toHaveLength(10);
    expect(result.current.hasMore).toBe(true);
  });

  it("waits for the new content to be measured before asking for another slice", async () => {
    const { result } = await renderHook(() => usePagedList(ITEMS));

    await scrollTo(result, 900, 1500);
    await scrollTo(result, 950, 1500);
    expect(result.current.visibleItems).toHaveLength(10);

    await measureContent(result, 3000);
    await scrollTo(result, 2400, 3000);
    expect(result.current.visibleItems).toHaveLength(12);
    expect(result.current.hasMore).toBe(false);
  });

  it("fills up content too short to scroll", async () => {
    const { result } = await renderHook(() =>
      usePagedList(ITEMS, { pageSize: 3 }),
    );
    await act(() => {
      result.current.scrollProps.onLayout({
        nativeEvent: { layout: { height: 800 } },
      } as never);
    });
    expect(result.current.visibleItems).toHaveLength(3);

    await measureContent(result, 400);
    expect(result.current.visibleItems).toHaveLength(6);
  });

  it("honours a custom threshold", async () => {
    const { result } = await renderHook(() =>
      usePagedList(ITEMS, { threshold: 0 }),
    );
    await scrollTo(result, 900, 1500);
    expect(result.current.visibleItems).toHaveLength(5);

    await scrollTo(result, 1000, 1500);
    expect(result.current.visibleItems).toHaveLength(10);
  });
});
