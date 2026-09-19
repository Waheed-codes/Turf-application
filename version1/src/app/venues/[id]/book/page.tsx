import { notFound } from "next/navigation";
import { getMockVenue } from "@/data/mockVenues";
import { mockAvailable, readBookingContext, type Query } from "@/lib/booking-context";
import ConfirmBooking from "./confirm-booking";

export default async function BookingPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Query> }) {
  const venue = getMockVenue((await params).id);
  if (!venue) notFound();
  const candidate = readBookingContext(await searchParams);
  const context = candidate && (candidate.source !== "availability" || candidate.slots?.length) && mockAvailable(venue, candidate) ? candidate : null;
  return <ConfirmBooking venue={venue} context={context} />;
}
