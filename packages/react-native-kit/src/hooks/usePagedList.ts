import { useCallback, useRef, useState } from "react";
import type {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";

/** Options of {@link usePagedList}. */
export interface UsePagedListOptions {
  /**
   * Items added by each slice (and shown at first).
   * @defaultValue 5
   */
  pageSize?: number;
  /**
   * Distance to the bottom of the content (px) from which the next slice is
   * shown.
   * @defaultValue 200
   */
  threshold?: number;
}

/** Handlers to spread on the `ScrollView` showing the list. */
export interface PagedListScrollProps {
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onLayout: (event: LayoutChangeEvent) => void;
  onContentSizeChange: (width: number, height: number) => void;
  scrollEventThrottle: number;
}

/** What {@link usePagedList} returns. */
export interface UsePagedListResult<T> {
  /** The items to render: the first slices of `items`. */
  visibleItems: T[];
  /** Whether some items are not shown yet (e.g. to show a footer). */
  hasMore: boolean;
  /** To spread on the `ScrollView`. */
  scrollProps: PagedListScrollProps;
}

const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_THRESHOLD = 200;

/**
 * Infinite scrolling over a list already in memory: shows only `pageSize`
 * items at first, then the next slice when the user nears the bottom of the
 * `ScrollView` (spread `scrollProps` on it). One slice at a time: the next
 * one waits until the new content is measured. Content too short to scroll
 * fills itself up until it covers the screen. No dependency, unlike a
 * `FlatList` it keeps whatever layout the screen already has.
 *
 * @param items - Every item, e.g. a history loaded at once.
 * @param options - Slice size and distance to the bottom.
 * @example
 * const { visibleItems, scrollProps } = usePagedList(games, { pageSize: 10 });
 * <ScrollView {...scrollProps}>
 *   {visibleItems.map((game) => <GameRow key={game.id} game={game} />)}
 * </ScrollView>
 */
export function usePagedList<T>(
  items: readonly T[],
  {
    pageSize = DEFAULT_PAGE_SIZE,
    threshold = DEFAULT_THRESHOLD,
  }: UsePagedListOptions = {},
): UsePagedListResult<T> {
  const [limit, setLimit] = useState(pageSize);
  const viewportRef = useRef({ height: 0, offset: 0, content: 0 });
  // A slice was asked for but not measured yet: the known content height is
  // stale, and a scroll in between would ask for a second one.
  const awaitingContentRef = useRef(false);
  const hasMore = limit < items.length;

  const loadMoreIfNearBottom = useCallback(() => {
    const { height, offset, content } = viewportRef.current;
    // Nothing measured yet (first layout before the content): no way to tell
    // whether the bottom is near.
    const measured = height > 0 && content > 0;
    const nearBottom = measured && height + offset >= content - threshold;
    if (!nearBottom || !hasMore || awaitingContentRef.current) return;
    awaitingContentRef.current = true;
    setLimit(limit + pageSize);
  }, [hasMore, limit, pageSize, threshold]);

  const onScroll = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      viewportRef.current = {
        height: nativeEvent.layoutMeasurement.height,
        offset: nativeEvent.contentOffset.y,
        content: nativeEvent.contentSize.height,
      };
      loadMoreIfNearBottom();
    },
    [loadMoreIfNearBottom],
  );

  const onLayout = useCallback(
    ({ nativeEvent }: LayoutChangeEvent) => {
      viewportRef.current.height = nativeEvent.layout.height;
      loadMoreIfNearBottom();
    },
    [loadMoreIfNearBottom],
  );

  const onContentSizeChange = useCallback(
    (_width: number, height: number) => {
      viewportRef.current.content = height;
      awaitingContentRef.current = false;
      loadMoreIfNearBottom();
    },
    [loadMoreIfNearBottom],
  );

  return {
    visibleItems: items.slice(0, limit),
    hasMore,
    scrollProps: {
      onScroll,
      onLayout,
      onContentSizeChange,
      scrollEventThrottle: 100,
    },
  };
}
