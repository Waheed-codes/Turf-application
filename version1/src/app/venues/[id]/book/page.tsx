import Link from "next/link";
import { notFound } from "next/navigation";
import { getMockVenue } from "@/data/mockVenues";
import { bookingQuery, mockAvailable, readBookingContext, type Query } from "@/lib/booking-context";
import { BookingSummary, PriceDetails } from "../booking-selection";

export default async function BookingPlaceholder({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Query> }) {
  const venue = getMockVenue((await params).id);
  if (!venue) notFound();
  const candidate = readBookingContext(await searchParams);
  const context = candidate && mockAvailable(venue, candidate) ? candidate : null;
  return <main className="min-h-svh bg-white px-6 py-12 font-sans text-neutral-950"><div className="mx-auto max-w-sm">
    <Link href={`/venues/${venue.id}${context ? `?${bookingQuery(context)}` : ""}`} replace className="inline-flex min-h-11 items-center text-sm underline focus-visible:outline-2">Back to venue</Link>
    <h1 className="mt-8 text-2xl font-semibold">Book {venue.name}</h1>
    {context && <><BookingSummary context={context} /><PriceDetails venue={venue} context={context} /></>}
    <p className="mt-4 leading-7 text-neutral-500">{context ? "Your selection is carried forward for this preview. Booking confirmation and payment are not available yet. No slot is reserved." : "Choose a sport, date and slot on the venue page to continue. No booking has been made."}</p>
  </div></main>;
}
