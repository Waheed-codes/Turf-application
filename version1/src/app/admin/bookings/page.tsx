"use client";

import { useState } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { AdminIcon } from "@/components/admin/admin-icon";
import { AdminBookingDetails } from "@/components/admin/admin-booking-details";
import { formatRupees } from "@/data/admin/mockAdmin";
import { mockAdminVenues } from "@/data/admin/mockAdminVenues";
import { type BookingAction, simulateBookingAction, BOOKINGS_TODAY, mockAdminBookings, bookingContext, bookingDate, bookingTime, bookingsCsv, statusLabel } from "@/data/admin/mockAdminBookings";

const tabs = ["All", "Upcoming", "Completed", "Cancelled"] as const;
const pageSize = 10;
const control = "h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none focus:ring-2 focus:ring-neutral-400";
const sports = Array.from(new Map(mockAdminVenues.flatMap(venue => venue.selectedSports).map(sport => [sport.id, sport])).values());
function Badge({ value }: { value: string }) {
  return <span className={`inline-block rounded-md border px-2 py-1 text-[10px] font-semibold ${value === "CONFIRMED" || value === "PAID" ? "border-neutral-800 bg-neutral-800 text-white" : "border-neutral-200 bg-neutral-50 text-neutral-600"}`}>{statusLabel(value)}</span>;
}

