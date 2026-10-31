/** An app's dark palette (Onsortkoi's), to show each component themed. */
export const app = {
  background: "#1C1612",
  card: "#28201A",
  primary: "#E08A5C",
  primarySoft: "#3D2A1F",
  onPrimary: "#1C1612",
  text: "#F2E9E1",
  muted: "#B5A596",
  border: "#3E332B",
  control: "#857464",
  danger: "#F28B82",
  onDanger: "#1C1612",
};

export type Panel = "default" | "app";

/** `value` on the themed panel, nothing on the default one (no prop given). */
export function themed<T>(panel: Panel, value: T): T | undefined {
  return panel === "app" ? value : undefined;
}
