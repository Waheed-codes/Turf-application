"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import CustomerNavigation from "@/components/navigation/customer-navigation";
import HomeIcon from "@/app/home/home-icon";
import { mockVenues } from "@/data/mockVenues";
import { useFavorites } from "@/hooks/use-favorites";

export default function FavoritesScreen() {
  const { favoriteIds, removeFavorite } = useFavorites();
  const [notice, setNotice] = useState("");
  const venues = mockVenues.filter((venue) => favoriteIds.includes(venue.id));

  return (
    <main className="min-h-svh bg-neutral-50 px-6 pt-8 pb-[calc(8rem+env(safe-area-inset-bottom))] font-sans text-neutral-950">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight">Favourites</h1>
        {venues.length ? (
          <ul className="mt-6 space-y-6">
            {venues.map((venue) => (
              <li key={venue.id} className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
                <Link href={`/venues/${venue.id}`} aria-label={`View ${venue.name}`} className="block rounded-3xl transition-colors hover:bg-neutral-50 active:bg-neutral-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-black">
                  <div className="relative aspect-[16/10] w-full bg-neutral-100">
                    <Image src={venue.image} alt={venue.imageDescription} fill sizes="(max-width: 432px) calc(100vw - 48px), 384px" className="object-cover" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="min-w-0 text-base leading-6 font-semibold [overflow-wrap:anywhere]">{venue.name}</h2>
                      <span aria-label={`Rating ${venue.rating.toFixed(1)} out of 5`} className="shrink-0 pt-1 text-xs font-semibold"><span aria-hidden="true">★ </span>{venue.rating.toFixed(1)}</span>
                    </div>
                    <p className="mt-1 text-sm text-neutral-500">{venue.sport} · {venue.area}</p>
                    <div className="mt-5 flex items-end justify-between gap-3">
                      <span className="flex items-center gap-1 text-xs text-neutral-500"><HomeIcon name="location" className="size-3 shrink-0" />{venue.mockDistanceKm.toFixed(1)} km away</span>
                      <span className="text-right"><span className="block text-xs text-neutral-500">Starts at</span><span className="mt-1 block text-base font-semibold">₹{venue.startingPricePerHour.toLocaleString("en-IN")}<span className="text-xs">/hr</span></span></span>
                    </div>
                  </div>
                </Link>
                <button type="button" aria-label={`Remove ${venue.name} from favourites`} aria-pressed="true" onClick={() => { removeFavorite(venue.id); setNotice(`${venue.name} removed from favourites.`); }} className="absolute top-3 right-3 flex size-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-950 shadow-sm hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"><HomeIcon name="heart" className="size-5 fill-current" /></button>
              </li>
            ))}
          </ul>
        ) : (
          <section className="flex flex-col items-center py-20 text-center">
            <HomeIcon name="heart" className="size-12 text-neutral-400" />
            <h2 className="mt-6 text-xl font-semibold">No favourites yet</h2>
            <p className="mt-3 max-w-xs text-sm leading-6 text-neutral-500">Save venues you like and they&apos;ll appear here.</p>
            <Link href="/search" className="mt-8 flex min-h-12 w-full items-center justify-center rounded-full bg-black px-6 py-3 font-semibold text-white hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black">Find Venues</Link>
          </section>
        )}
        <p role="status" className="mt-4 text-center text-sm leading-5 text-neutral-600">{notice}</p>
        {venues.length > 0 && <p className="mt-3 text-center text-[0.625rem] text-neutral-500">Sample venues, distances and illustrations</p>}
      </div>
      <CustomerNavigation active="/favorites" onUnavailable={setNotice} />
    </main>
  );
}
