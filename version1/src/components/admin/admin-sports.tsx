"use client";

import { useState } from "react";
import { mockAdminSports, mostBookedSport, type AdminSport, type SportValues } from "@/data/admin/mockAdminSports";
import { AdminPageHeader } from "./admin-page-header";
import { AdminStatCard } from "./admin-stat-card";
import { AdminIcon } from "./admin-icon";
import { AdminSportModal, SportArtwork, SportDialog, SportSwitch, sportButton, sportPrimary } from "./admin-sport-modal";

export function AdminSports() {
  const [sports, setSports] = useState(mockAdminSports);
  const [editor, setEditor] = useState<{ sport: AdminSport | null } | null>(null);
  const [deleting, setDeleting] = useState<AdminSport | null>(null);
  const [notice, setNotice] = useState("");
  function save(values: SportValues) {
    if (!editor) return;
    const existing = editor.sport;
    const saved: AdminSport = { ...values, id: existing?.id ?? `sport-${crypto.randomUUID()}`, venueCount: existing?.venueCount ?? 0 };
    setSports(current => existing ? current.map(sport => sport.id === existing.id ? saved : sport) : [...current, saved]);
    setNotice(`${values.name} ${existing ? "updated" : "added"}.`); setEditor(null);
  }
  return <>
    <AdminPageHeader title="Sports & Services" subtitle="Manage the sports/services available for venues to list"><button id="add-sport" type="button" onClick={() => setEditor({ sport: null })} className={sportPrimary}><AdminIcon name="plus" />Add Sport</button></AdminPageHeader>
    <dl aria-label="Sports summary" className="grid gap-5 sm:grid-cols-3"><AdminStatCard compact label="TOTAL SPORTS" value={String(sports.length)} icon="sports" /><AdminStatCard compact label="ACTIVE" value={String(sports.filter(sport => sport.active).length)} icon="check" /><AdminStatCard compact label="MOST BOOKED" value={mostBookedSport(sports)} icon="arrow" /></dl>
    <section aria-label="Sports and services" className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {sports.map(sport => <article key={sport.id} aria-label={sport.name} className="relative rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
        <div className="absolute top-2 right-3"><SportSwitch active={sport.active} label={`${sport.name} active`} onChange={() => { setSports(current => current.map(item => item.id === sport.id ? { ...item, active: !item.active } : item)); setNotice(`${sport.name} is now ${sport.active ? "inactive" : "active"}.`); }} /></div>
        <div className="mx-auto flex size-16 items-center justify-center overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-50 p-3 text-neutral-700"><SportArtwork icon={sport.icon} name={sport.name} /></div>
        <h2 className="mt-4 text-center text-lg font-semibold break-words">{sport.name}</h2><p className="mt-1 text-center text-xs text-neutral-400">{sport.venueCount} {sport.venueCount === 1 ? "venue" : "venues"} offering this</p>
        <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-2"><span className="text-[10px] font-medium text-neutral-500">{sport.active ? "Active" : "Inactive"}</span><details className="relative" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false; }} onKeyDown={event => { if (event.key === "Escape") { event.currentTarget.open = false; event.currentTarget.querySelector('summary')?.focus(); } }}>
          <summary aria-label={`Actions for ${sport.name}`} className="flex size-8 cursor-pointer list-none items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-black focus-visible:outline-2 [&::-webkit-details-marker]:hidden"><AdminIcon name="more" /></summary>
          <div className="absolute right-0 bottom-full z-10 mb-1 w-36 rounded-lg border border-neutral-200 bg-white p-1 shadow-lg"><button type="button" onClick={() => setEditor({ sport })} className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-neutral-100 focus-visible:outline-2">Edit</button><button type="button" onClick={() => setDeleting(sport)} className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-neutral-100 focus-visible:outline-2">Delete</button></div>
        </details></div>
      </article>)}
      <button type="button" onClick={() => setEditor({ sport: null })} className="flex min-h-32 flex-col items-center justify-center gap-3 self-start rounded-xl border-2 border-dashed border-neutral-200 p-5 text-neutral-400 hover:border-neutral-400 hover:bg-white hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2"><span className="flex size-12 items-center justify-center rounded-full bg-white"><AdminIcon name="plus" className="size-6" /></span><span className="text-sm font-semibold">Add New Sport</span></button>
    </section>
    <p role="status" className="mt-4 text-xs text-neutral-600">{notice}</p><p className="mt-2 text-xs text-neutral-500">Preview data · Changes last until you leave or reload this page. Most booked counts confirmed and completed bookings.</p>
    {editor && <AdminSportModal sport={editor.sport} sports={sports} onSave={save} onClose={() => setEditor(null)} />}
    {deleting && <SportDialog title="Delete this sport?" onClose={() => setDeleting(null)}><div className="p-6 text-sm leading-6 text-neutral-600"><p>Remove <strong className="text-neutral-900">{deleting.name}</strong> from the sport list?</p>{deleting.venueCount > 0 && <p className="mt-2">This sport is offered by {deleting.venueCount} venues in the preview. Existing venue and booking records will remain unchanged.</p>}</div><footer className="flex justify-end gap-3 border-t border-neutral-100 p-6"><button autoFocus type="button" className={sportButton} onClick={() => setDeleting(null)}>Cancel</button><button type="button" className={sportPrimary} onClick={() => { setSports(current => current.filter(sport => sport.id !== deleting.id)); setNotice(`${deleting.name} deleted.`); setDeleting(null); }}>Delete Sport</button></footer></SportDialog>}
  </>;
}
