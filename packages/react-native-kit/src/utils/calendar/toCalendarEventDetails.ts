/** A calendar event as an app describes it: a day, and optional wall-clock hours. */
export interface CalendarEventInput {
  title: string;
  notes?: string;
  /** The day, `YYYY-MM-DD`. */
  date: string;
  /** `HH:MM`; without `start` and `end` the event lasts all day. */
  start?: string;
  /** `HH:MM`; at or before `start`, the event ends the next day (night shift). */
  end?: string;
}

/** What `expo-calendar`'s `createEvent` expects. */
export interface CalendarEventDetails {
  title: string;
  notes: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  timeZone: string;
}

function deviceTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

function nextDay(isoDate: string): string {
  const day = new Date(`${isoDate}T00:00:00Z`);
  day.setUTCDate(day.getUTCDate() + 1);
  return day.toISOString().slice(0, 10);
}

function localDateTime(isoDate: string, time: string): Date {
  const [year = 0, month = 1, day = 1] = isoDate.split("-").map(Number);
  const [hours = 0, minutes = 0] = time.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes);
}

function utcMidnight(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00Z`);
}

/**
 * Converts an app event to `expo-calendar`'s format. Timed events are in
 * local time and may end the next day; an all-day event is set at UTC
 * midnight with the `"UTC"` time zone — what Android requires, otherwise it
 * shows up a day off depending on the device's time zone.
 *
 * @param event - See {@link CalendarEventInput}.
 * @param timeZone - Time zone of timed events. @defaultValue the device's
 * @returns The details to pass to `calendar.createEvent()`.
 */
export function toCalendarEventDetails(
  event: CalendarEventInput,
  timeZone: string = deviceTimeZone(),
): CalendarEventDetails {
  if (event.start && event.end) {
    const endDay = event.end <= event.start ? nextDay(event.date) : event.date;
    return {
      title: event.title,
      notes: event.notes ?? "",
      startDate: localDateTime(event.date, event.start),
      endDate: localDateTime(endDay, event.end),
      allDay: false,
      timeZone,
    };
  }
  return {
    title: event.title,
    notes: event.notes ?? "",
    startDate: utcMidnight(event.date),
    endDate: utcMidnight(nextDay(event.date)),
    allDay: true,
    timeZone: "UTC",
  };
}
