export const STATUS_LABEL = Object.freeze({
  online: "Online",
  offline: "Offline",
  away: "Away",
  busy: "Busy",
});

export type StatusLabel = keyof typeof STATUS_LABEL;

export type Shape = "square" | "rounded" | "circle";
export type Size = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
export type IndicatorPosition =
  "top-right" | "bottom-right" | "top-left" | "bottom-left";

export const DEFAULT_SHAPE: Shape = "circle";
export const DEFAULT_BADGE_POSITION: IndicatorPosition = "top-right";
