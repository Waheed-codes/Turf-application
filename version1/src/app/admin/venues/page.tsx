"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { AdminIcon } from "@/components/admin/admin-icon";
import { AdminVenueStatusBadge } from "@/components/admin/admin-venue-status";
import { useAdminVenues } from "@/components/admin/admin-venues-provider";
import { VENUES_PER_PAGE, venueStatusLabels, type AdminVenueStatus } from "@/data/admin/mockAdminVenues";

const tabs: { label: string; value: "" | AdminVenueStatus }[] = [
  { label: "All Venues", value: "" },
  { label: "Pending Approval", value: "PENDING_APPROVAL" },
  { label: "Live", value: "LIVE" },
  { label: "Rejected", value: "REJECTED" },
];
const control = "min-h-9 rounded-lg border border-neutral-200 bg-white px-3 text-xs text-neutral-600 focus-visible:outline-2 focus-visible:outline-neutral-800";

export default function VenuesPage() {
  const { venues } = useAdminVenues();
  const [query, setQuery] = useState("");
  const [sport, setSport] = useState("");
  const [area, setArea] = useState("");
  // Tabs and the Status select are two controls for the same filter.
  const [status, setStatus] = useState<"" | AdminVenueStatus>("");
  const [page, setPage] = useState(1);
  const sports = Array.from(new Map(venues.flatMap((venue) => venue.selectedSports.map((item) => [item.id, item.label] as const))).entries()).sort((a, b) => a[1].localeCompare(b[1]));
  const areas = Array.from(new Set(venues.map((venue) => venue.location.area))).sort();
  const filtered = venues.filter((venue) => venue.name.toLowerCase().includes(query.trim().toLowerCase()) && (!status || venue.status === status) && (!area || venue.location.area === area) && (!sport || venue.selectedSports.some((item) => item.id === sport)));
  const pageCount = Math.max(1, Math.ceil(filtered.length / VENUES_PER_PAGE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * VENUES_PER_PAGE;
  const shown = filtered.slice(start, start + VENUES_PER_PAGE);
  const changeStatus = (value: "" | AdminVenueStatus) => { setStatus(value); setPage(1); };
  const reset = () => { setQuery(""); setSport(""); setArea(""); setStatus(""); setPage(1); };
  const stats = [
    { label: "TOTAL VENUES", value: venues.length, icon: "venues" as const },
    { label: "LIVE", value: venues.filter((venue) => venue.status === "LIVE").length, icon: "check" as const },
    { label: "PENDING APPROVAL", value: venues.filter((venue) => venue.status === "PENDING_APPROVAL").length, icon: "clock" as const },
    { label: "REJECTED", value: venues.filter((venue) => venue.status === "REJECTED").length, icon: "close" as const },
  ];

  return <>
    <AdminPageHeader title="Venues" subtitle="Review and manage all listed venues" />
    <dl aria-label="Venue summary" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{stats.map((stat) => <AdminStatCard key={stat.label} {...stat} value={String(stat.value)} compact />)}</dl>
    <div role="group" aria-label="Venue status tabs" className="mt-5 flex flex-wrap gap-6 border-b border-neutral-200">{tabs.map((tab) => <button key={tab.label} type="button" aria-pressed={status === tab.value} onClick={() => changeStatus(tab.value)} className={`min-h-12 border-b-2 px-0.5 text-sm font-medium focus-visible:outline-2 focus-visible:-outline-offset-4 ${status === tab.value ? "border-neutral-900 text-neutral-900" : "border-transparent text-neutral-500 hover:text-neutral-900"}`}>{tab.label}</button>)}</div>
    <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-xs">
      <div className="relative min-w-[180px] flex-1"><label htmlFor="venue-search" className="sr-only">Search venue name</label><span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400"><AdminIcon name="search" /></span><input id="venue-search" type="search" placeholder="Search venue name" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} className={`${control} w-full bg-neutral-50 pr-3 pl-9 placeholder:text-neutral-500`} /></div>
      <label htmlFor="venue-sport" className="sr-only">Sport</label><select id="venue-sport" value={sport} onChange={(event) => { setSport(event.target.value); setPage(1); }} className={`${control} max-w-48`}><option value="">Sport: All</option>{sports.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select>
      <label htmlFor="venue-area" className="sr-only">Area</label><select id="venue-area" value={area} onChange={(event) => { setArea(event.target.value); setPage(1); }} className={`${control} max-w-48`}><option value="">Area: All</option>{areas.map((name) => <option key={name}>{name}</option>)}</select>
      <label htmlFor="venue-status" className="sr-only">Status</label><select id="venue-status" value={status} onChange={(event) => changeStatus(event.target.value as "" | AdminVenueStatus)} className={`${control} max-w-48`}><option value="">Status: All</option>{Object.entries(venueStatusLabels).map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select>
    </div>
    {shown.length > 0 ? <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{shown.map((venue) => <article key={venue.id} aria-labelledby={`venue-${venue.id}-title`} className="min-w-0 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs">
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-200">{venue.photos[0] ? <Image src={venue.photos[0].previewUrl} alt={venue.photos[0].name} fill sizes="(min-width:1280px) 30vw, (min-width:768px) 45vw, 90vw" className="object-cover" /> : <div className="flex h-full items-center justify-center text-sm text-neutral-600">No venue photos</div>}<div className="absolute top-3 right-3"><AdminVenueStatusBadge status={venue.status} /></div></div>
      <div className="p-5"><h2 id={`venue-${venue.id}-title`} className="text-base font-semibold tracking-tight">{venue.name}</h2><p className="mt-1 text-xs text-neutral-500">Managed by {venue.manager.name}</p><p className="mt-3 flex items-center gap-2 text-xs text-neutral-600"><AdminIcon name="areas" className="size-3.5" />{venue.location.area}</p><ul aria-label="Sports" className="mt-3 flex min-h-6 flex-wrap gap-1.5">{venue.selectedSports.map((item) => <li key={item.id} className="rounded-md bg-neutral-100 px-2 py-1 text-[10px] font-medium text-neutral-600">{item.label}</li>)}</ul><Link href={`/admin/venues/${venue.id}`} aria-label={`View Details for ${venue.name}`} className="mt-4 flex min-h-10 items-center justify-center rounded-lg border border-neutral-200 text-xs font-semibold hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2">View Details</Link></div>
    </article>)}</div> : <div className="mt-6 rounded-xl border border-neutral-200 bg-white px-5 py-16 text-center"><h2 className="text-lg font-semibold">No venues found</h2><p className="mt-2 text-sm text-neutral-500">Try changing your search or filters.</p><button type="button" onClick={reset} className={`${control} mt-5`}>Clear filters</button></div>}
    <div className="mt-8 flex flex-wrap items-center justify-between gap-4"><p role="status" className="text-xs text-neutral-500">Showing {filtered.length ? start + 1 : 0}–{Math.min(start + VENUES_PER_PAGE, filtered.length)} of {filtered.length} venues</p><nav aria-label="Venue pagination" className="flex flex-wrap gap-2"><button type="button" aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} className={`${control} px-2 disabled:opacity-40`}><AdminIcon name="chevron" className="size-4 rotate-90" /></button>{Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <button type="button" key={number} aria-label={`Page ${number}`} aria-current={currentPage === number ? "page" : undefined} onClick={() => setPage(number)} className={`${control} min-w-10 ${number === currentPage ? "border-neutral-900 bg-neutral-900! font-semibold text-white!" : "hover:bg-neutral-50"}`}>{number}</button>)}<button type="button" aria-label="Next page" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)} className={`${control} px-2 disabled:opacity-40`}><AdminIcon name="chevron" className="size-4 -rotate-90" /></button></nav></div>
    <p className="mt-4 text-xs text-neutral-500">Sample venue configurations · Approval changes apply to this preview.</p>
  </>;
}
