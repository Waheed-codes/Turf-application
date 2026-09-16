import { notFound } from "next/navigation";
import { getMockVenue } from "@/data/mockVenues";
import { indiaToday, mockAvailable, readBookingContext, type Query } from "@/lib/booking-context";
import VenueDetails from "./venue-details";

export default async function VenuePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Query> }) {
  const venue = getMockVenue((await params).id);
  if (!venue) notFound();
  const candidate = readBookingContext(await searchParams);
  const context = candidate && mockAvailable(venue, candidate) ? candidate : null;
  return <VenueDetails key={`${venue.id}:${JSON.stringify(context)}`} venue={venue} bookingContext={context} initialDate={indiaToday()} />;
}
