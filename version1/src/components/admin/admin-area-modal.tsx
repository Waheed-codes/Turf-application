"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { areaCities, type AdminArea, type AreaValues } from "@/data/admin/mockAdminAreas";
import { AdminIcon } from "./admin-icon";

const input = "min-h-11 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-sm outline-none focus:ring-2 focus:ring-neutral-500";
export const areaButton = "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-neutral-200 px-4 text-sm font-semibold hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2";
export const areaPrimary = `${areaButton} border-neutral-900 bg-neutral-900 text-white hover:bg-black`;

export function AreaSwitch({ checked, label, onChange }: { checked: boolean; label: string; onChange: () => void }) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={onChange} className="flex min-h-10 min-w-11 items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2"><span className={`flex h-5 w-9 items-center rounded-full p-0.5 transition-colors ${checked ? "bg-neutral-900" : "bg-neutral-300"}`}><span className={`size-4 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-4" : ""}`} /></span></button>;
}

export function AreaDialog({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = ref.current;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    element?.showModal();
    return () => {
      element?.close();
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus();
      else document.getElementById("add-area")?.focus();
    };
  }, []);
  return <dialog ref={ref} aria-labelledby="area-dialog-title" onCancel={onClose} onClose={event => {
    if (!event.currentTarget.open) onClose();
  }} onClick={event => {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
  }} className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[480px] overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-0 text-neutral-900 shadow-2xl backdrop:bg-black/45">
    <header className="flex items-center justify-between border-b border-neutral-100 px-6 py-4"><h2 id="area-dialog-title" className="text-lg font-semibold">{title}</h2><button type="button" aria-label="Close area dialog" onClick={onClose} className="flex size-9 items-center justify-center rounded-lg hover:bg-neutral-100 focus-visible:outline-2"><AdminIcon name="close" /></button></header>
    {children}
  </dialog>;
}

export function AdminAreaModal({ area, areas, onClose, onSave }: { area: AdminArea | null; areas: AdminArea[]; onClose: () => void; onSave: (values: AreaValues) => void }) {
  const [name, setName] = useState(area?.name ?? "");
  const [city, setCity] = useState(area?.city ?? areaCities[0]);
  const [pincodes, setPincodes] = useState(area?.pincodes ?? []);
  const [draft, setDraft] = useState("");
  const [active, setActive] = useState(area?.active ?? true);
  const [error, setError] = useState("");
  const [pinError, setPinError] = useState("");
  const cities = Array.from(new Set([...areaCities, ...areas.map(item => item.city)]));
  function validatePin(value: string) {
    if (!/^\d{6}$/.test(value)) return "Enter a 6-digit pincode.";
    if (pincodes.includes(value)) return "This pincode has already been added.";
    return "";
  }
  function addPin() {
    const value = draft.trim();
    const message = validatePin(value);
    setPinError(message);
    if (message) return;
    setPincodes(current => [...current, value]); setDraft("");
  }
  function save() {
    const trimmed = name.trim();
    if (!trimmed) { setError("Enter an area name."); return; }
    if (areas.some(item => item.id !== area?.id && item.city === city && item.name.toLowerCase() === trimmed.toLowerCase())) { setError("An area with this name already exists in this city."); return; }
    let finalPins = pincodes;
    if (draft.trim()) {
      const message = validatePin(draft.trim());
      if (message) { setPinError(message); return; }
      finalPins = [...pincodes, draft.trim()];
    }
    if (!finalPins.length) { setPinError("Add at least one pincode."); return; }
    onSave({ name: trimmed, city, pincodes: finalPins, active });
  }
  return <AreaDialog title={area ? "Edit Area" : "Add New Area"} onClose={onClose}>
    <form onSubmit={event => { event.preventDefault(); save(); }}>
      <div className="space-y-6 p-6">
        <label className="grid gap-2 text-xs font-semibold">Area Name<input autoFocus required maxLength={100} value={name} onChange={event => { setName(event.target.value); setError(""); }} placeholder="e.g. Gachibowli" aria-invalid={Boolean(error)} aria-describedby={error ? "area-error" : undefined} className={input} /></label>
        {error && <p id="area-error" role="alert" className="text-xs font-medium">{error}</p>}
        <label className="grid gap-2 text-xs font-semibold">City<select aria-label="City" value={city} onChange={event => { setCity(event.target.value); setError(""); }} className={input}>{cities.map(value => <option key={value}>{value}</option>)}</select></label>
        <div><label htmlFor="area-pincode" className="text-xs font-semibold">Pincode(s)</label><div className="mt-2 flex min-h-12 flex-wrap items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-2 focus-within:ring-2 focus-within:ring-neutral-500">
          {pincodes.map(pin => <span key={pin} className="inline-flex items-center gap-1 rounded border border-neutral-300 bg-neutral-200 px-2 text-xs font-semibold">{pin}<button type="button" aria-label={`Remove pincode ${pin}`} onClick={() => { setPincodes(current => current.filter(value => value !== pin)); setPinError(""); }} className="flex size-7 items-center justify-center rounded focus-visible:outline-2"><AdminIcon name="close" className="size-3" /></button></span>)}
          <input id="area-pincode" inputMode="numeric" value={draft} onChange={event => { setDraft(event.target.value); setPinError(""); }} onKeyDown={event => { if (event.key === "Enter") { event.preventDefault(); addPin(); } }} placeholder="Type and enter..." aria-invalid={Boolean(pinError)} aria-describedby="area-pin-help area-pin-error" className="min-h-8 w-28 min-w-0 flex-1 bg-transparent text-sm outline-none" />
          <button type="button" aria-label="Add pincode" onClick={addPin} className="flex size-8 items-center justify-center rounded hover:bg-neutral-200 focus-visible:outline-2"><AdminIcon name="plus" /></button>
        </div><p id="area-pin-help" className="mt-2 text-[11px] text-neutral-500">Press Enter after each 6-digit pincode to add a tag.</p><p id="area-pin-error" role="alert" className="mt-1 text-xs font-medium">{pinError}</p></div>
        <div className="flex items-center justify-between gap-4 rounded-xl border border-neutral-100 bg-neutral-50 p-4"><div><p className="text-sm font-medium">{active ? "Active" : "Inactive"}</p><p className="mt-1 text-xs text-neutral-500">{active ? "Available for new venue selection" : "Not available for new venue selection"}</p></div><AreaSwitch label="Area active" checked={active} onChange={() => setActive(!active)} /></div>
      </div>
      <footer className="grid grid-cols-2 gap-3 border-t border-neutral-100 p-6"><button type="button" onClick={onClose} className={areaButton}>Cancel</button><button type="submit" className={areaPrimary}>{area ? "Save Changes" : "Save Area"}</button></footer>
    </form>
  </AreaDialog>;
}
