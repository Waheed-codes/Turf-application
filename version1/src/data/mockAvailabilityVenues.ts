import { withPlayingAreas } from "./mockPlayingAreas";
import type { Venue, VenueSport } from "@/types/venue";

// Frontend fixtures only. Availability is simulated within 06:00–23:00.
const fixtures: { id: string; name: string; area: string; rating: number; sports: VenueSport[]; price: number }[] = [
  { id: "arena-7", name: "Arena 7 Sports", area: "Gachibowli", rating: 4.8, sports: ["Badminton", "Box Cricket", "Football"], price: 800 },
  { id: "smash-point", name: "Smash Point Arena", area: "Kondapur", rating: 4.7, sports: ["Badminton"], price: 700 },
  { id: "goal-line", name: "Goal Line Turf", area: "Madhapur", rating: 4.6, sports: ["Football", "Box Cricket"], price: 1200 },
  { id: "shuttle-court", name: "Shuttle Court", area: "Manikonda", rating: 4.9, sports: ["Badminton"], price: 900 },
  { id: "playzone", name: "PlayZone Sports", area: "Jubilee Hills", rating: 4.5, sports: ["Football", "Badminton", "Box Cricket"], price: 1000 },
];
export const mockAvailabilityVenues: Venue[] = fixtures.map((fixture) => {
  const sport = fixture.sports[0];
  const imageSport = sport === "Box Cricket" ? "cricket" : sport.toLowerCase();
  return {
    id: fixture.id, name: fixture.name, area: fixture.area, city: "Hyderabad", rating: fixture.rating,
    sport, sports: fixture.sports, startingPricePerHour: fixture.price, mockDistanceKm: 2,
    image: `/images/venues/${imageSport}.svg`, imageDescription: `Illustrative ${sport} venue`,
    amenities: ["Parking", "Changing Room", "Drinking Water", "Floodlights"],
    description: "Sample sports venue for testing the booking flow. No live availability or reservations.",
    dimensions: sport === "Badminton" ? "44 ft × 20 ft" : "120 ft × 70 ft", surface: "Synthetic surface", setting: sport === "Badminton" ? "Indoor" : "Outdoor",
    address: `${fixture.area}, Hyderabad, Telangana (sample location)`,
    sportConfigurations: Object.fromEntries(fixture.sports.map((item) => [item, withPlayingAreas({
      dimensions: item === "Badminton" ? "44 ft × 20 ft" : item === "Box Cricket" ? "100 ft × 60 ft" : "120 ft × 70 ft",
      surface: item === "Badminton" ? "Synthetic court" : "Synthetic turf", count: item === "Badminton" ? 3 : 1,
      countLabel: item === "Badminton" ? "Courts" : item === "Box Cricket" ? "Turfs" : "Grounds",
      hourlyPrice: fixture.price, blockedHours: [9, 13], priceByHour: {},
    })])),
  };
});
