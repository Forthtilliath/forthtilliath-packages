/**
 * English names of the presence statuses. The Avatar itself reads localized
 * names from the locale messages; kept for apps that need the English ones.
 */
export const STATUS_LABEL = Object.freeze({
  online: "Online",
  offline: "Offline",
  away: "Away",
  busy: "Busy",
});

/** A presence status: `online`, `offline`, `away` or `busy`. */
export type StatusLabel = keyof typeof STATUS_LABEL;

/** Shape of an avatar: `square`, `rounded` corners or `circle`. */
export type Shape = "square" | "rounded" | "circle";
/** Size of an avatar, from `xs` (24 px) to `3xl`. */
export type Size = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
/** Corner where a status dot or a badge sits on an avatar. */
export type IndicatorPosition =
  "top-right" | "bottom-right" | "top-left" | "bottom-left";

/** Shape of an avatar when none is given: `circle`. */
export const DEFAULT_SHAPE: Shape = "circle";
/** Corner of a badge when none is given: `top-right`. */
export const DEFAULT_BADGE_POSITION: IndicatorPosition = "top-right";
