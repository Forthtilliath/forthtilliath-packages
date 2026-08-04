import { useColorScheme } from "react-native";

export type ThemePreference = "light" | "dark" | "system";

// Resolves a user's theme preference against the device's color scheme:
// "system" follows the device, "light"/"dark" override it regardless of what
// the device is set to. `useColorScheme()` can return `null` (unknown, e.g.
// during the very first render on some platforms), treated as "light".
export function useEffectiveColorScheme(
  preference: ThemePreference,
): "light" | "dark" {
  const systemScheme = useColorScheme();
  if (preference !== "system") return preference;
  return systemScheme === "dark" ? "dark" : "light";
}
