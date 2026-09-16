"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import HomeIcon from "@/app/home/home-icon";
import type { Venue, VenueSport } from "@/types/venue";
import { bookingQuery, dateLabel, mockAvailable, mockPrice, sampleSlots, timeLabel, type BookingContext } from "@/lib/booking-context";

export function PriceDetails({ venue, context }: { venue: Venue; context: BookingContext }) {
  const price = mockPrice(venue, context);
  return <section className="mt-7 border-t border-neutral-100 pt-6" aria-label="Price Details"><h2 className="text-base font-semibold">Price Details</h2><dl className="mt-4 space-y-3 text-sm">{[["Slot Price", price.slotPrice], ["Platform Fee", price.platformFee], ["Taxes", price.taxes], ["Total", price.total]].map(([label, amount]) => <div key={label} className={`flex justify-between gap-4 ${label === "Total" ? "border-t border-neutral-200 pt-3 font-semibold" : "text-neutral-500"}`}><dt>{label}</dt><dd className="font-semibold text-neutral-950">₹{Number(amount).toLocaleString("en-IN")}</dd></div>)}</dl><p className="mt-3 text-xs text-neutral-500">Preview pricing only; no slot is reserved.</p></section>;
}

export function BookingSummary({ context }: { context: BookingContext }) {
  return <section aria-label="Selected booking" className="mt-7 rounded-xl border border-neutral-200 p-4 text-sm"><h2 className="font-semibold">Your selection</h2><p className="mt-2">{context.sport}</p><p>{dateLabel(context.date)}</p><p>{timeLabel(context.start)} – {timeLabel(context.end)}</p></section>;
}

export default function BookingSelection({ venue, initialDate, context, onChange }: { venue: Venue; initialDate: string; context: BookingContext | null; onChange: (context: BookingContext | null) => void }) {
  const [sport, setSport] = useState<VenueSport | "">(context?.sport ?? "");
  const [date, setDate] = useState(context?.date ?? initialDate);
  const scrollRef = useRef<HTMLDivElement>(null);
  return <div id="booking-selection" tabIndex={-1} className="mt-7 scroll-mt-6 focus:outline-none">
    <fieldset><legend className="text-base font-semibold">Available Sports</legend><p className="mt-1 text-xs text-neutral-500">Select a sport to see its sample slots and pricing.</p><div className="mt-4 flex gap-3 overflow-x-auto pb-2">{venue.sports.map((item) => <button key={item} type="button" aria-pressed={sport === item} onClick={() => { setSport(item); onChange(null); }} className={`flex min-h-28 min-w-28 flex-col items-center justify-center gap-3 rounded-2xl border p-4 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 ${sport === item ? "border-black bg-neutral-100" : "border-neutral-200"}`}><HomeIcon name="ball" className="size-6" />{item}</button>)}</div></fieldset>
    <label className="mt-5 block text-sm font-medium">Select date<input type="date" value={date} min={initialDate} onChange={(event) => { setDate(event.target.value); onChange(null); }} className="mt-2 block min-h-11 max-w-full rounded-xl border border-neutral-200 bg-white p-2 focus-visible:outline-2" /></label>
    <fieldset className="mt-7 min-w-0"><legend className="text-base font-semibold">Select a slot</legend><p className="mt-1 text-xs text-neutral-500">{sport ? "Swipe for more times. Grey slots are unavailable in this demo." : "Choose a sport first."}</p>
      <div ref={scrollRef} aria-label="Available time slots" tabIndex={0} className="mt-4 grid grid-flow-col grid-rows-2 auto-cols-max gap-2 overflow-x-auto p-1 pb-3 focus-visible:outline-2">
        {sampleSlots.map((slot) => {
          const candidate: BookingContext | null = sport && date ? { source: "discovery", sport, date, start: slot.start, end: slot.end } : null;
          const available = candidate && date >= initialDate && mockAvailable(venue, candidate);
          const selected = context?.start === slot.start && context?.end === slot.end;
          return <button key={slot.id} type="button" disabled={!available} aria-pressed={selected} onClick={() => onChange(candidate)} className={`min-h-11 whitespace-nowrap rounded-lg border px-3 py-2 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 disabled:border-neutral-100 disabled:bg-neutral-100 disabled:text-neutral-400 ${selected ? "border-black bg-black text-white" : "border-neutral-200 bg-white"}`}>{timeLabel(slot.start)} – {timeLabel(slot.end)}</button>;
        })}
      </div>
    </fieldset>
  </div>;
}

export function BookingCta({ venue, context, preselected }: { venue: Venue; context: BookingContext | null; preselected: boolean }) {
  const href = context ? `/venues/${venue.id}/book?${bookingQuery(context)}` : "";
  if (preselected) return <div className="fixed inset-x-6 bottom-[calc(1rem+env(safe-area-inset-bottom))] mx-auto max-w-sm rounded-full border border-neutral-100 bg-white p-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)]"><Link href={href} className="flex min-h-11 w-full items-center justify-center rounded-full bg-black px-6 py-2 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-4">Book Now →</Link></div>;
  return <div className="fixed inset-x-0 bottom-0 border-t border-neutral-200 bg-white px-6 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))]"><div className="mx-auto flex max-w-sm items-center justify-between gap-4">
    {context && <div className="shrink-0"><p className="text-[0.625rem] font-semibold tracking-wider text-neutral-500">TOTAL</p><p className="text-xl font-bold">₹{mockPrice(venue, context).total.toLocaleString("en-IN")}</p></div>}
    {context ? <Link href={href} className="flex min-h-12 flex-1 items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-4">BOOK NOW</Link> : <button type="button" onClick={() => { const target = document.getElementById("booking-selection"); target?.scrollIntoView({ behavior: "smooth", block: "start" }); target?.focus({ preventScroll: true }); }} className="min-h-12 w-full rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-4">BOOK NOW!</button>}
  </div></div>;
}