export default function AdminBookingsPage() {
  const [tab, setTab] = useState<typeof tabs[number]>("All");
  const [search, setSearch] = useState("");
  const [venue, setVenue] = useState("");
  const [sport, setSport] = useState("");
  const [status, setStatus] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [dateOpen, setDateOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [bookings, setBookings] = useState(mockAdminBookings);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = bookings.find(booking => booking.id === selectedId);
  function updateBooking(action: BookingAction) {
    setBookings(current => current.map(booking => booking.id === selectedId ? simulateBookingAction(booking, action) : booking));
  }
  const [notice, setNotice] = useState("");
  const invalidDates = Boolean(from && to && from > to);
  const filtered = bookings.filter(booking => {
    const context = bookingContext(booking);
    const matchesTab = tab === "All" || (tab === "Upcoming" ? ["CONFIRMED", "PENDING_PAYMENT"].includes(booking.status) && booking.date >= BOOKINGS_TODAY : booking.status === tab.toUpperCase());
    return matchesTab && (!venue || booking.venueId === venue) && (!sport || booking.sportId === sport) && (!status || booking.status === status)
      && `${booking.customerName} ${context.venue.name}`.toLowerCase().includes(search.trim().toLowerCase())
      && !invalidDates && (!from || booking.date >= from) && (!to || booking.date <= to);
  });
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  function reset() { setSearch(""); setVenue(""); setSport(""); setStatus(""); setFrom(""); setTo(""); setTab("All"); setPage(1); }
  function exportCsv() {
    const url = URL.createObjectURL(new Blob(["\uFEFF", bookingsCsv(filtered)], { type: "text/csv;charset=utf-8;" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "arenax-bookings.csv"; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(`Exported ${filtered.length} bookings.`);
  }
  return <div className="space-y-6">
    <AdminPageHeader title="Bookings" subtitle="View and manage all bookings across venues"><button type="button" onClick={exportCsv} disabled={!filtered.length} className={`${control} flex items-center gap-2 font-medium hover:bg-neutral-50 disabled:opacity-40`}><AdminIcon name="export" className="size-4" />Export</button></AdminPageHeader>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard compact label="Total Bookings" value={String(bookings.length)} icon="bookings" />
      <AdminStatCard compact label="Confirmed" value={String(bookings.filter(b => b.status === "CONFIRMED").length)} icon="check" />
      <AdminStatCard compact label="Cancelled" value={String(bookings.filter(b => b.status === "CANCELLED").length)} icon="close" />
      <AdminStatCard compact label="Completed Today" value={String(bookings.filter(b => b.status === "COMPLETED" && b.date === BOOKINGS_TODAY).length)} icon="clock" />
    </div>
    <p className="text-xs text-neutral-500">Mock data · Today in this preview: {bookingDate(BOOKINGS_TODAY)}</p>
    <div aria-label="Booking categories" className="flex gap-7 overflow-x-auto border-b border-neutral-200">{tabs.map(item => <button type="button" key={item} aria-pressed={tab === item} onClick={() => { setTab(item); setPage(1); }} className={`whitespace-nowrap border-b-2 pb-3 text-sm font-medium ${tab === item ? "border-black text-black" : "border-transparent text-neutral-500 hover:text-black"}`}>{item}</button>)}</div>
    <section aria-label="Booking filters" className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap gap-3">
        <label className={`relative min-w-52 flex-1 ${control} flex items-center gap-2`}><AdminIcon name="search" className="size-4 shrink-0 text-neutral-400" /><input type="search" aria-label="Search by user or venue" placeholder="Search by user or venue" value={search} onChange={event => { setSearch(event.target.value); setPage(1); }} className="w-full bg-transparent text-sm outline-none" /></label>
        <select aria-label="Venue" value={venue} onChange={e => { setVenue(e.target.value); setPage(1); }} className={`${control} max-w-full`}><option value="">Venue: All</option>{mockAdminVenues.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
        <select aria-label="Sport" value={sport} onChange={e => { setSport(e.target.value); setPage(1); }} className={control}><option value="">Sport: All</option>{sports.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select>
        <button type="button" aria-expanded={dateOpen} aria-controls="booking-date-range" onClick={() => setDateOpen(!dateOpen)} className={`${control} flex items-center gap-2`}><AdminIcon name="bookings" className="size-4" />{from || to ? "Date Range · Active" : "Select Date Range"}</button>
        <select aria-label="Status" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className={control}><option value="">Status: All</option>{["CONFIRMED", "COMPLETED", "CANCELLED", "PENDING_PAYMENT"].map(item => <option key={item} value={item}>{statusLabel(item)}</option>)}</select>
        <button type="button" onClick={reset} aria-label="Reset all booking filters" className={control}><AdminIcon name="refresh" className="size-4" /></button>
      </div>
      {dateOpen && <div id="booking-date-range" className="mt-4 flex flex-wrap items-end gap-3 border-t border-neutral-100 pt-4"><label className="grid gap-1 text-xs text-neutral-500">From<input aria-label="From date" type="date" value={from} onChange={e => { setFrom(e.target.value); setPage(1); }} className={control} /></label><label className="grid gap-1 text-xs text-neutral-500">To<input aria-label="To date" type="date" value={to} onChange={e => { setTo(e.target.value); setPage(1); }} className={control} /></label><button type="button" onClick={() => { setFrom(""); setTo(""); setPage(1); }} className={control}>Clear dates</button><p className="pb-3 text-xs text-neutral-500">Includes both dates.</p></div>}
      {invalidDates && <p role="alert" className="mt-3 text-sm font-medium">Choose an end date on or after the start date.</p>}
    </section>
    <section aria-label="Bookings results" className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-left text-sm"><thead className="bg-neutral-50 text-[10px] tracking-wider text-neutral-500 uppercase"><tr>{["Booking ID", "User", "Venue Name", "Court / Pitch", "Sport", "Date & Time Slot", "Amount", "Payment", "Status"].map(label => <th key={label} scope="col" className="px-4 py-5 font-semibold">{label}</th>)}</tr></thead><tbody className="divide-y divide-neutral-100">{visible.map(booking => {
        const { venue, resource } = bookingContext(booking);
        return <tr key={booking.id} onClick={() => setSelectedId(booking.id)} className="cursor-pointer hover:bg-neutral-50/70"><td className="px-4 py-5"><button type="button" onClick={() => setSelectedId(booking.id)} aria-label={`View booking ${booking.id}`} className="font-medium text-neutral-600 underline decoration-neutral-300 underline-offset-4 hover:text-black">#{booking.id}</button></td><td className="px-4 py-5"><div className="flex items-center gap-2"><span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[10px] font-semibold">{booking.customerName.split(" ").map(part => part[0]).join("")}</span><div className="min-w-24"><p className="font-medium text-neutral-900">{booking.customerName}</p><p className="mt-1 text-[11px] text-neutral-500">{booking.phoneNumber}</p></div></div></td><td className="px-4 py-5 text-neutral-700">{venue.name}</td><td className="px-4 py-5 text-neutral-600">{resource.name}</td><td className="px-4 py-5"><span className="rounded bg-neutral-100 px-2 py-1 text-[10px] font-medium uppercase">{resource.sportLabel}</span></td><td className="px-4 py-5"><p className="whitespace-nowrap font-medium">{bookingDate(booking.date)}</p><p className="mt-1 text-[11px] text-neutral-500">{bookingTime(booking)}</p></td><td className="px-4 py-5 font-semibold">{formatRupees(booking.amount)}</td><td className="px-4 py-5"><Badge value={booking.paymentStatus} /></td><td className="px-4 py-5"><Badge value={booking.status} /></td></tr>;
      })}</tbody></table></div>
      {!filtered.length && <div className="p-12 text-center"><h2 className="font-semibold">No bookings found</h2><p className="mt-2 text-sm text-neutral-500">Try a different search or adjust your filters.</p><button type="button" onClick={reset} className={`${control} mt-4`}>Reset filters</button></div>}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-100 p-4"><p aria-live="polite" className="text-xs text-neutral-500">Showing {filtered.length ? (currentPage - 1) * pageSize + 1 : 0}–{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} results</p><nav aria-label="Bookings pagination" className="flex gap-1"><button type="button" aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} className={`${control} disabled:opacity-30`}>‹</button>{Array.from({ length: pages }, (_, index) => index + 1).map(number => <button type="button" key={number} aria-label={`Page ${number}`} aria-current={currentPage === number ? "page" : undefined} onClick={() => setPage(number)} className={`${control} ${currentPage === number ? "!bg-black !text-white" : ""}`}>{number}</button>)}<button type="button" aria-label="Next page" disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)} className={`${control} disabled:opacity-30`}>›</button></nav></div>
    </section>
    <p role="status" className="text-xs text-neutral-500">{notice}</p>
    {selected && <AdminBookingDetails booking={selected} onClose={() => setSelectedId(null)} onAction={updateBooking} />}
  </div>;
}
