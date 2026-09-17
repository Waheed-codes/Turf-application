import type { MockBooking, PlayingArea, Schedule, Sport } from "./manager-onboarding-provider";

export type AnalyticsRange = 7 | 30 | 90;
export function analyticsDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function hourLabel(hour: number): string {
  return `${String(hour % 12 || 12).padStart(2, "0")} ${hour < 12 ? "AM" : "PM"}`;
}
function knownRevenue(bookings: MockBooking[]): number | null {
  const known = bookings.filter((booking) => booking.amount !== null && Number.isFinite(booking.amount));
  return known.length ? known.reduce((sum, booking) => sum + booking.amount!, 0) : null;
}
function startHours(bookings: MockBooking[]): number[] {
  const hours = Array<number>(24).fill(0);
  for (const booking of bookings) hours[Math.floor(booking.startMinutes / 60) % 24]++;
  return hours;
}

export function deriveAnalytics({ selectedSports, playingAreas, schedulesByResource, bookings, days, today }: {
  selectedSports: Sport[];
  playingAreas: PlayingArea[];
  schedulesByResource: Record<string, Schedule>;
  bookings: MockBooking[];
  days: AnalyticsRange;
  today: string;
}) {
  const dates = Array.from({ length: days }, (_, index) => {
    const date = new Date(`${today}T12:00:00`);
    date.setDate(date.getDate() - days + 1 + index);
    return analyticsDate(date);
  });
  const sports = new Map(selectedSports.map((sport) => [sport.id, sport]));
  const areas = playingAreas.filter((area) => sports.has(area.sportId));
  const resourceIds = new Set(areas.map((area) => area.id));
  // Booking.date is the operating date, including slots that end after midnight.
  const valid = bookings.filter((booking) => resourceIds.has(booking.resourceId) && booking.status !== "CANCELLED" && booking.date >= dates[0] && booking.date <= today);
  const byResource = new Map<string, MockBooking[]>();
  for (const booking of valid) {
    const group = byResource.get(booking.resourceId) ?? [];
    group.push(booking);
    byResource.set(booking.resourceId, group);
  }
  const resources = areas.map((area) => {
    const resourceBookings = byResource.get(area.id) ?? [];
    const slots = schedulesByResource[area.id]?.slots.filter((slot) => slot.enabled) ?? [];
    const capacity = slots.length * days;
    const byDate = new Map<string, MockBooking[]>();
    for (const booking of resourceBookings) {
      const group = byDate.get(booking.date) ?? [];
      group.push(booking);
      byDate.set(booking.date, group);
    }
    // Count each configured occurrence once, including overlaps after a duration edit.
    let occupied = 0;
    for (const dailyBookings of byDate.values()) {
      occupied += slots.filter((slot) => dailyBookings.some((booking) => booking.startMinutes < slot.endMinutes && booking.endMinutes > slot.startMinutes)).length;
    }
    const hours = startHours(resourceBookings);
    const peak = Math.max(...hours);
    return {
      area, sportName: sports.get(area.sportId)!.label,
      bookings: resourceBookings.length, revenue: knownRevenue(resourceBookings),
      capacity, occupied, occupancy: capacity ? occupied / capacity * 100 : null,
      // Resolve tied hours consistently: earliest start hour wins.
      peakHour: peak ? hours.indexOf(peak) : null,
    };
  });
  const groupSize = days === 7 ? 1 : days === 30 ? 7 : 15;
  const trend = Array.from({ length: Math.ceil(days / groupSize) }, (_, index) => {
    const from = dates[index * groupSize];
    const to = dates[Math.min((index + 1) * groupSize - 1, days - 1)];
    return { from, to, label: days === 7 ? String(Number(from.slice(-2))) : days === 30 ? `W${index + 1}` : `P${index + 1}`, revenue: knownRevenue(valid.filter((booking) => booking.date >= from && booking.date <= to)) };
  });
  const capacity = resources.reduce((sum, resource) => sum + resource.capacity, 0);
  const occupied = resources.reduce((sum, resource) => sum + resource.occupied, 0);
  return {
    from: dates[0], to: today, resources, trend,
    totalBookings: valid.length, revenue: knownRevenue(valid),
    missingAmounts: valid.filter((booking) => booking.amount === null || !Number.isFinite(booking.amount)).length,
    capacity, occupied, occupancy: capacity ? occupied / capacity * 100 : valid.length ? null : 0,
    hours: startHours(valid),
  };
}
export type ManagerAnalytics = ReturnType<typeof deriveAnalytics>;
