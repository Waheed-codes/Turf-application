import type { PlayingArea, Venue, VenueSport } from "@/types/venue";

export type SelectedSlot = { id?: string; start: string; end: string };
export type VenueSlot = SelectedSlot & { id: string; areaId: string; date: string; available: boolean; price: number };
export type BookingContext = {
  source: "availability" | "discovery";
  sport: VenueSport;
  date: string;
  start: string;
  end: string;
  slots?: SelectedSlot[];
  areaId?: string;
  searchSport?: VenueSport | "all";
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
        if (value.id !== undefined && typeof value.id !== "string") return null;
        slots.push({ start: value.start, end: value.end, ...(value.id ? { id: value.id } : {}) });
      }
      slots.sort((a, b) => a.start.localeCompare(b.start));
      if (slots.some((slot, i) => i > 0 && slot.start < slots![i - 1].end)) return null;
      // Availability start/end retain the original Home search; edited slots may extend beyond it.
      if (source === "discovery" && (start !== slots[0].start || end !== slots[slots.length - 1].end)) return null;
    } catch { return null; }
  }
  const areaId = query.areaId;
  if (areaId !== undefined && (typeof areaId !== "string" || !/^(court|turf|ground)-[1-9]\d*$/.test(areaId))) return null;
  const searchSport = query.searchSport;
  if (searchSport !== undefined && searchSport !== "all" && searchSport !== "Football" && searchSport !== "Badminton" && searchSport !== "Box Cricket") return null;
  return { source, sport, date, start, end, ...(areaId ? { areaId } : {}), ...(slots ? { slots } : {}), ...(searchSport ? { searchSport } : {}) };
}
// An all-sports search is valid, but a booking still needs a concrete sport.
export type AvailabilityContext = Omit<BookingContext, "sport"> & { sport: VenueSport | "all" };
export function readAvailabilityContext(query: Query): AvailabilityContext | null {
  const context = readBookingContext(query.sport === "all" ? { ...query, sport: "Football" } : query);
  if (!context || context.source !== "availability") return null;
  return { ...context, sport: query.sport === "all" ? "all" : context.sport };
}
// A Home match must cover the whole window on one sport and one playing area.
export function venueAvailabilityContext(venue: Venue, context: AvailabilityContext): BookingContext | null {
  const slots = requestedWindowSlots(context.start, context.end);
  if (!slots.length) return null;
  const sports = context.sport === "all" ? venue.sports : [context.sport];
  for (const sport of sports) {
    for (const area of playingAreas(venue, sport)) {
      if (context.areaId && context.areaId !== area.id) continue;
      const booking: BookingContext = { ...context, sport, searchSport: context.searchSport ?? context.sport, areaId: area.id, slots };
      if (mockAvailable(venue, booking)) return { ...booking, slots: resolvedSlots(venue, booking) };
    }
  }
  return null;
}
export function bookingQuery(context: AvailabilityContext) {
  const { slots, ...rest } = context;
  return new URLSearchParams({ ...rest, ...(slots ? { slots: JSON.stringify(slots.map(({ id, start, end }) => ({ ...(id ? { id } : {}), start, end }))) } : {}) }).toString();
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
  return context.slots ?? (context.source === "availability" ? [] : [{ start: context.start, end: context.end }]);
}
const minutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
export function playingAreas(venue: Venue, sport: VenueSport): PlayingArea[] {
  return venue.sportConfigurations?.[sport]?.playingAreas ?? [];
}
export function selectedArea(venue: Venue, sport: VenueSport, areaId?: string) {
  const areas = playingAreas(venue, sport);
  return areaId ? areas.find((area) => area.id === areaId) : areas.length === 1 ? areas[0] : undefined;
}
function areaSchedule(area: PlayingArea, date: string) {
  return area.dates[date] ?? area.weeklySchedule[new Date(`${date}T12:00:00Z`).getUTCDay()];
}
export function mockAvailable(venue: Venue, context: BookingContext): boolean {
  if (!venue.sports.includes(context.sport)) return false;
  // Window-only requests require a complete match; edited selections validate only their current slots.
  if (context.source === "availability" && !context.slots?.length) return venueAvailabilityContext(venue, context) !== null;
  const selections = selectedSlots(context);
  return selections.length > 0 && resolvedSlots(venue, context).length === selections.length;
}

// The one court/date schedule used by rendering, selection, availability and pricing.
export function venueSlots(venue: Venue, sport: VenueSport, date: string, areaId?: string): VenueSlot[] {
  const area = selectedArea(venue, sport, areaId);
  if (!area) return [];
  const schedule = areaSchedule(area, date);
  return sampleSlots.map(({ start, end }) => ({
    id: [venue.id, sport, date, area.id, start, end].join("|"),
    start, end, areaId: area.id, date,
    available: date >= indiaToday() && !!schedule && !schedule.blockedHours.some((hour) => minutes(start) < (hour + 1) * 60 && minutes(end) > hour * 60),
    price: slotPrice(venue, sport, { start, end }, area.id, date),
  }));
}

export function resolvedSlots(venue: Venue, context: BookingContext): VenueSlot[] {
  const selections = selectedSlots(context);
  return venueSlots(venue, context.sport, context.date, context.areaId).filter((slot) => slot.available && selections.some((selected) =>
    selected.id ? selected.id === slot.id && selected.start === slot.start && selected.end === slot.end : selected.start === slot.start && selected.end === slot.end
  ));
}

export function slotPrice(venue: Venue, sport: VenueSport, slot: SelectedSlot, areaId?: string, date?: string) {
  const config = venue.sportConfigurations?.[sport];
  const area = selectedArea(venue, sport, areaId);
  const schedule = area && date ? areaSchedule(area, date) : undefined;
  let total = 0;
  for (let cursor = minutes(slot.start); cursor < minutes(slot.end);) {
    const hour = Math.floor(cursor / 60);
    const next = Math.min(minutes(slot.end), (hour + 1) * 60);
    total += (schedule?.priceByHour?.[hour] ?? area?.priceByHour[hour] ?? area?.hourlyPrice ?? config?.priceByHour[hour] ?? config?.hourlyPrice ?? venue.startingPricePerHour) * (next - cursor) / 60;
    cursor = next;
  }
  return Math.round(total);
}
export function mockPrice(venue: Venue, context: BookingContext) {
  const slots = resolvedSlots(venue, context);
  const subtotal = slots.reduce((sum, slot) => sum + slot.price, 0);
  const duration = slots.reduce((sum, slot) => sum + minutes(slot.end) - minutes(slot.start), 0);
  const platformFee = slots.length ? 30 : 0;
  const taxes = Math.round(subtotal * 0.015);
  return { slotPrice: subtotal, platformFee, taxes, total: subtotal + platformFee + taxes, duration };
}
export const sampleSlots = Array.from({ length: 17 }, (_, index) => {
  const hour = index + 6;
  return { id: `slot-${hour}`, start: `${String(hour).padStart(2, "0")}:00`, end: `${String(hour + 1).padStart(2, "0")}:00` };
});

// Reject truncated windows, gaps, and times outside the mock slot schedule.
function requestedWindowSlots(start: string, end: string): SelectedSlot[] {
  const slots = sampleSlots.filter((slot) => slot.start >= start && slot.end <= end);
  if (!slots.length || slots[0].start !== start || slots[slots.length - 1].end !== end) return [];
  if (slots.some((slot, index) => index > 0 && slots[index - 1].end !== slot.start)) return [];
  return slots.map(({ start, end }) => ({ start, end }));
}
