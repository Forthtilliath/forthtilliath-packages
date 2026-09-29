export type { AlertProps } from "./alert.js";
export { Alert } from "./alert.js";
export type { AlertVariants } from "./variants.js";

// Title/description need no forth-ui-specific behavior on top of shadcn-ui's
// — re-exported here so consumers only need one import path.
export {
  AlertDescription,
  AlertTitle,
} from "@forthtilliath/shadcn-ui/components/alert";
