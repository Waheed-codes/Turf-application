import { notFound } from "next/navigation";
import { getMockVenue } from "@/data/mockVenues";
import { indiaToday, mockAvailable, venueAvailabilityContext, readBookingContext, type Query } from "@/lib/booking-context";
import VenueDetails from "./venue-details";

export default async function VenuePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Query> }) {
  const venue = getMockVenue((await params).id);
  if (!venue) notFound();
  const query = await searchParams;
  const initialSport = query.source === "book-again" ? venue.sports.find((sport) => sport === query.sport) : undefined;
  const parsed = readBookingContext(query);
  const candidate = parsed?.source === "availability" && !parsed.slots?.length ? venueAvailabilityContext(venue, parsed) : parsed;
  const context = candidate && mockAvailable(venue, candidate) ? candidate : null;
  return <VenueDetails key={`${venue.id}:${JSON.stringify(context)}:${initialSport ?? ""}`} venue={venue} bookingContext={context} initialDate={indiaToday()} initialSport={initialSport} />;
}
