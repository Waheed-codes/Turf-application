import assert from "node:assert/strict";
import test from "node:test";
import { deriveAnalytics } from "./analytics-utils.ts";

const area = (id, sportId = "cricket", name = "Pitch 1") => ({ id, sportId, name, sportLabel: sportId, resourceType: "pitch" });
const slot = (startMinutes, endMinutes, enabled = true) => ({ id: `${startMinutes}-${endMinutes}`, startMinutes, endMinutes, enabled });
const schedule = (slots) => ({ openingMinutes: slots[0]?.startMinutes ?? 0, closingMinutes: slots.at(-1)?.endMinutes ?? 0, durationMinutes: 30, slots });
const booking = (update = {}) => ({ id: "b1", resourceId: "a", sportId: "cricket", sportName: "Cricket", playingAreaName: "Old name", date: "2026-09-17", startMinutes: 360, endMinutes: 420, bookingType: "OFFLINE", status: "CONFIRMED", amount: null, ...update });
const input = (update = {}) => ({ selectedSports: [{ id: "cricket", label: "Cricket" }, { id: "custom-padel", label: "Padel" }], playingAreas: [area("a", "cricket", "Main Turf"), area("b"), area("c", "custom-padel", "Custom Court")], schedulesByResource: { a: schedule([slot(360, 390), slot(390, 420), slot(420, 450, false)]), b: schedule([slot(480, 540)]) }, bookings: [], days: 7, today: "2026-09-17", ...update });

test("capacity uses resource schedules; overlapping bookings count an occurrence once", () => {
  const result = deriveAnalytics(input({ bookings: [booking(), booking({ id: "overlap", startMinutes: 375, endMinutes: 405 })] }));
  assert.equal(result.totalBookings, 2);
  assert.equal(result.capacity, 21);
  assert.equal(result.occupied, 2);
  assert.equal(result.occupancy, 2 / 21 * 100);
  assert.equal(result.resources[0].capacity, 14);
  assert.equal(result.resources[0].occupancy, 2 / 14 * 100);
  assert.equal(result.resources[1].occupied, 0);
  assert.equal(result.resources[2].occupancy, null);
  assert.equal(result.resources[0].area.name, "Main Turf");
  assert.equal(result.resources[2].sportName, "Padel");
  assert.equal(result.revenue, null);
  assert.equal(result.hours[6], 2);
});

test("cancelled and unknown-resource bookings do not contribute to any metric", () => {
  const result = deriveAnalytics(input({ bookings: [booking({ status: "CANCELLED", amount: 500 }), booking({ resourceId: "unknown", amount: 800 })] }));
  assert.equal(result.totalBookings, 0);
  assert.equal(result.revenue, null);
  assert.equal(result.occupied, 0);
  assert.equal(result.hours.reduce((sum, n) => sum + n, 0), 0);
  assert.ok(result.resources.every((resource) => resource.bookings === 0 && resource.peakHour === null));
  assert.ok(result.trend.every((point) => point.revenue === null));
});

test("7/30/90 days include today, exclude future dates, and group known amounts", () => {
  const bookings = [booking(), booking({ id: "older", date: "2026-09-01", bookingType: "ONLINE", status: "COMPLETED", amount: 100 }), booking({ id: "oldest", date: "2026-07-01", amount: 200 }), booking({ id: "future", date: "2026-09-18", amount: 999 })];
  for (const [days, count, revenue, groups] of [[7, 1, null, 7], [30, 2, 100, 5], [90, 3, 300, 6]]) {
    const result = deriveAnalytics(input({ bookings, days }));
    assert.equal(result.totalBookings, count);
    assert.equal(result.revenue, revenue);
    assert.equal(result.trend.length, groups);
    assert.equal(result.trend.reduce((sum, point) => sum + (point.revenue ?? 0), 0), revenue ?? 0);
    assert.equal(result.hours[6], count);
  }
});

test("known zero differs from missing amounts; starts drive peak hours", () => {
  const result = deriveAnalytics(input({ bookings: [booking({ amount: 0, startMinutes: 1110, endMinutes: 1200 }), booking({ startMinutes: 1140, endMinutes: 1200 }), booking({ startMinutes: 1140, endMinutes: 1200 })] }));
  assert.equal(result.revenue, 0);
  assert.equal(result.missingAmounts, 2);
  assert.equal(result.resources[0].peakHour, 19);
  assert.equal(result.hours[18], 1);
  assert.equal(result.hours[19], 2);
});

test("edited schedules change capacity and overlap coverage without changing bookings", () => {
  const bookings = [booking()];
  const original = deriveAnalytics(input({ bookings }));
  const edited = deriveAnalytics(input({ bookings, schedulesByResource: { a: schedule([slot(360, 420)]) } }));
  assert.equal(original.resources[0].occupied, 2);
  assert.equal(edited.resources[0].occupied, 1);
  assert.equal(edited.resources[0].capacity, 7);
  assert.equal(edited.totalBookings, original.totalBookings);
});

test("overnight slots use operating date and normalize start hours; empty setup is safe", () => {
  const result = deriveAnalytics(input({ schedulesByResource: { a: schedule([slot(1410, 1470), slot(1470, 1530)]) }, bookings: [booking({ startMinutes: 1470, endMinutes: 1530 })] }));
  assert.equal(result.occupied, 1);
  assert.equal(result.hours[0], 1);
  assert.equal(result.resources[0].peakHour, 0);
  assert.equal(deriveAnalytics(input({ playingAreas: [], schedulesByResource: {} })).occupancy, 0);
});
