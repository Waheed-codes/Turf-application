"use client";

import { useEffect, useState } from "react";
import { useManagerOnboarding, type BookingSource, type BookingStatus } from "@/components/manager/manager-onboarding-provider";
import { ManagerBottomNav } from "@/components/manager/manager-bottom-nav";
import { ManagerDialog } from "@/components/manager/manager-dialog";
import { BookingDetails } from "@/components/manager/booking-details";
import { bookingAmount, bookingDateLabel, bookingStatus, bookingTimeRange } from "@/components/manager/booking-utils";

const tabs = [
  { label: "Upcoming", status: "CONFIRMED" },
  { label: "Completed", status: "COMPLETED" },
  { label: "Cancelled", status: "CANCELLED" },
] as const;
type Filters = { sportId: string; resourceId: string; source: "" | BookingSource };
const emptyFilters: Filters = { sportId: "", resourceId: "", source: "" };
const selectClass = "mt-2 min-h-12 w-full min-w-0 rounded-xl border border-neutral-300 bg-white px-3 text-base focus-visible:outline-2 focus-visible:outline-neutral-900";

export default function ManagerBookingsPage() {
  const { mockBookings } = useManagerOnboarding();
  const [tab, setTab] = useState<BookingStatus>("CONFIRMED");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [draft, setDraft] = useState<Filters>(emptyFilters);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    const refresh = () => setNow(Date.now());
    window.addEventListener("focus", refresh);
    return () => { window.clearInterval(timer); window.removeEventListener("focus", refresh); };
  }, []);
  const selected = mockBookings.find((booking) => booking.id === selectedId);
  const sports = [...new Map(mockBookings.map((booking) => [booking.sportId, booking.sportName])).entries()];
  const areas = [...new Map(mockBookings.filter((booking) => !draft.sportId || booking.sportId === draft.sportId).map((booking) => [booking.resourceId, { name: booking.playingAreaName, sportName: booking.sportName }])).entries()];
  const tabBookings = mockBookings.filter((booking) => bookingStatus(booking, now) === tab);
  const visible = tabBookings.filter((booking) => (!filters.sportId || booking.sportId === filters.sportId)
    && (!filters.resourceId || booking.resourceId === filters.resourceId)
    && (!filters.source || booking.bookingType === filters.source)
    && (booking.customerName ?? "").toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()))
    .sort((a, b) => (a.date.localeCompare(b.date) || a.startMinutes - b.startMinutes) * (tab === "CONFIRMED" ? 1 : -1));
  const hasFilters = Boolean(filters.sportId || filters.resourceId || filters.source);
  const activeLabel = tabs.find((item) => item.status === tab)!.label;

  return <div className="mx-auto min-h-dvh w-full max-w-md bg-white font-sans text-neutral-900">
    <header className="border-b border-neutral-100 px-5 pt-[env(safe-area-inset-top)]"><h1 className="flex min-h-[72px] items-center text-xl font-bold tracking-tight">Bookings</h1></header>
    <main className="px-5 pb-[calc(7rem+env(safe-area-inset-bottom))]">
      <div role="tablist" aria-label="Booking status" className="flex gap-5 border-b border-neutral-100 min-[375px]:gap-6">
        {tabs.map((item, index) => <button key={item.status} id={`tab-${item.status}`} role="tab" type="button" aria-selected={tab === item.status} aria-controls="booking-results" tabIndex={tab === item.status ? 0 : -1} onClick={() => setTab(item.status)} onKeyDown={(event) => {
          const next = event.key === "ArrowRight" ? (index + 1) % tabs.length : event.key === "ArrowLeft" ? (index + tabs.length - 1) % tabs.length : event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : null;
          if (next !== null) { event.preventDefault(); setTab(tabs[next].status); document.getElementById(`tab-${tabs[next].status}`)?.focus(); }
        }} className={`min-h-[52px] border-b-2 text-sm focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-neutral-900 ${tab === item.status ? "border-neutral-950 font-semibold text-neutral-950" : "border-transparent text-neutral-400"}`}>{item.label}</button>)}
      </div>
      <div className="my-4 flex min-w-0 gap-3">
        <div className="relative min-w-0 flex-1"><label htmlFor="booking-search" className="sr-only">Search by customer name</label><svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute top-3.5 left-3.5 size-4 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="10" cy="10" r="6" /><path d="m15 15 5 5" /></svg><input id="booking-search" type="search" placeholder="Search by customer name" value={search} onChange={(event) => setSearch(event.target.value)} className="min-h-11 w-full min-w-0 rounded-full border border-neutral-100 bg-neutral-50 py-2 pr-3 pl-10 text-sm placeholder:text-neutral-400 focus-visible:outline-2 focus-visible:outline-neutral-900" /></div>
        <button type="button" aria-label={hasFilters ? "Filter bookings (filters active)" : "Filter bookings"} aria-haspopup="dialog" onClick={() => { setDraft(filters); setFilterOpen(true); }} className={`flex size-11 shrink-0 items-center justify-center rounded-full border focus-visible:outline-2 focus-visible:outline-offset-2 ${hasFilters ? "border-neutral-950 bg-neutral-950 text-white" : "border-neutral-100 text-neutral-600 hover:bg-neutral-50"}`}><svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /><circle cx="9" cy="6" r="2" fill={hasFilters ? "var(--color-black)" : "var(--color-white)"} /><circle cx="15" cy="12" r="2" fill={hasFilters ? "var(--color-black)" : "var(--color-white)"} /><circle cx="10" cy="18" r="2" fill={hasFilters ? "var(--color-black)" : "var(--color-white)"} /></svg></button>
      </div>
      <section id="booking-results" role="tabpanel" aria-labelledby={`tab-${tab}`} tabIndex={0} className="space-y-4 focus-visible:outline-2 focus-visible:outline-neutral-900">
        <p role="status" className="sr-only">{visible.length} {activeLabel.toLowerCase()} bookings</p>
        {visible.map((booking) => <button key={booking.id} type="button" aria-haspopup="dialog" onClick={() => setSelectedId(booking.id)} className="block w-full cursor-pointer rounded-2xl border border-neutral-200 bg-white p-4 text-left shadow-sm hover:border-neutral-400 hover:bg-neutral-50 active:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900">
          <span className="flex items-start justify-between gap-3"><span className="min-w-0 flex-1"><span className="block font-semibold leading-5 [overflow-wrap:anywhere]">{booking.customerName || "Customer name not provided"}</span><span className="mt-1 block text-xs text-neutral-500 [overflow-wrap:anywhere]">{booking.playingAreaName} • {booking.sportName}</span></span><span className={`max-w-[40%] shrink-0 text-right ${booking.amount !== null ? "text-sm font-bold" : "text-[10px] text-neutral-500"}`}>{booking.amount !== null ? bookingAmount(booking.amount) : booking.bookingType === "OFFLINE" ? "Offline Booking" : "Online Booking"}</span></span>
          <span className="mt-4 flex flex-wrap items-center justify-between gap-x-2 gap-y-2"><span className="flex min-w-0 items-start gap-1.5 text-[10px] leading-4 text-neutral-500"><svg aria-hidden="true" viewBox="0 0 24 24" className="mt-0.5 size-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 5h14v16H5zM8 3v4m8-4v4M5 10h14" /></svg><span>{bookingDateLabel(booking.date, now)}, {bookingTimeRange(booking.startMinutes, booking.endMinutes)}</span></span><span className={`ml-auto rounded-full px-3 py-1 text-[9px] font-semibold tracking-wide ${tab === "CONFIRMED" ? "bg-neutral-950 text-white" : "bg-neutral-100 text-neutral-600"}`}>{tab}</span></span>
        </button>)}
        {visible.length === 0 && <div className="py-16 text-center"><p className="text-sm font-medium text-neutral-600">{tabBookings.length === 0 ? `No ${activeLabel.toLowerCase()} bookings` : "No matching bookings"}</p>{tabBookings.length > 0 && <button type="button" onClick={() => { setSearch(""); setFilters(emptyFilters); }} className="mt-3 min-h-11 rounded-lg px-4 text-sm underline underline-offset-4 focus-visible:outline-2">Clear search and filters</button>}</div>}
      </section>
    </main>
    <ManagerBottomNav active="Bookings" />
    {selected && <ManagerDialog title="Booking Details" onDismiss={() => setSelectedId(null)}><BookingDetails booking={selected} now={now} /></ManagerDialog>}
    {filterOpen && <ManagerDialog title="Filter bookings" onDismiss={() => setFilterOpen(false)}><form className="mt-4" onSubmit={(event) => { event.preventDefault(); setFilters(draft); setFilterOpen(false); }}>
      <label htmlFor="filter-sport" className="block text-sm font-medium">Sport</label><select id="filter-sport" value={draft.sportId} onChange={(event) => setDraft((current) => ({ ...current, sportId: event.target.value, resourceId: "" }))} className={selectClass}><option value="">All sports</option>{sports.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select>
      <label htmlFor="filter-area" className="mt-4 block text-sm font-medium">Playing Area</label><select id="filter-area" value={draft.resourceId} onChange={(event) => setDraft((current) => ({ ...current, resourceId: event.target.value }))} className={selectClass}><option value="">All playing areas</option>{areas.map(([id, area]) => <option key={id} value={id}>{area.name} • {area.sportName}</option>)}</select>
      <label htmlFor="filter-source" className="mt-4 block text-sm font-medium">Booking Source</label><select id="filter-source" value={draft.source} onChange={(event) => setDraft((current) => ({ ...current, source: event.target.value as Filters["source"] }))} className={selectClass}><option value="">All</option><option value="ONLINE">Online</option><option value="OFFLINE">Offline</option></select>
      <div className="mt-6 grid grid-cols-2 gap-3"><button type="button" onClick={() => setDraft(emptyFilters)} className="min-h-12 rounded-xl border border-neutral-300 px-3 text-sm font-semibold hover:bg-neutral-50 focus-visible:outline-2">Reset</button><button type="submit" className="min-h-12 rounded-xl bg-neutral-950 px-3 text-sm font-semibold text-white hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900">Apply Filters</button></div>
    </form></ManagerDialog>}
  </div>;
}
