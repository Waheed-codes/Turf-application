"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import DateSelector from "@/components/booking/date-selector";
import { generateUpcomingDates } from "@/data/mockHome";
import HomeIcon from "@/app/home/home-icon";
import type { Venue, VenueSport } from "@/types/venue";
import { playingAreas, selectedArea, bookingQuery, dateLabel, mockPrice, timeLabel, venueSlots, resolvedSlots, type BookingContext } from "@/lib/booking-context";

export function PriceDetails({ venue, context }: { venue: Venue; context: BookingContext }) {
  const price = mockPrice(venue, context);
  if (!price.duration) return null;
  return <section className="mt-7 border-t border-neutral-100 pt-6" aria-label="Price Details"><h2 className="text-base font-semibold">Price Details</h2><dl className="mt-4 space-y-3 text-sm">{[["Slot subtotal", price.slotPrice], ["Platform Fee", price.platformFee], ["Taxes", price.taxes], ["Total", price.total]].map(([label, amount]) => <div key={label} className={`flex justify-between gap-4 ${label === "Total" ? "border-t border-neutral-200 pt-3 font-semibold" : "text-neutral-500"}`}><dt>{label}</dt><dd className="font-semibold text-neutral-950">₹{Number(amount).toLocaleString("en-IN")}</dd></div>)}</dl><p className="mt-3 text-xs text-neutral-500">Preview pricing only; no slot is reserved.</p></section>;
}

export function SportDetails({ venue, sport }: { venue: Venue; sport: VenueSport }) {
  const config = venue.sportConfigurations?.[sport];
  if (!config) return null;
  return <section aria-label="Selected Sport Details" className="mt-4"><dl className="grid grid-cols-2 gap-3 text-sm">{[["Dimensions", config.dimensions], [config.countLabel, config.count], ["Surface", config.surface]].map(([label, value]) => <div key={label}><dt className="text-xs text-neutral-500">{label}</dt><dd className="mt-1 font-medium">{value}</dd></div>)}</dl></section>;
}
export function BookingSummary({ venue, context }: { venue: Venue; context: BookingContext }) {
  const slots = resolvedSlots(venue, context);
  if (!slots.length) return null;
  return <section aria-label="Selected booking" className="mt-7 rounded-xl border border-neutral-200 p-4 text-sm"><h2 className="font-semibold">Your Selection</h2><p className="mt-2">{context.sport}</p><p>{selectedArea(venue, context.sport, context.areaId)?.name}</p><p>{dateLabel(context.date)}</p><ul className="mt-3 space-y-2">{slots.map((slot) => <li key={slot.id} className="flex flex-wrap justify-between gap-2"><span>{timeLabel(slot.start)} – {timeLabel(slot.end)}</span><span className="font-semibold">₹{slot.price.toLocaleString("en-IN")}</span></li>)}</ul><p className="mt-3 text-xs text-neutral-500">{`${slots.length} ${slots.length === 1 ? "slot" : "slots"} selected`}</p></section>;
}

