import Image from "next/image";
import Link from "next/link";
import HomeIcon from "@/app/home/home-icon";
import { bookingQuery, type BookingContext } from "@/lib/booking-context";
import type { Venue } from "@/types/venue";

export default function VenueCard({ venue, bookingContext }: { venue: Venue; bookingContext?: BookingContext | null }) {
  return (
    <Link href={`/venues/${venue.id}${bookingContext ? `?${bookingQuery(bookingContext)}` : ""}`} aria-label={`View ${venue.name}`} className="flex w-full items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3 text-left shadow-xs transition-colors hover:bg-neutral-100 active:bg-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
      <Image src={venue.image} alt={venue.imageDescription} width={80} height={80} className="size-16 shrink-0 rounded-lg object-cover min-[360px]:size-20" />
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <span className="min-w-0 text-sm leading-5 font-semibold">{venue.name}</span>
          <span aria-label={`Rating ${venue.rating.toFixed(1)} out of 5`} className="flex shrink-0 items-center gap-1 pt-0.5 text-[0.625rem] font-semibold"><span aria-hidden="true">★</span>{venue.rating.toFixed(1)}</span>
        </span>
        <span className="mt-1 flex items-start gap-1 text-[0.625rem] leading-4 text-neutral-500"><HomeIcon name="location" className="mt-0.5 size-3 shrink-0" />{venue.area}, {venue.city}</span>
        {bookingContext && <span className="mt-1 block text-xs text-neutral-500">{bookingContext.sport}</span>}
        <span className="mt-1.5 block text-right"><span className="block text-[0.625rem] leading-3 text-neutral-500">From</span><span className="text-xs font-semibold">₹{(bookingContext ? venue.sportConfigurations?.[bookingContext.sport]?.hourlyPrice ?? venue.startingPricePerHour : venue.startingPricePerHour).toLocaleString("en-IN")}<span className="text-[0.625rem]">/hr</span></span></span>
      </span>
    </Link>
  );
}

