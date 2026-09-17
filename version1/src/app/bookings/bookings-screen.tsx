"use client";

import Link from "next/link";
import { useState } from "react";
import CustomerNavigation from "@/components/navigation/customer-navigation";
import { getMockVenue } from "@/data/mockVenues";
import type { Booking, BookingStatus } from "@/types/booking";

const statusStyles: Record<BookingStatus, string> = {
  CONFIRMED: "border-neutral-200 bg-neutral-100 text-neutral-700",
  COMPLETED: "border-neutral-200 bg-transparent text-neutral-500",
  CANCELLED: "border-neutral-300 bg-neutral-50 text-neutral-500",
};
const dateFormat = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "2-digit", month: "short", timeZone: "Asia/Kolkata" });
const timeFormat = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" });

export default function BookingsScreen({ bookings }: { bookings: Booking[] }) {
  const [notice, setNotice] = useState("");
  const sortedBookings = [...bookings].sort((a, b) => Date.parse(b.startsAt) - Date.parse(a.startsAt));

  function openBooking(booking: Booking) {
    // Replace this notice with navigation to /bookings/:bookingId when built.
    setNotice(`Booking details are not available yet. Reference: ${booking.id}.`);
  }

  return (
    <main className="min-h-svh bg-neutral-50 px-6 pt-8 pb-[calc(8rem+env(safe-area-inset-bottom))] font-sans text-neutral-950">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight">Recent Bookings</h1>
        {sortedBookings.length ? (
          <ul className="mt-6 divide-y divide-neutral-200">
            {sortedBookings.map((booking) => {
              const venue = getMockVenue(booking.venueId);
              const startsAt = new Date(booking.startsAt);
              return <li key={booking.id}>
                <button type="button" onClick={() => openBooking(booking)} aria-label={`View booking for ${venue?.name ?? "Venue"}, ${booking.status.toLowerCase()}`} className="flex min-h-24 w-full items-center justify-between gap-3 rounded-sm py-5 text-left hover:bg-neutral-100 active:bg-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm leading-6 font-semibold [overflow-wrap:anywhere]">{venue?.name ?? "Venue unavailable"}</span>
                    <span className="mt-0.5 block text-xs leading-5 text-neutral-500">{booking.sport} · {venue?.area ?? "Location unavailable"} · <time dateTime={booking.startsAt}>{dateFormat.format(startsAt)} · {timeFormat.format(startsAt)}</time></span>
                  </span>
                  <span className={`shrink-0 rounded border px-2 py-1 text-[0.5625rem] font-semibold tracking-wide ${statusStyles[booking.status]}`}>{booking.status}</span>
                </button>
                {venue && (booking.status === "COMPLETED" || booking.status === "CANCELLED") && <div className="flex justify-end pb-2">
                  <Link href={`/venues/${venue.id}?${new URLSearchParams({ source: "book-again", sport: booking.sport })}`} aria-label={`Book ${venue.name} again`} className="inline-flex min-h-11 items-center rounded-md px-3 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 hover:text-black active:bg-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">Book Again <span aria-hidden="true" className="ml-1">→</span></Link>
                </div>}
              </li>;
            })}
          </ul>
        ) : (
          <section className="py-20 text-center">
            <h2 className="text-xl font-semibold">No bookings yet</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-500">Your venue bookings will appear here.</p>
            <Link href="/search" className="mt-8 flex min-h-12 w-full items-center justify-center rounded-full bg-black px-6 py-3 font-semibold text-white hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black">Find Venues</Link>
          </section>
        )}
        <p role="status" className="mt-4 text-center text-sm leading-5 text-neutral-600">{notice}</p>
      </div>
      <CustomerNavigation active="/bookings" onUnavailable={setNotice} />
    </main>
  );
}
