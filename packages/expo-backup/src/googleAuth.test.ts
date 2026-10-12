import { beforeEach, describe, expect, it, vi } from "vitest";

import { reactNativeModule } from "./__mocks__/fakeDevice.js";
import { googleDriveAuth } from "./googleAuth.js";
import { DRIVE_APPDATA_SCOPE } from "./googleDrive.js";

const signin = vi.hoisted(() => ({
  configure: vi.fn(),
  hasPlayServices: vi.fn(() => Promise.resolve(true)),
  signIn: vi.fn(),
  getCurrentUser: vi.fn(),
  signInSilently: vi.fn(),
  getTokens: vi.fn(),
  clearCachedAccessToken: vi.fn(() => Promise.resolve()),
  revokeAccess: vi.fn(() => Promise.resolve()),
  signOut: vi.fn(() => Promise.resolve()),
}));

vi.mock("@react-native-google-signin/google-signin", () => ({
  GoogleSignin: signin,
  statusCodes: { SIGN_IN_CANCELLED: "12501", PLAY_SERVICES_NOT_AVAILABLE: "2" },
  isErrorWithCode: (error: unknown) =>
    error instanceof Error && "code" in error,
  isSuccessResponse: (response: { type: string }) =>
    response.type === "success",
}));

function codedError(code: string, message = "failed") {
  return Object.assign(new Error(message), { code });
}

function setNativeModule(available: boolean) {
  if (available) reactNativeModule.NativeModules.RNGoogleSignin = {};
  else delete reactNativeModule.NativeModules.RNGoogleSignin;
}

beforeEach(() => {
  vi.clearAllMocks();
  setNativeModule(true);
});

describe("googleDriveAuth without the native module", () => {
  it("reports google-unavailable, and signOut stays silent", async () => {
    setNativeModule(false);
    await expect(googleDriveAuth.signIn()).rejects.toMatchObject({
      code: "google-unavailable",
    });
    await expect(googleDriveAuth.signOut()).resolves.toBeUndefined();
  });
});

describe("googleDriveAuth.signIn", () => {
  it("configures the drive.appdata scope only, and returns the e-mail", async () => {
    signin.signIn.mockResolvedValue({
      type: "success",
      data: { user: { email: "a@b.c" } },
    });
    await expect(googleDriveAuth.signIn()).resolves.toBe("a@b.c");
    expect(signin.configure).toHaveBeenCalledWith({
      scopes: [DRIVE_APPDATA_SCOPE],
    });
  });

  it("returns null when the user cancels", async () => {
    signin.signIn.mockResolvedValue({ type: "cancelled" });
    await expect(googleDriveAuth.signIn()).resolves.toBeNull();
    signin.signIn.mockRejectedValue(codedError("12501"));
    await expect(googleDriveAuth.signIn()).resolves.toBeNull();
  });

  it.each([
    [codedError("2"), "play-services-unavailable"],
    [codedError("10"), "oauth-misconfigured"],
    [codedError("x", "DEVELOPER_ERROR"), "oauth-misconfigured"],
    [codedError("7"), "sign-in-failed"],
    [new Error("plain"), "sign-in-failed"],
  ])("maps %s to %s", async (error, code) => {
    signin.signIn.mockRejectedValue(error);
    await expect(googleDriveAuth.signIn()).rejects.toMatchObject({ code });
  });
});

describe("googleDriveAuth.getAccessToken", () => {
  it("returns the token of the current user", async () => {
    signin.getCurrentUser.mockReturnValue({});
    signin.getTokens.mockResolvedValue({ accessToken: "tok" });
    await expect(googleDriveAuth.getAccessToken()).resolves.toBe("tok");
    expect(signin.signInSilently).not.toHaveBeenCalled();
  });

  it("signs in silently first when needed", async () => {
    signin.getCurrentUser.mockReturnValue(null);
    signin.signInSilently.mockResolvedValue({ type: "success" });
    signin.getTokens.mockResolvedValue({ accessToken: "tok" });
    await expect(googleDriveAuth.getAccessToken()).resolves.toBe("tok");
  });

  it("asks to reconnect when access was revoked", async () => {
    signin.getCurrentUser.mockReturnValue(null);
    signin.signInSilently.mockResolvedValue({ type: "noSavedCredentialFound" });
    await expect(googleDriveAuth.getAccessToken()).rejects.toMatchObject({
      code: "reconnect-required",
    });
    signin.signInSilently.mockRejectedValue(new Error("boom"));
    await expect(googleDriveAuth.getAccessToken()).rejects.toMatchObject({
      code: "reconnect-required",
    });
  });
});

describe("googleDriveAuth.invalidateToken / signOut", () => {
  it("never throw", async () => {
    signin.clearCachedAccessToken.mockRejectedValue(new Error("x"));
    signin.revokeAccess.mockRejectedValue(new Error("x"));
    signin.signOut.mockRejectedValue(new Error("x"));
    await expect(
      googleDriveAuth.invalidateToken("tok"),
    ).resolves.toBeUndefined();
    await expect(googleDriveAuth.signOut()).resolves.toBeUndefined();
    expect(signin.revokeAccess).toHaveBeenCalled();
  });
});
