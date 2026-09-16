import type { VenueSport } from "./venue";

export type BookingStatus = "CONFIRMED" | "COMPLETED" | "CANCELLED";

export type Booking = {
  id: string;
  venueId: string;
  sport: VenueSport;
  startsAt: string;
  status: BookingStatus;
};
