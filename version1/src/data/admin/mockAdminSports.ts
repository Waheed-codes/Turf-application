import { services } from "@/components/manager/manager-onboarding-provider";
import { mockAdminVenues } from "./mockAdminVenues";
import { mockAdminBookings } from "./mockAdminBookings";

export type SportIcon = { kind: "builtin"; id: string } | { kind: "upload"; src: string };
export type AdminSport = { id: string; name: string; icon: SportIcon; active: boolean; venueCount: number };
export type SportValues = Pick<AdminSport, "name" | "icon" | "active">;

// Reuse platform identifiers and existing fixtures, without changing Manager state.
const definitions = new Map(services.map(sport => [sport.id, { id: sport.id, name: sport.label }]));
for (const venue of mockAdminVenues) {
  for (const sport of venue.selectedSports) {
    if (!definitions.has(sport.id)) definitions.set(sport.id, { id: sport.id, name: sport.label });
  }
}
export const mockAdminSports: AdminSport[] = Array.from(definitions.values(), sport => ({
  ...sport, icon: { kind: "builtin", id: sport.id }, active: true,
  venueCount: mockAdminVenues.filter(venue => venue.selectedSports.some(item => item.id === sport.id)).length,
}));

// Count confirmed/completed bookings, excluding cancellations and unpaid holds.
export function mostBookedSport(sports: AdminSport[]): string {
  const counts = new Map<string, number>();
  for (const booking of mockAdminBookings) {
    if (booking.status === "CONFIRMED" || booking.status === "COMPLETED") counts.set(booking.sportId, (counts.get(booking.sportId) ?? 0) + 1);
  }
  const ranked = sports.filter(sport => counts.has(sport.id)).sort((a, b) => (counts.get(b.id) ?? 0) - (counts.get(a.id) ?? 0) || a.name.localeCompare(b.name));
  return ranked[0]?.name ?? "No bookings";
}
