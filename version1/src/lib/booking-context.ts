import type { Venue, VenueSport } from "@/types/venue";

export type BookingContext = {
  source: "availability" | "discovery";
  sport: VenueSport;
  date: string;
  start: string;
  end: string;
};
export type Query = Record<string, string | string[] | undefined>;
export function readBookingContext(query: Query): BookingContext | null {
  const { source, sport, date, start, end } = query;
  if (source !== "availability" && source !== "discovery") return null;
  if (sport !== "Football" && sport !== "Badminton" && sport !== "Box Cricket") return null;
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const parsed = new Date(`${date}T00:00:00Z`);
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) return null;
  if (typeof start !== "string" || typeof end !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(start) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(end) || start >= end) return null;
  return { source, sport, date, start, end };
}
export function bookingQuery(context: BookingContext) {
  return new URLSearchParams(context).toString();
}
export function timeLabel(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return `${hour % 12 || 12}:${String(minute).padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
}
export function dateLabel(date: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }).format(new Date(`${date}T12:00:00+05:30`));
}
export function indiaToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}
// Deterministic sample availability only: selected hours are blocked for every day.
export function mockAvailable(venue: Venue, context: BookingContext) {
  if (!venue.sports.includes(context.sport)) return false;
  const minutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
  const start = minutes(context.start), end = minutes(context.end);
  return start >= 360 && end <= 1380 && ![9, 13].some((hour) => start < (hour + 1) * 60 && end > hour * 60);
}
export function mockPrice(venue: Venue, context: BookingContext) {
  const minutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
  const duration = minutes(context.end) - minutes(context.start);
  const rate = venue.startingPricePerHour * (context.sport === venue.sport ? 1 : 0.85) * (context.start >= "18:00" ? 1.2 : 1);
  const slotPrice = Math.round(rate * duration / 60);
  const platformFee = 30;
  const taxes = Math.round(platformFee * 0.6);
  return { slotPrice, platformFee, taxes, total: slotPrice + platformFee + taxes, duration };
}
export const sampleSlots = Array.from({ length: 17 }, (_, index) => {
  const hour = index + 6;
  return { id: `slot-${hour}`, start: `${String(hour).padStart(2, "0")}:00`, end: `${String(hour + 1).padStart(2, "0")}:00` };
});
