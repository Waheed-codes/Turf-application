import { notFound } from "next/navigation";
import { getMockVenue } from "@/data/mockVenues";
import VenueDetails from "./venue-details";

export default async function VenuePage({ params }: { params: Promise<{ id: string }> }) {
  const venue = getMockVenue((await params).id);
  if (!venue) notFound();
  return <VenueDetails key={venue.id} venue={venue} />;
}
