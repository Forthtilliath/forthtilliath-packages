export type { AlertProps } from "./alert";
export { Alert } from "./alert";
export type { AlertVariants } from "./variants";

// Title/description need no forth-ui-specific behavior on top of shadcn-ui's
// — re-exported here so consumers only need one import path.
export {
  AlertDescription,
  AlertTitle,
} from "@forthtilliath/shadcn-ui/components/alert";