export default function BookingSelection({ venue, initialDate, context, onChange, requested, initialSport }: { venue: Venue; initialDate: string; context: BookingContext | null; onChange: (context: BookingContext | null) => void; requested?: BookingContext; initialSport?: VenueSport }) {
  const [sport, setSport] = useState<VenueSport | "">(requested?.sport ?? context?.sport ?? initialSport ?? "");
  const [date, setDate] = useState(requested?.date ?? context?.date ?? initialDate);
  const [dates] = useState(() => generateUpcomingDates(7, requested?.date ?? context?.date ?? initialDate));
  const [areaId, setAreaId] = useState(() => context?.areaId ?? (sport ? playingAreas(venue, sport)[0]?.id : undefined));
  const areas = sport ? playingAreas(venue, sport) : [];
  const areaLabel = sport ? venue.sportConfigurations?.[sport]?.countLabel.slice(0, -1).toLowerCase() : "area";
  const visibleSlots = sport && areaId ? venueSlots(venue, sport, date, areaId) : [];
  const chosen = context && context.sport === sport && context.date === date && context.areaId === areaId ? resolvedSlots(venue, context) : [];
  const selectedIds = new Set(chosen.map((slot) => slot.id));
  const slotList = useRef<HTMLDivElement>(null);
  // Reveal the initial Home selection without hiding the rest of the day's schedule.
  useEffect(() => {
    const list = slotList.current;
    const selected = list?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (list && selected) list.scrollLeft = selected.offsetLeft;
  }, []);
  return <div id="booking-selection" tabIndex={-1} className="mt-7 scroll-mt-6 focus:outline-none">
    {!requested && <fieldset><legend className="text-base font-semibold">Available Sports</legend><p className="mt-1 text-xs text-neutral-500">Select a sport to see its sample slots and pricing.</p><div className="mt-4 flex gap-3 overflow-x-auto pb-2">{venue.sports.map((item) => <button key={item} type="button" aria-pressed={sport === item} onClick={() => { if (sport !== item) { setSport(item); setAreaId(playingAreas(venue, item)[0]?.id); onChange(null); } }} className={`flex min-h-20 min-w-24 flex-col items-center justify-center gap-2 rounded-2xl border px-3 py-2 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 ${sport === item ? "border-black bg-black text-white" : "border-neutral-200 bg-white"}`}><HomeIcon name="ball" className="size-6" />{item}</button>)}</div></fieldset>}
    {sport && <SportDetails venue={venue} sport={sport} />}
    {requested ? <p className="mt-4 text-sm text-neutral-500">{requested.sport} · {dateLabel(requested.date)}<br />Requested time: {timeLabel(requested.start)} – {timeLabel(requested.end)}</p> : <DateSelector dates={dates} date={date} onChange={(value) => { if (date !== value) { setDate(value); onChange(null); } }} />}
    {areas.length > 1 && <fieldset className="mt-5 min-w-0"><legend className="text-base font-semibold">Select {areaLabel}</legend><div className="mt-3 flex gap-2 overflow-x-auto pb-1">
      {areas.map((area) => <button key={area.id} type="button" aria-pressed={areaId === area.id} onClick={() => { if (areaId !== area.id) { setAreaId(area.id); onChange(null); } }} className={`min-h-11 shrink-0 rounded-full border px-4 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 ${areaId === area.id ? "border-black bg-black text-white" : "border-neutral-200 bg-white"}`}>{area.name}</button>)}
    </div></fieldset>}
    <fieldset className="mt-7 min-w-0"><legend className="text-base font-semibold">Select a slot</legend><p className="mt-1 text-xs text-neutral-500">{sport ? "Swipe for more times. Grey slots are unavailable in this demo." : "Choose a sport first."}</p>
      <div ref={slotList} aria-label="Available time slots" tabIndex={0} className="relative mt-4 grid w-full min-w-0 max-w-full grid-flow-col grid-rows-2 auto-cols-[44%] gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden p-1 pb-3 focus-visible:outline-2">
        {visibleSlots.map((slot) => {
          const candidate: BookingContext = { source: "discovery", sport: sport as VenueSport, date, areaId, start: slot.start, end: slot.end };
          const available = slot.available;
          const selected = available && selectedIds.has(slot.id);
          return <button key={slot.id} type="button" disabled={!available} aria-pressed={selected} onClick={() => {
            if (!candidate || !available) return;
            const slots = (selected ? chosen.filter((entry) => entry.id !== slot.id) : [...chosen, slot]).sort((a, b) => a.start.localeCompare(b.start));
            onChange(slots.length ? requested ? { ...requested, areaId, slots } : { ...candidate, start: slots[0].start, end: slots[slots.length - 1].end, slots } : null);
          }} className={`min-h-11 min-w-0 rounded-lg border px-1 py-2 text-[0.625rem] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 disabled:border-neutral-100 disabled:bg-neutral-100 disabled:text-neutral-400 ${selected ? "border-black bg-black text-white" : "border-neutral-200 bg-white"}`}>{timeLabel(slot.start)} – {timeLabel(slot.end)}<span className="mt-1 block font-normal">₹{slot.price.toLocaleString("en-IN")}</span></button>;
        })}
      </div>
    </fieldset>
  </div>;
}

export function BookingCta({ venue, context }: { venue: Venue; context: BookingContext | null }) {
  if (context && !resolvedSlots(venue, context).length) context = null;
  const href = context ? `/venues/${venue.id}/book?${bookingQuery(context)}` : "";
  return <div className="fixed inset-x-6 bottom-[calc(1rem+env(safe-area-inset-bottom))] mx-auto flex max-w-sm items-center gap-3 rounded-full border border-neutral-100 bg-white p-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
    {context && <div className="shrink-0 pl-3"><p className="text-[0.625rem] font-semibold tracking-wider text-neutral-500">TOTAL</p><p className="text-lg font-bold">₹{mockPrice(venue, context).total.toLocaleString("en-IN")}</p></div>}
    {context ? <Link href={href} className="flex min-h-11 flex-1 items-center justify-center rounded-full bg-black px-4 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-4">BOOK NOW</Link> : <button type="button" disabled className="min-h-11 w-full cursor-not-allowed rounded-full bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">BOOK NOW</button>}
  </div>;
}
