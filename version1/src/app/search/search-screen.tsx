"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import CustomerNavigation from "@/components/navigation/customer-navigation";
import HomeIcon from "@/app/home/home-icon";
import { mockVenues, venueSports } from "@/data/mockVenues";
import { bookingQuery, dateLabel, mockAvailable, timeLabel, type BookingContext } from "@/lib/booking-context";
import type { Venue } from "@/types/venue";

function VenueCard({ venue, bookingContext }: { venue: Venue; bookingContext: BookingContext | null }) {
  return (
    <Link href={`/venues/${venue.id}${bookingContext ? `?${bookingQuery(bookingContext)}` : ""}`} aria-label={`View ${venue.name}`} className="flex w-full items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3 text-left shadow-xs transition-colors hover:bg-neutral-100 active:bg-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
      <Image src={venue.image} alt={venue.imageDescription} width={80} height={80} className="size-16 shrink-0 rounded-lg object-cover min-[360px]:size-20" />
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <span className="min-w-0 text-sm leading-5 font-semibold">{venue.name}</span>
          <span aria-label={`Rating ${venue.rating.toFixed(1)} out of 5`} className="flex shrink-0 items-center gap-1 pt-0.5 text-[0.625rem] font-semibold"><span aria-hidden="true">★</span>{venue.rating.toFixed(1)}</span>
        </span>
        <span className="mt-1 flex items-start gap-1 text-[0.625rem] leading-4 text-neutral-500"><HomeIcon name="location" className="mt-0.5 size-3 shrink-0" />{venue.area}, {venue.city}</span>
        <span className="mt-1.5 block text-right"><span className="block text-[0.625rem] leading-3 text-neutral-500">From</span><span className="text-xs font-semibold">₹{venue.startingPricePerHour.toLocaleString("en-IN")}<span className="text-[0.625rem]">/hr</span></span></span>
      </span>
    </Link>
  );
}

export default function SearchScreen({ bookingContext = null, initialQuery = "" }: { bookingContext?: BookingContext | null; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [notice, setNotice] = useState("");
  const search = query.trim().toLowerCase();
  const venues = mockVenues.filter((venue) => (!bookingContext || mockAvailable(venue, bookingContext)) && [venue.name, venue.sport, venue.area, venue.city].some((field) => field.toLowerCase().includes(search)));

  return (
    <main className="min-h-svh bg-neutral-50 px-6 pt-8 pb-[calc(8rem+env(safe-area-inset-bottom))] font-sans text-neutral-950">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight">Find Venues</h1>
        {bookingContext && <p className="mt-3 text-sm leading-6 text-neutral-500">{bookingContext.sport} · {dateLabel(bookingContext.date)} · {timeLabel(bookingContext.start)} – {timeLabel(bookingContext.end)}<span className="block text-xs">Mock availability results — no live availability check.</span></p>}
        <div className="mt-5 flex items-center gap-3">
          <label className="flex min-h-12 min-w-0 flex-1 items-center gap-2 rounded-full bg-white px-3 shadow-sm">
            <HomeIcon name="search" className="size-4 shrink-0 text-neutral-400" />
            <span className="sr-only">Search venues, sports, or location</span>
            <input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setNotice(""); }} placeholder="Search venues, sports, or location" className="min-h-12 w-full min-w-0 bg-transparent text-sm placeholder:text-neutral-400 focus:outline-none" />
          </label>
          <button type="button" aria-label="Filters" title="Filters" onClick={() => setNotice("Additional filters are not available yet.")} className="flex size-12 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5"><path d="M3 7h8m4 0h6M3 17h3m4 0h11" /><circle cx="13" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></svg>
          </button>
        </div>
        <p role="status" aria-atomic="true" className="sr-only">{venues.length} venues found</p>
        {venueSports.map((sport) => {
          const group = venues.filter((venue) => venue.sport === sport);
          if (!group.length) return null;
          return <section key={sport} aria-label={sport} className="mt-7">
            <h2 className="border-b border-neutral-200 pb-3 text-xs font-bold tracking-widest uppercase">{sport}</h2>
            <ul className="mt-3 space-y-3">{group.map((venue) => <li key={venue.id}><VenueCard venue={venue} bookingContext={bookingContext} /></li>)}</ul>
          </section>;
        })}
        {!venues.length && <div className="py-16 text-center"><h2 className="text-lg font-semibold">No venues found</h2><p className="mt-2 text-sm text-neutral-500">Try another venue, sport, or location.</p></div>}
        <p role="status" className="mt-5 text-center text-sm leading-5 text-neutral-600">{notice}</p>
        <p className="mt-3 text-center text-[0.625rem] text-neutral-500">Sample venues, prices and illustrations</p>
      </div>
      <CustomerNavigation active="/search" onUnavailable={setNotice} />
    </main>
  );
}
