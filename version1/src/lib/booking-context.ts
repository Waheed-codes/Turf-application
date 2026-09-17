import type { Venue, VenueSport } from "@/types/venue";

export type SelectedSlot = { start: string; end: string };
export type BookingContext = {
  source: "availability" | "discovery";
  sport: VenueSport;
  date: string;
  start: string;
  end: string;
  slots?: SelectedSlot[];
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
  let slots: SelectedSlot[] | undefined;
  if (query.slots !== undefined) {
    if (typeof query.slots !== "string") return null;
    try {
      const values: unknown = JSON.parse(query.slots);
      if (!Array.isArray(values) || !values.length || values.length > 24) return null;
      slots = [];
      for (const value of values) {
        if (!value || typeof value !== "object" || typeof value.start !== "string" || typeof value.end !== "string") return null;
        const validTime = /^([01]\d|2[0-3]):[0-5]\d$/;
        if (!validTime.test(value.start) || !validTime.test(value.end) || value.start >= value.end) return null;
        slots.push({ start: value.start, end: value.end });
      }
      slots.sort((a, b) => a.start.localeCompare(b.start));
      if (slots.some((slot, i) => i > 0 && slot.start < slots![i - 1].end)) return null;
      if (start !== slots[0].start || end !== slots[slots.length - 1].end) return null;
    } catch { return null; }
  }
  return { source, sport, date, start, end, ...(slots ? { slots } : {}) };
}
export function bookingQuery(context: BookingContext) {
  const { slots, ...rest } = context;
  return new URLSearchParams({ ...rest, ...(slots ? { slots: JSON.stringify(slots) } : {}) }).toString();
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
export function selectedSlots(context: BookingContext): SelectedSlot[] {
  return context.slots ?? [{ start: context.start, end: context.end }];
}
const minutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
export function mockAvailable(venue: Venue, context: BookingContext) {
  if (!venue.sports.includes(context.sport)) return false;
  const blocked = venue.sportConfigurations?.[context.sport]?.blockedHours ?? [9, 13];
  return selectedSlots(context).every((slot) => {
    const start = minutes(slot.start), end = minutes(slot.end);
    return start >= 360 && end <= 1380 && !blocked.some((hour) => start < (hour + 1) * 60 && end > hour * 60);
  });
}
export function slotPrice(venue: Venue, sport: VenueSport, slot: SelectedSlot) {
  const config = venue.sportConfigurations?.[sport];
  let total = 0;
  for (let cursor = minutes(slot.start); cursor < minutes(slot.end);) {
    const hour = Math.floor(cursor / 60);
    const next = Math.min(minutes(slot.end), (hour + 1) * 60);
    total += (config?.priceByHour[hour] ?? config?.hourlyPrice ?? venue.startingPricePerHour) * (next - cursor) / 60;
    cursor = next;
  }
  return Math.round(total);
}
export function mockPrice(venue: Venue, context: BookingContext) {
  const slots = selectedSlots(context);
  const subtotal = slots.reduce((sum, slot) => sum + slotPrice(venue, context.sport, slot), 0);
  const duration = slots.reduce((sum, slot) => sum + minutes(slot.end) - minutes(slot.start), 0);
  const platformFee = 30;
  const taxes = Math.round(subtotal * 0.015);
  return { slotPrice: subtotal, platformFee, taxes, total: subtotal + platformFee + taxes, duration };
}
export const sampleSlots = Array.from({ length: 17 }, (_, index) => {
  const hour = index + 6;
  return { id: `slot-${hour}`, start: `${String(hour).padStart(2, "0")}:00`, end: `${String(hour + 1).padStart(2, "0")}:00` };
});
