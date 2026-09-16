import type { Booking } from "@/types/booking";

// UI examples only; these records are not real reservations.
export const mockBookings: Booking[] = [
  { id: "sample-completed-01", venueId: "elite-smash", sport: "Badminton", startsAt: "2026-09-13T18:00:00+05:30", status: "COMPLETED" },
  { id: "sample-confirmed-01", venueId: "goal-post", sport: "Football", startsAt: "2026-10-01T20:00:00+05:30", status: "CONFIRMED" },
  { id: "sample-cancelled-01", venueId: "sixer-central", sport: "Box Cricket", startsAt: "2026-09-11T19:00:00+05:30", status: "CANCELLED" },
];
