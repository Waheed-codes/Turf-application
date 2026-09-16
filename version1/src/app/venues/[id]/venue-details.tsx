"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import HomeIcon from "@/app/home/home-icon";
import { useFavorites } from "@/hooks/use-favorites";
import { type BookingContext } from "@/lib/booking-context";
import BookingSelection, { BookingCta, BookingSummary, PriceDetails } from "./booking-selection";
import type { Venue } from "@/types/venue";

const action = "flex size-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-950 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black";

function MapPreview({ address }: { address: string }) {
  return <section aria-label="Location" className="mt-6">
    <div role="img" aria-label={`Illustrative map for ${address}; not a real map`} className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
      <svg aria-hidden="true" viewBox="0 0 320 120" className="h-32 w-full" preserveAspectRatio="none"><rect width="320" height="120" fill="#e5e5e5"/><g fill="none" stroke="#fafafa" strokeWidth="5"><path d="M0 25h320M0 82h320M45 0v120M115 0v120M220 0v120M290 0v120M0 110 180 0M150 120 320 10"/></g></svg>
      <HomeIcon name="location" className="absolute top-1/2 left-1/2 size-8 -translate-x-1/2 -translate-y-1/2" />
    </div>
    <p className="mt-2 text-sm leading-6 text-neutral-500">{address}</p>
    <p className="text-xs text-neutral-500">Map preview only</p>
    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.replace(" (sample location)", ""))}`} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center rounded-full border border-black px-5 text-xs font-semibold focus-visible:outline-2">SHOW IN MAP <span className="sr-only">(opens a new tab)</span></a>
  </section>;
}

export default function VenueDetails({ venue, bookingContext, initialDate }: { venue: Venue; bookingContext: BookingContext | null; initialDate: string }) {
  const preselected = bookingContext?.source === "availability";
  const [selection, setSelection] = useState<BookingContext | null>(bookingContext);

  const router = useRouter();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const favorite = favoriteIds.includes(venue.id);
  const [message, setMessage] = useState("");
  const [shareUrl, setShareUrl] = useState("");

  async function share() {
    const url = `${window.location.origin}/venues/${encodeURIComponent(venue.id)}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: venue.name, text: `Take a look at ${venue.name}`, url });
        return;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setMessage("Venue link copied.");
        return;
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
    }
    setShareUrl(url);
    setMessage("Copy the venue link below to share it.");
  }

  return (
    <main className="min-h-svh bg-neutral-50 pb-[calc(8rem+env(safe-area-inset-bottom))] font-sans text-neutral-950">
      <div className="mx-auto w-full max-w-md">
        <div className="relative h-64 bg-neutral-200 sm:h-80">
          <Image src={venue.image} alt={venue.imageDescription} fill priority sizes="(max-width: 448px) 100vw, 448px" className="object-cover grayscale" />
          <button type="button" aria-label="Back" onClick={() => { if (window.history.length > 1) router.back(); else router.replace("/search"); }} className={`absolute top-6 left-6 ${action}`}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5"><path d="M19 12H5m7-7-7 7 7 7"/></svg>
          </button>
          <div className="absolute right-6 bottom-10 flex gap-3">
            <button type="button" aria-label={favorite ? "Remove from favorites" : "Add to favorites"} aria-pressed={favorite} onClick={() => { toggleFavorite(venue.id); setMessage(favorite ? "Removed from preview favorites." : "Added to preview favorites."); }} className={action}><HomeIcon name="heart" className={`size-5 ${favorite ? "fill-neutral-950" : ""}`} /></button>
            <button type="button" aria-label="Share venue" onClick={share} className={action}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m9 10 6-4m-6 8 6 4"/></svg></button>
          </div>
        </div>
        <article className="relative mx-4 -mt-6 rounded-3xl border border-neutral-100 bg-white px-5 py-6 sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <h1 className="min-w-0 text-2xl leading-8 font-semibold tracking-tight [overflow-wrap:anywhere]">{venue.name}</h1>
            <span aria-label={`Rating ${venue.rating} out of 5`} className="shrink-0 rounded-md bg-neutral-100 px-2 py-1 text-xs font-semibold">★ {venue.rating.toFixed(1)}</span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-neutral-500"><HomeIcon name="location" className="size-4" /><span>{venue.area}, {venue.city}</span><span className="rounded bg-neutral-100 px-2 py-1 text-[0.625rem] font-semibold text-neutral-700 uppercase">{venue.sport}</span></div>
          <dl className="mt-7 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
            {[["Dimensions", venue.dimensions], ["Surface", venue.surface], ["Type", venue.setting], ...(venue.courts ? [["Courts", String(venue.courts)]] : [])].map(([label, value]) => <div key={label}><dt className="text-xs text-neutral-500">{label}</dt><dd className="mt-1 font-medium">{value}</dd></div>)}
          </dl>
          {preselected && <section className="mt-7" aria-labelledby="available-sports"><h2 id="available-sports" className="text-xs font-semibold tracking-widest text-neutral-500">AVAILABLE SPORTS</h2><ul className="mt-4 flex flex-wrap gap-4">{venue.sports.map((sport) => <li key={sport} className="flex flex-col items-center gap-2"><span className="flex size-11 items-center justify-center rounded-full bg-neutral-100"><HomeIcon name="ball" /></span><span className="text-[0.625rem] font-semibold uppercase">{sport}</span></li>)}</ul></section>}
          <section className="mt-7" aria-labelledby="amenities"><h2 id="amenities" className="text-xs font-semibold tracking-widest text-neutral-500">AMENITIES</h2><ul className="mt-3 flex flex-wrap gap-2">{venue.amenities.map((amenity) => <li key={amenity} className="rounded-full border border-neutral-100 bg-neutral-50 px-3 py-2 text-xs text-neutral-600"><span aria-hidden="true" className="mr-1">✓</span>{amenity}</li>)}</ul></section>
          <p className="mt-6 text-sm leading-6 text-neutral-500">{venue.description}</p>
          {!preselected && <BookingSelection venue={venue} initialDate={initialDate} context={selection} onChange={setSelection} />}
          {selection && <BookingSummary context={selection} />}
          {selection && <PriceDetails venue={venue} context={selection} />}
          <MapPreview address={venue.address} />
          <div className="mt-6 flex items-end justify-between gap-4 border-t border-neutral-100 pt-5"><span className="text-sm text-neutral-500">Starting from</span><p className="text-xl font-semibold">₹{venue.startingPricePerHour.toLocaleString("en-IN")}<span className="text-sm font-normal text-neutral-500">/hr</span></p></div>
          <p className="mt-3 text-xs leading-5 text-neutral-500">{selection ? "Sample venue information and pricing. No booking has been made." : "Sample venue information and pricing. Choose a sport, date and slot to continue."}</p>
          <p role="status" className="mt-3 text-sm leading-5 text-neutral-600">{message}</p>
          {shareUrl && <label className="mt-3 block text-sm">Venue link<input readOnly value={shareUrl} onFocus={(event) => event.currentTarget.select()} className="mt-2 w-full min-w-0 rounded-lg border border-neutral-300 p-2 focus-visible:outline-2" /></label>}
        </article>
      </div>
      <BookingCta venue={venue} context={selection} preselected={preselected} />
    </main>
  );
}
