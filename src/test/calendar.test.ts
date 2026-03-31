import { describe, it, expect } from "vitest";
import { buildCalendarUrl, buildReminderUrl } from "@/lib/calendar";

describe("buildCalendarUrl", () => {
  it("should return a Google Calendar URL with encoded event name", () => {
    const url = buildCalendarUrl("Grace Hopper 2026", "2026-09-15");
    expect(url).toContain("calendar.google.com/calendar/render");
    expect(url).toContain("action=TEMPLATE");
    expect(url).toContain(encodeURIComponent("[SheSignal] Apply by: Grace Hopper 2026"));
  });

  it("should include start and end dates in the URL", () => {
    const url = buildCalendarUrl("Test Event", "2026-06-01");
    expect(url).toContain("dates=");
    // Start date should be June 1st 2026
    expect(url).toContain("20260601");
  });

  it("should set a 1-hour event duration", () => {
    const url = buildCalendarUrl("Test", "2026-06-01T12:00:00Z");
    const datesMatch = url.match(/dates=([^&]+)/);
    expect(datesMatch).not.toBeNull();
    const [start, end] = datesMatch![1].split("/");
    // End should be 1 hour after start
    const startDate = new Date(
      start.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, "$1-$2-$3T$4:$5:$6Z")
    );
    const endDate = new Date(
      end.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, "$1-$2-$3T$4:$5:$6Z")
    );
    expect(endDate.getTime() - startDate.getTime()).toBe(3600000);
  });
});

describe("buildReminderUrl", () => {
  it("should return a Google Calendar URL for the day before the deadline", () => {
    const url = buildReminderUrl("Scholarship Deadline", "2026-06-15");
    expect(url).toContain("calendar.google.com/calendar/render");
    expect(url).toContain(encodeURIComponent("[SheSignal] TOMORROW: Scholarship Deadline deadline!"));
    // Should be June 14th (day before June 15th)
    expect(url).toContain("20260614");
  });

  it("should include reminder details text", () => {
    const url = buildReminderUrl("Test", "2026-03-01");
    expect(url).toContain(encodeURIComponent("Tomorrow is the deadline! Don't miss it."));
  });
});
