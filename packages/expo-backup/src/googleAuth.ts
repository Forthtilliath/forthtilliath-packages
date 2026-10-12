import {
  NativeModules,
  type TurboModule,
  TurboModuleRegistry,
} from "react-native";
import type * as GoogleSigninLib from "@react-native-google-signin/google-signin";

import { BackupError } from "./errors.js";
import { DRIVE_APPDATA_SCOPE } from "./googleDrive.js";

type GoogleSigninModule = typeof GoogleSigninLib;

/** What the backup manager needs from an account provider — swappable in tests. */
export interface CloudAuth {
  /** Opens the account picker. Resolves to the account's e-mail, or null if cancelled. */
  signIn: () => Promise<string | null>;
  /** Access token for the already linked account, without user interaction. */
  getAccessToken: () => Promise<string>;
  /** Forgets a token the API rejected, so the next call gets a fresh one. */
  invalidateToken: (token: string) => Promise<void>;
  /** Revokes the app's access (not just the local session). Never throws. */
  signOut: () => Promise<void>;
}

function isNativeModuleAvailable(name: string): boolean {
  return (
    TurboModuleRegistry.get<TurboModule>(name) != null ||
    NativeModules[name] != null
  );
}

let signinModule: Promise<GoogleSigninModule> | null = null;

/**
 * Loaded on demand: the library needs its native module as soon as it's
 * imported, so a static import would crash the whole app at startup on a
 * binary built without it (old dev build, Expo Go) instead of only disabling
 * the Drive backup. The native check comes first because Metro reports a
 * failing lazy load as a fatal error, even inside a try/catch.
 *
 * No `webClientId`: without a server, the app only needs an on-device Drive
 * token, which the Android OAuth client (package name + signing SHA-1)
 * declared in Google Cloud provides.
 */
function loadGoogleSignin(): Promise<GoogleSigninModule> {
  if (!isNativeModuleAvailable("RNGoogleSignin")) {
    return Promise.reject(new BackupError("google-unavailable"));
  }
  signinModule ??= import("@react-native-google-signin/google-signin").then(
    (loaded) => {
      loaded.GoogleSignin.configure({ scopes: [DRIVE_APPDATA_SCOPE] });
      return loaded;
    },
  );
  return signinModule;
}

async function signIn(): Promise<string | null> {
  const {
    GoogleSignin: googleSignin,
    isErrorWithCode,
    isSuccessResponse,
    statusCodes,
  } = await loadGoogleSignin();
  try {
    await googleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await googleSignin.signIn();
    if (!isSuccessResponse(response)) return null;
    return response.data.user.email;
  } catch (error) {
    if (!isErrorWithCode(error))
      throw new BackupError("sign-in-failed", { cause: error });
    if (error.code === statusCodes.SIGN_IN_CANCELLED) return null;
    if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      throw new BackupError("play-services-unavailable", { cause: error });
    }
    // DEVELOPER_ERROR (code 10): no Android OAuth client matches this APK's
    // package name + signing certificate SHA-1.
    if (error.code === "10" || error.message.includes("DEVELOPER_ERROR")) {
      throw new BackupError("oauth-misconfigured", { cause: error });
    }
    throw new BackupError("sign-in-failed", { cause: error });
  }
}

async function getAccessToken(): Promise<string> {
  const { GoogleSignin: googleSignin } = await loadGoogleSignin();
  try {
    if (!googleSignin.getCurrentUser()) {
      const response = await googleSignin.signInSilently();
      if (response.type !== "success")
        throw new BackupError("reconnect-required");
    }
    const { accessToken } = await googleSignin.getTokens();
    return accessToken;
  } catch (error) {
    if (error instanceof BackupError) throw error;
    throw new BackupError("reconnect-required", { cause: error });
  }
}

async function invalidateToken(token: string): Promise<void> {
  const { GoogleSignin: googleSignin } = await loadGoogleSignin();
  await googleSignin.clearCachedAccessToken(token).catch(() => undefined);
}

async function signOut(): Promise<void> {
  let googleSignin: GoogleSigninModule["GoogleSignin"];
  try {
    googleSignin = (await loadGoogleSignin()).GoogleSignin;
  } catch {
    return;
  }
  await googleSignin.revokeAccess().catch(() => undefined);
  await googleSignin.signOut().catch(() => undefined);
}

/** Google Sign-In with the `drive.appdata` scope — the default {@link CloudAuth}. */
export const googleDriveAuth: CloudAuth = {
  signIn,
  getAccessToken,
  invalidateToken,
  signOut,
};
