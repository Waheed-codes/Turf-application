"use client";

import { useState } from "react";
import Link from "next/link";
import DateSelector from "@/components/booking/date-selector";
import { generateUpcomingDates } from "@/data/mockHome";
import HomeIcon from "@/app/home/home-icon";
import type { Venue, VenueSport } from "@/types/venue";
import { bookingQuery, dateLabel, mockAvailable, mockPrice, sampleSlots, timeLabel, selectedSlots, slotPrice, type BookingContext } from "@/lib/booking-context";

export function PriceDetails({ venue, context }: { venue: Venue; context: BookingContext }) {
  const price = mockPrice(venue, context);
  return <section className="mt-7 border-t border-neutral-100 pt-6" aria-label="Price Details"><h2 className="text-base font-semibold">Price Details</h2><dl className="mt-4 space-y-3 text-sm">{[["Slot subtotal", price.slotPrice], ["Platform Fee", price.platformFee], ["Taxes", price.taxes], ["Total", price.total]].map(([label, amount]) => <div key={label} className={`flex justify-between gap-4 ${label === "Total" ? "border-t border-neutral-200 pt-3 font-semibold" : "text-neutral-500"}`}><dt>{label}</dt><dd className="font-semibold text-neutral-950">₹{Number(amount).toLocaleString("en-IN")}</dd></div>)}</dl><p className="mt-3 text-xs text-neutral-500">Preview pricing only; no slot is reserved.</p></section>;
}

export function SportDetails({ venue, sport }: { venue: Venue; sport: VenueSport }) {
  const config = venue.sportConfigurations?.[sport];
  if (!config) return null;
  return <section aria-label="Selected Sport Details" className="mt-4"><dl className="grid grid-cols-2 gap-3 text-sm">{[["Dimensions", config.dimensions], [config.countLabel, config.count], ["Surface", config.surface]].map(([label, value]) => <div key={label}><dt className="text-xs text-neutral-500">{label}</dt><dd className="mt-1 font-medium">{value}</dd></div>)}</dl></section>;
}
export function BookingSummary({ venue, context }: { venue: Venue; context: BookingContext }) {
  const slots = selectedSlots(context);
  return <section aria-label="Selected booking" className="mt-7 rounded-xl border border-neutral-200 p-4 text-sm"><h2 className="font-semibold">Your Selection</h2><p className="mt-2">{context.sport}</p><p>{dateLabel(context.date)}</p><ul className="mt-3 space-y-2">{slots.map((slot) => <li key={slot.start} className="flex flex-wrap justify-between gap-2"><span>{timeLabel(slot.start)} – {timeLabel(slot.end)}</span><span className="font-semibold">₹{slotPrice(venue, context.sport, slot).toLocaleString("en-IN")}</span></li>)}</ul><p className="mt-3 text-xs text-neutral-500">{slots.length} {slots.length === 1 ? "slot" : "slots"} selected</p></section>;
}

export default function BookingSelection({ venue, initialDate, context, onChange }: { venue: Venue; initialDate: string; context: BookingContext | null; onChange: (context: BookingContext | null) => void }) {
  const [sport, setSport] = useState<VenueSport | "">(context?.sport ?? "");
  const [date, setDate] = useState(context?.date ?? initialDate);
  const [dates] = useState(() => generateUpcomingDates(7, context?.date ?? initialDate));
  return <div id="booking-selection" tabIndex={-1} className="mt-7 scroll-mt-6 focus:outline-none">
    <fieldset><legend className="text-base font-semibold">Available Sports</legend><p className="mt-1 text-xs text-neutral-500">Select a sport to see its sample slots and pricing.</p><div className="mt-4 flex gap-3 overflow-x-auto pb-2">{venue.sports.map((item) => <button key={item} type="button" aria-pressed={sport === item} onClick={() => { if (sport !== item) { setSport(item); onChange(null); } }} className={`flex min-h-20 min-w-24 flex-col items-center justify-center gap-2 rounded-2xl border px-3 py-2 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 ${sport === item ? "border-black bg-black text-white" : "border-neutral-200 bg-white"}`}><HomeIcon name="ball" className="size-6" />{item}</button>)}</div></fieldset>
    {sport && <SportDetails venue={venue} sport={sport} />}
    <DateSelector dates={dates} date={date} onChange={(value) => { if (date !== value) { setDate(value); onChange(null); } }} />
    <fieldset className="mt-7 min-w-0"><legend className="text-base font-semibold">Select a slot</legend><p className="mt-1 text-xs text-neutral-500">{sport ? "Swipe for more times. Grey slots are unavailable in this demo." : "Choose a sport first."}</p>
      <div aria-label="Available time slots" tabIndex={0} className="mt-4 grid grid-flow-col grid-rows-2 auto-cols-max gap-2 overflow-x-auto p-1 pb-3 focus-visible:outline-2">
        {sampleSlots.map((slot) => {
          const candidate: BookingContext | null = sport && date ? { source: "discovery", sport, date, start: slot.start, end: slot.end } : null;
          const available = candidate && date >= initialDate && mockAvailable(venue, candidate);
          const chosen = context ? selectedSlots(context) : [];
          const selected = chosen.some((entry) => entry.start === slot.start && entry.end === slot.end);
          return <button key={slot.id} type="button" disabled={!available} aria-pressed={selected} onClick={() => {
            if (!candidate) return;
            const slots = (selected ? chosen.filter((entry) => entry.start !== slot.start) : [...chosen, { start: slot.start, end: slot.end }]).sort((a, b) => a.start.localeCompare(b.start));
            onChange(slots.length ? { ...candidate, start: slots[0].start, end: slots[slots.length - 1].end, slots } : null);
          }} className={`min-h-11 whitespace-nowrap rounded-lg border px-3 py-2 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 disabled:border-neutral-100 disabled:bg-neutral-100 disabled:text-neutral-400 ${selected ? "border-black bg-black text-white" : "border-neutral-200 bg-white"}`}>{timeLabel(slot.start)} – {timeLabel(slot.end)}{sport && <span className="ml-2 font-normal">₹{slotPrice(venue, sport, slot).toLocaleString("en-IN")}</span>}</button>;
        })}
      </div>
    </fieldset>
  </div>;
}

export function BookingCta({ venue, context }: { venue: Venue; context: BookingContext | null }) {
  const href = context ? `/venues/${venue.id}/book?${bookingQuery(context)}` : "";
  return <div className="fixed inset-x-6 bottom-[calc(1rem+env(safe-area-inset-bottom))] mx-auto flex max-w-sm items-center gap-3 rounded-full border border-neutral-100 bg-white p-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
    {context && <div className="shrink-0 pl-3"><p className="text-[0.625rem] font-semibold tracking-wider text-neutral-500">TOTAL</p><p className="text-lg font-bold">₹{mockPrice(venue, context).total.toLocaleString("en-IN")}</p></div>}
    {context ? <Link href={href} className="flex min-h-11 flex-1 items-center justify-center rounded-full bg-black px-4 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-4">BOOK NOW</Link> : <button type="button" disabled className="min-h-11 w-full cursor-not-allowed rounded-full bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">BOOK NOW</button>}
  </div>;
}
