"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { AdminIcon } from "@/components/admin/admin-icon";
import { useAdminManagers } from "@/components/admin/admin-managers-provider";
import { managerStatuses, MANAGERS_PER_PAGE, type AdminManager, type AdminManagerStatus } from "@/data/admin/mockAdmin";

const control = "min-h-9 rounded-lg border border-neutral-200 bg-white px-3 text-xs text-neutral-600 focus-visible:outline-2 focus-visible:outline-neutral-800";
const badgeStyle: Record<AdminManagerStatus, string> = {
  ACTIVE: "border-neutral-800 bg-neutral-900 font-semibold text-white",
  PENDING: "border-neutral-300 bg-neutral-100 font-medium text-neutral-600",
  SUSPENDED: "border-neutral-500 bg-white font-semibold text-neutral-800",
};

function ManagerActions({ manager }: { manager: AdminManager }) {
  const { setStatus } = useAdminManagers();
  const popover = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  return <><button type="button" aria-label={`Actions for ${manager.name} at ${manager.venueName}`} popoverTarget={`actions-${manager.id}`} onClick={(event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPosition({ top: Math.min(rect.bottom + 4, window.innerHeight - 210), left: Math.max(8, Math.min(rect.right - 208, window.innerWidth - 216)) });
  }} className="mx-auto flex size-9 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 focus-visible:outline-2"><AdminIcon name="more" className="size-5" /></button>
    <div ref={popover} id={`actions-${manager.id}`} popover="auto" aria-label={`Manager actions for ${manager.name}`} style={position} className="fixed m-0 w-52 rounded-xl border border-neutral-200 bg-white p-2 text-left text-sm text-neutral-800 shadow-lg">
      <p className="px-2 py-2 text-[11px] text-neutral-500">Details pages are coming soon.</p>
      <button type="button" disabled className="block min-h-10 w-full rounded-lg px-2 text-left text-neutral-500">View Manager</button>
      <button type="button" disabled className="block min-h-10 w-full rounded-lg px-2 text-left text-neutral-500">View Venue</button>
      <button type="button" onClick={() => { setStatus(manager.id, manager.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE"); popover.current?.hidePopover(); }} className="block min-h-10 w-full rounded-lg px-2 text-left font-medium hover:bg-neutral-100 focus-visible:outline-2">{manager.status === "ACTIVE" ? "Suspend" : "Activate"} manager</button>
    </div>
  </>;
}

export default function ManagersPage() {
  const { managers, notice, dismissNotice } = useAdminManagers();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [area, setArea] = useState("");
  const [page, setPage] = useState(1);
  const query = search.trim().toLowerCase();
  const phoneQuery = query.replace(/\D/g, "");
  const filtered = managers.filter((manager) => (!status || manager.status === status) && (!area || manager.area === area) && (
    [manager.name, manager.phone, manager.email, manager.venueName].some((value) => value.toLowerCase().includes(query))
    || (phoneQuery.length > 0 && /^[+\d\s()-]+$/.test(query) && manager.phone.replace(/\D/g, "").includes(phoneQuery))
  ));
  const pageCount = Math.max(1, Math.ceil(filtered.length / MANAGERS_PER_PAGE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * MANAGERS_PER_PAGE;
  const rows = filtered.slice(start, start + MANAGERS_PER_PAGE);
  const areas = Array.from(new Set(managers.map((manager) => manager.area))).sort();
  const resetFilters = () => { setSearch(""); setStatus(""); setArea(""); setPage(1); };
  const summary = [
    { label: "TOTAL MANAGERS", value: managers.length, icon: "users" as const },
    { label: "ACTIVE", value: managers.filter((manager) => manager.status === "ACTIVE").length, icon: "check" as const },
    { label: "PENDING VERIFICATION", value: managers.filter((manager) => manager.status === "PENDING").length, icon: "clock" as const },
  ];

  return <>
    <AdminPageHeader title="Managers" subtitle="Manage all venue managers on the platform"><Link href="/admin/managers/add" className="flex min-h-10 items-center gap-2 rounded-lg bg-neutral-900 px-4 text-sm font-semibold text-white shadow-sm hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2"><AdminIcon name="plus" />Add Manager</Link></AdminPageHeader>
    {notice && <div role="status" className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white p-4 text-sm text-neutral-600"><p>{notice}</p><button type="button" aria-label="Dismiss message" onClick={dismissNotice} className="flex size-9 shrink-0 items-center justify-center rounded-lg hover:bg-neutral-100 focus-visible:outline-2"><AdminIcon name="close" /></button></div>}
    <dl aria-label="Manager summary" className="grid gap-5 sm:grid-cols-3">{summary.map((stat) => <AdminStatCard key={stat.label} {...stat} value={String(stat.value)} compact />)}</dl>
    <section aria-label="Manager directory" className="mt-6 rounded-xl border border-neutral-200 bg-white shadow-xs">
      <div className="flex flex-wrap items-center gap-3 border-b border-neutral-100 p-4">
        <div className="relative min-w-[180px] flex-1"><label htmlFor="manager-search" className="sr-only">Search by name or phone</label><span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-500"><AdminIcon name="search" /></span><input id="manager-search" type="search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search by name or phone" className={`${control} w-full pr-3 pl-9 placeholder:text-neutral-500`} /></div>
        <label className="sr-only" htmlFor="manager-status">Status</label><select id="manager-status" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} className={control}><option value="">Status: All</option>{managerStatuses.map((item) => <option key={item} value={item}>{item.charAt(0) + item.slice(1).toLowerCase()}</option>)}</select>
        <label className="sr-only" htmlFor="manager-area">Area</label><select id="manager-area" value={area} onChange={(event) => { setArea(event.target.value); setPage(1); }} className={`${control} max-w-48`}><option value="">Area: All</option>{areas.map((item) => <option key={item}>{item}</option>)}</select>
        <button type="button" aria-label="Reset search and filters" onClick={resetFilters} className={`${control} flex size-9 shrink-0 items-center justify-center px-0 hover:bg-neutral-50`}><AdminIcon name="refresh" /></button>
      </div>
      <div role="region" aria-label="Managers table, scroll horizontally on smaller screens" tabIndex={0} className="overflow-x-auto rounded-b-xl focus-visible:outline-2 focus-visible:-outline-offset-2">
        <table className="w-full min-w-[940px] text-left text-xs"><caption className="sr-only">Venue managers, contact details, status and account actions</caption><thead className="bg-neutral-50/70 text-[10px] tracking-wide text-neutral-500"><tr>{["MANAGER", "PHONE NUMBER", "VENUE NAME", "AREA", "STATUS", "DATE JOINED", "ACTIONS"].map((label) => <th key={label} scope="col" className="px-5 py-4 font-semibold last:text-center">{label}</th>)}</tr></thead><tbody>{rows.map((manager) => <tr key={manager.id} className="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/50">
          <th scope="row" className="px-5 py-4 font-normal"><div className="flex items-center gap-3"><span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-[10px] font-semibold text-neutral-600">{manager.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><div className="min-w-0"><span className="block font-semibold text-neutral-900">{manager.name}</span><span className="mt-1 block text-[10px] text-neutral-500">{manager.email || "Email not provided"}</span></div></div></th>
          <td className="whitespace-nowrap px-5 py-4 text-neutral-600">{manager.phone}</td><td className="max-w-52 px-5 py-4 font-medium text-neutral-700">{manager.venueName}</td><td className="whitespace-nowrap px-5 py-4 text-neutral-600">{manager.area}</td><td className="px-5 py-4"><span className={`inline-flex rounded-full border px-2 py-1 text-[10px] ${badgeStyle[manager.status]}`}>{manager.status}</span></td><td className="whitespace-nowrap px-5 py-4 text-neutral-500"><time dateTime={manager.dateJoined}>{new Date(`${manager.dateJoined}T12:00:00Z`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" })}</time></td><td className="px-5 py-3"><ManagerActions manager={manager} /></td>
        </tr>)}</tbody></table>
      </div>
      {rows.length === 0 && <div className="px-5 py-14 text-center"><h2 className="font-semibold">No managers found</h2><p className="mt-2 text-sm text-neutral-500">Try changing your search or filters.</p><button type="button" onClick={resetFilters} className={`${control} mt-4`}>Clear filters</button></div>}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-100 p-4"><p role="status" className="text-xs text-neutral-500">Showing {filtered.length ? start + 1 : 0}–{Math.min(start + MANAGERS_PER_PAGE, filtered.length)} of {filtered.length} results</p><nav aria-label="Manager pagination" className="flex flex-wrap gap-1"><button type="button" aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} className={`${control} px-2 disabled:opacity-40`}><AdminIcon name="chevron" className="size-3 rotate-90" /></button>{Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <button type="button" key={number} aria-label={`Page ${number}`} aria-current={currentPage === number ? "page" : undefined} onClick={() => setPage(number)} className={`${control} min-w-8 px-2 ${number === currentPage ? "border-neutral-900 bg-neutral-900! font-semibold text-white!" : "hover:bg-neutral-50"}`}>{number}</button>)}<button type="button" aria-label="Next page" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)} className={`${control} px-2 disabled:opacity-40`}><AdminIcon name="chevron" className="size-3 -rotate-90" /></button></nav></div>
    </section><p className="mt-4 text-xs text-neutral-500">Preview managers only. Changes remain while you use this Managers section.</p>
  </>;
}
