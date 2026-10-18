import { describe, expect, it } from "vitest";

import { getCloudBackupProblem } from "./cloudBackupProblem.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const now = 10 * DAY_MS;
const linked = { cloudAccount: { email: "me@example.com" } };

describe("getCloudBackupProblem", () => {
  it("reports nothing without an account or a failure", () => {
    const failing = {
      cloudError: "drive-storage-full" as const,
      cloudErrorDetail: null,
      cloudFailingSince: now,
    };
    expect(
      getCloudBackupProblem({ ...failing, cloudAccount: null }, { now }),
    ).toBeNull();
    expect(
      getCloudBackupProblem(
        {
          ...linked,
          cloudError: null,
          cloudErrorDetail: null,
          cloudFailingSince: null,
        },
        { now },
      ),
    ).toBeNull();
  });

  it("reports a failure the user must fix at once", () => {
    expect(
      getCloudBackupProblem(
        {
          ...linked,
          cloudError: "drive-storage-full",
          cloudErrorDetail: "HTTP 403 · storageQuotaExceeded",
          cloudFailingSince: now,
        },
        { now },
      ),
    ).toEqual({
      code: "drive-storage-full",
      detail: "HTTP 403 · storageQuotaExceeded",
      since: now,
    });
  });

  it("reports a transient failure only once it lasts", () => {
    const offline = {
      ...linked,
      cloudError: "network" as const,
      cloudErrorDetail: null,
    };
    expect(
      getCloudBackupProblem(
        { ...offline, cloudFailingSince: now - DAY_MS / 2 },
        { now },
      ),
    ).toBeNull();
    expect(
      getCloudBackupProblem(
        { ...offline, cloudFailingSince: now - DAY_MS },
        { now },
      ),
    ).toMatchObject({ code: "network" });
    // Saved by an older version, without the date: counts from now.
    expect(
      getCloudBackupProblem({ ...offline, cloudFailingSince: null }, { now }),
    ).toBeNull();
  });
});
