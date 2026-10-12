import * as Calendar from "expo-calendar";

import type { CalendarEventDetails } from "./toCalendarEventDetails.js";

/** The app's own calendar on the phone. */
export interface DedicatedCalendar {
  /** Internal name (Android), stable: finds the calendar again on the next sync. */
  name: string;
  /** Shown in the user's calendar app. */
  title: string;
  color: string;
}

export interface SyncDedicatedCalendarOptions {
  calendar: DedicatedCalendar;
  /** Start of the period to replace (included). */
  from: Date;
  /** End of the period to replace (excluded). */
  to: Date;
  /** The period's new events — see `toCalendarEventDetails`. */
  events: readonly CalendarEventDetails[];
}

export type CalendarSyncResult =
  { status: "denied" } | { status: "done"; count: number };

async function getOrCreateLocalCalendar({
  name,
  title,
  color,
}: DedicatedCalendar): Promise<Calendar.ExpoCalendar> {
  const calendars = await Calendar.getCalendars(Calendar.EntityTypes.EVENT);
  const existing = calendars.find((c) => c.name === name);
  if (existing) return existing;

  return Calendar.createCalendar({
    title,
    name,
    color,
    entityType: Calendar.EntityTypes.EVENT,
    // A local account: nothing syncs to a Google account, and the user can
    // hide this calendar in one tap from their calendar app.
    source: { isLocalAccount: true, name: title, type: "LOCAL" },
    ownerAccount: title,
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
  });
}

/**
 * Writes a period's events to the app's dedicated calendar on the phone
 * (created on first use, as a local account), replacing whatever that
 * calendar held over the period: a new sync replaces the previous one with no
 * duplicates, and an event removed from the app disappears from the calendar
 * too. Other calendars are never touched. Asks for the calendar permission
 * first. Needs `expo-calendar` (an optional peer dependency).
 *
 * @param options - See {@link SyncDedicatedCalendarOptions}.
 * @returns `{ status: "denied" }` without the permission, else the number of events written.
 */
export async function syncDedicatedCalendar({
  calendar,
  from,
  to,
  events,
}: SyncDedicatedCalendarOptions): Promise<CalendarSyncResult> {
  const { granted } = await Calendar.requestCalendarPermissions();
  if (!granted) return { status: "denied" };

  const target = await getOrCreateLocalCalendar(calendar);
  for (const event of await target.listEvents(from, to)) {
    await event.delete();
  }
  for (const event of events) {
    await target.createEvent(event);
  }
  return { status: "done", count: events.length };
}
