import { beforeEach, describe, expect, it, vi } from "vitest";

interface FakeEvent {
  title: string;
  delete: () => Promise<void>;
}

const state = vi.hoisted(() => ({
  granted: true,
  calendars: [] as { name: string }[],
  existingEvents: [] as FakeEvent[],
  created: [] as unknown[],
  createdCalendars: [] as unknown[],
  listRange: [] as Date[],
}));

vi.mock("expo-calendar", () => {
  const fakeCalendar = (name: string) => ({
    name,
    listEvents: (from: Date, to: Date) => {
      state.listRange = [from, to];
      return Promise.resolve(state.existingEvents);
    },
    createEvent: (details: unknown) => {
      state.created.push(details);
      return Promise.resolve({});
    },
  });
  return {
    EntityTypes: { EVENT: "event" },
    CalendarAccessLevel: { OWNER: "owner" },
    requestCalendarPermissions: () =>
      Promise.resolve({ granted: state.granted }),
    getCalendars: () =>
      Promise.resolve(state.calendars.map((c) => fakeCalendar(c.name))),
    createCalendar: (details: { name: string }) => {
      state.createdCalendars.push(details);
      return Promise.resolve(fakeCalendar(details.name));
    },
  };
});

const { syncDedicatedCalendar } = await import("./syncDedicatedCalendar.js");
const { toCalendarEventDetails } = await import("./toCalendarEventDetails.js");

const dedicated = { name: "my-app", title: "My App", color: "#123456" };
const july = { from: new Date(2026, 6, 1), to: new Date(2026, 7, 1) };

beforeEach(() => {
  state.granted = true;
  state.calendars = [];
  state.existingEvents = [];
  state.created = [];
  state.createdCalendars = [];
});

describe("toCalendarEventDetails", () => {
  it("keeps timed events in local time, in the given zone", () => {
    const details = toCalendarEventDetails(
      { title: "Matin", date: "2026-07-14", start: "06:30", end: "14:00" },
      "Europe/Paris",
    );
    expect(details).toMatchObject({
      title: "Matin",
      notes: "",
      allDay: false,
      timeZone: "Europe/Paris",
    });
    expect(details.startDate).toEqual(new Date(2026, 6, 14, 6, 30));
    expect(details.endDate).toEqual(new Date(2026, 6, 14, 14, 0));
  });

  it("ends a night shift the next day", () => {
    const details = toCalendarEventDetails({
      title: "Nuit",
      date: "2026-07-31",
      start: "20:00",
      end: "02:00",
    });
    expect(details.endDate).toEqual(new Date(2026, 7, 1, 2, 0));
  });

  it("sets an all-day event at UTC midnight, in UTC", () => {
    const details = toCalendarEventDetails({
      title: "Repos",
      notes: "RH",
      date: "2026-07-14",
    });
    expect(details).toMatchObject({
      allDay: true,
      timeZone: "UTC",
      notes: "RH",
    });
    expect(details.startDate.toISOString()).toBe("2026-07-14T00:00:00.000Z");
    expect(details.endDate.toISOString()).toBe("2026-07-15T00:00:00.000Z");
  });
});

describe("syncDedicatedCalendar", () => {
  const events = [
    toCalendarEventDetails({ title: "A", date: "2026-07-01" }),
    toCalendarEventDetails({ title: "B", date: "2026-07-02" }),
  ];

  it("does nothing without the permission", async () => {
    state.granted = false;
    await expect(
      syncDedicatedCalendar({ calendar: dedicated, ...july, events }),
    ).resolves.toEqual({ status: "denied" });
    expect(state.created).toEqual([]);
  });

  it("creates the dedicated calendar as a local account on first use", async () => {
    await syncDedicatedCalendar({ calendar: dedicated, ...july, events });
    expect(state.createdCalendars).toEqual([
      expect.objectContaining({
        name: "my-app",
        title: "My App",
        color: "#123456",
        source: { isLocalAccount: true, name: "My App", type: "LOCAL" },
      }),
    ]);
  });

  it("replaces the period's events in the existing calendar", async () => {
    state.calendars = [{ name: "other" }, { name: "my-app" }];
    const deleted: string[] = [];
    state.existingEvents = ["old1", "old2"].map((title) => ({
      title,
      delete: () => {
        deleted.push(title);
        return Promise.resolve();
      },
    }));

    const result = await syncDedicatedCalendar({
      calendar: dedicated,
      ...july,
      events,
    });

    expect(state.createdCalendars).toEqual([]);
    expect(state.listRange).toEqual([july.from, july.to]);
    expect(deleted).toEqual(["old1", "old2"]);
    expect(state.created).toEqual(events);
    expect(result).toEqual({ status: "done", count: 2 });
  });
});
