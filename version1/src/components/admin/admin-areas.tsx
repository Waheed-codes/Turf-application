"use client";

import { useState } from "react";
import { areaCities, mockAdminAreas, type AdminArea, type AreaValues } from "@/data/admin/mockAdminAreas";
import { AdminPageHeader } from "./admin-page-header";
import { AdminStatCard } from "./admin-stat-card";
import { AdminIcon } from "./admin-icon";
import { AdminAreaModal, AreaDialog, AreaSwitch, areaButton, areaPrimary } from "./admin-area-modal";

const control = "min-h-10 rounded-lg border border-neutral-200 bg-white px-3 text-xs text-neutral-600 focus-visible:outline-2 focus-visible:outline-neutral-800";
const pageSize = 10;

export function AdminAreas() {
  const [areas, setAreas] = useState(mockAdminAreas);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [editor, setEditor] = useState<{ area: AdminArea | null } | null>(null);
  const [deleting, setDeleting] = useState<AdminArea | null>(null);
  const [notice, setNotice] = useState("");
  const cities = Array.from(new Set([...areaCities, ...areas.map(area => area.city)]));
  const filtered = areas.filter(area => area.name.toLowerCase().includes(search.trim().toLowerCase()) && (!city || area.city === city) && (status === "all" || area.active === (status === "active")));
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pages);
  const start = (currentPage - 1) * pageSize;
  const visible = filtered.slice(start, start + pageSize);
  function reset() { setSearch(""); setCity(""); setStatus("all"); setPage(1); }
  function save(values: AreaValues) {
    if (!editor) return;
    const existing = editor.area;
    const saved: AdminArea = { ...values, id: existing?.id ?? `area-${crypto.randomUUID()}`, venueCount: existing?.venueCount ?? 0 };
    setAreas(current => existing ? current.map(area => area.id === existing.id ? saved : area) : [saved, ...current]);
    setNotice(`${values.name} ${existing ? "updated" : "added"}.`);
    // Reveal saved areas even when their edited values no longer match filters.
    reset();
    if (existing) setPage(Math.floor(areas.findIndex(area => area.id === existing.id) / pageSize) + 1);
    setEditor(null);
  }
  function toggle(area: AdminArea) {
    setAreas(current => current.map(item => item.id === area.id ? { ...item, active: !item.active } : item));
    setNotice(`${area.name} is now ${area.active ? "inactive" : "active"}.`);
  }
  return <>
    <AdminPageHeader title="Areas" subtitle="Manage the list of localities shown to managers and users"><button id="add-area" type="button" onClick={() => setEditor({ area: null })} className={areaPrimary}><AdminIcon name="plus" />Add Area</button></AdminPageHeader>
    <dl aria-label="Area summary" className="grid gap-5 sm:grid-cols-3">
      <AdminStatCard compact label="TOTAL AREAS" value={String(areas.length)} icon="areas" />
      <AdminStatCard compact label="ACTIVE" value={String(areas.filter(area => area.active).length)} icon="check" />
      <AdminStatCard compact label="CITIES COVERED" value={String(new Set(areas.map(area => area.city)).size)} icon="dashboard" />
    </dl>
    <section aria-label="Areas" className="mt-6 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs">
      <div aria-label="Area filters" className="flex flex-wrap items-center gap-3 border-b border-neutral-100 p-4">
        <div className="relative min-w-40 flex-1"><label htmlFor="area-search" className="sr-only">Search area name</label><span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400"><AdminIcon name="search" /></span><input id="area-search" type="search" value={search} placeholder="Search area name" onChange={event => { setSearch(event.target.value); setPage(1); }} className={`${control} w-full pl-10`} /></div>
        <select aria-label="City" value={city} onChange={event => { setCity(event.target.value); setPage(1); }} className={control}><option value="">City: All</option>{cities.map(value => <option key={value}>{value}</option>)}</select>
        <div role="group" aria-label="Area status" className="flex min-h-10 items-center gap-2 rounded-lg border border-neutral-200 px-3"><span className="text-xs text-neutral-500">Status:</span><div className="flex rounded bg-neutral-100 p-1">{["all", "active", "inactive"].map(value => <button key={value} type="button" aria-pressed={status === value} onClick={() => { setStatus(value); setPage(1); }} className={`rounded px-2 py-1.5 text-[10px] font-semibold uppercase focus-visible:outline-2 ${status === value ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-black"}`}>{value}</button>)}</div></div>
        <button type="button" aria-label="Reset area filters" onClick={reset} className={`${control} flex items-center justify-center`}><AdminIcon name="refresh" /></button>
      </div>
      <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-neutral-50/70 text-[10px] tracking-wider text-neutral-500 uppercase"><tr>{["Area Name", "City", "Pincode(s)", "Venues Count", "Status", "Actions"].map(label => <th key={label} scope="col" className="px-6 py-5 font-semibold">{label}</th>)}</tr></thead><tbody className="divide-y divide-neutral-100">{visible.map(area => <tr key={area.id} className="hover:bg-neutral-50/60">
        <th scope="row" className="px-6 py-4 font-semibold">{area.name}</th><td className="px-6 py-4 text-neutral-600">{area.city}</td><td className="max-w-44 px-6 py-4 font-mono text-xs leading-6 text-neutral-500">{area.pincodes.join(", ")}</td><td className="px-6 py-4"><span className="font-semibold tabular-nums">{area.venueCount}</span><span className="ml-2 text-xs text-neutral-400">venues</span></td><td className="px-6 py-4"><AreaSwitch checked={area.active} label={`${area.name} active`} onChange={() => toggle(area)} /></td><td className="px-6 py-4"><div className="flex gap-1"><button type="button" aria-label={`Edit ${area.name}`} onClick={() => setEditor({ area })} className="flex size-9 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-black focus-visible:outline-2"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-4"><path d="m15 5 4 4M4 20l5-1L20 8a2.8 2.8 0 0 0-4-4L5 15l-1 5Z" /></svg></button><button type="button" aria-label={`Delete ${area.name}`} onClick={() => setDeleting(area)} className="flex size-9 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-black focus-visible:outline-2"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-4"><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7" /></svg></button></div></td>
      </tr>)}</tbody></table></div>
      {!filtered.length && <div className="p-12 text-center"><h2 className="font-semibold">No areas found</h2><p className="mt-2 text-sm text-neutral-500">Try another search or adjust your filters.</p><button type="button" onClick={reset} className={`${areaButton} mt-4`}>Reset filters</button></div>}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 p-4"><p role="status" className="text-xs text-neutral-500">Showing {filtered.length ? start + 1 : 0}–{Math.min(start + pageSize, filtered.length)} of {filtered.length} results</p><nav aria-label="Area pagination" className="flex flex-wrap gap-1"><button type="button" aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} className={`${control} disabled:opacity-30`}>‹</button>{Array.from({ length: pages }, (_, i) => i + 1).map(number => <button key={number} type="button" aria-label={`Page ${number}`} aria-current={number === currentPage ? "page" : undefined} onClick={() => setPage(number)} className={`${control} ${number === currentPage ? "bg-neutral-900! text-white!" : ""}`}>{number}</button>)}<button type="button" aria-label="Next page" disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)} className={`${control} disabled:opacity-30`}>›</button></nav></div>
    </section>
    <p role="status" className="mt-3 text-xs text-neutral-600">{notice}</p><p className="mt-2 text-xs text-neutral-500">Preview data · Changes last until you leave or reload this page.</p>
    {editor && <AdminAreaModal area={editor.area} areas={areas} onSave={save} onClose={() => setEditor(null)} />}
    {deleting && <AreaDialog title="Delete this area?" onClose={() => setDeleting(null)}><div className="p-6 text-sm leading-6 text-neutral-600"><p>Remove <strong className="text-neutral-900">{deleting.name}</strong> from the area list?</p>{deleting.venueCount > 0 && <p className="mt-2">This preview has {deleting.venueCount} venues in this area. Deleting the area here will not change those venues.</p>}</div><footer className="flex justify-end gap-3 border-t border-neutral-100 p-6"><button autoFocus type="button" className={areaButton} onClick={() => setDeleting(null)}>Cancel</button><button type="button" className={areaPrimary} onClick={() => { setAreas(current => current.filter(area => area.id !== deleting.id)); setNotice(`${deleting.name} deleted.`); setDeleting(null); }}>Delete Area</button></footer></AreaDialog>}
  </>;
}
