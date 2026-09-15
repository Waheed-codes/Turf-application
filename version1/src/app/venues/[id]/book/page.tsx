import Link from "next/link";
import { notFound } from "next/navigation";
import { getMockVenue } from "@/data/mockVenues";

export default async function BookingPlaceholder({ params }: { params: Promise<{ id: string }> }) {
  const venue = getMockVenue((await params).id);
  if (!venue) notFound();
  return <main className="min-h-svh bg-white px-6 py-12 font-sans text-neutral-950"><div className="mx-auto max-w-sm">
    <Link href={`/venues/${venue.id}`} replace className="inline-flex min-h-11 items-center text-sm underline focus-visible:outline-2">Back to venue</Link>
    <h1 className="mt-8 text-2xl font-semibold">Book {venue.name}</h1>
    <p className="mt-4 leading-7 text-neutral-500">Court, date and time selection will be available in a future update. No booking has been made.</p>
  </div></main>;
}
