import {
  NativeModules,
  type TurboModule,
  TurboModuleRegistry,
} from "react-native";

/**
 * Whether the native module `name` is compiled into this binary (new or old
 * architecture). Check it before loading a library that requires its native
 * module on import: on a binary built without it (an older dev build),
 * importing it anyway crashes the whole screen instead of disabling the one
 * feature that needs it.
 *
 * @example
 * if (isNativeModuleAvailable("RNViewShot")) showShareAsImageButton();
 */
export function isNativeModuleAvailable(name: string): boolean {
  return (
    TurboModuleRegistry.get<TurboModule>(name) != null ||
    (NativeModules as Record<string, unknown>)[name] != null
  );
}
