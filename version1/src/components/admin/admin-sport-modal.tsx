"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { services, customSportIcon } from "@/components/manager/manager-onboarding-provider";
import { type AdminSport, type SportIcon, type SportValues } from "@/data/admin/mockAdminSports";
import { AdminIcon } from "./admin-icon";

export const sportButton = "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-neutral-200 px-4 text-sm font-semibold hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2";
export const sportPrimary = `${sportButton} border-neutral-900 bg-neutral-900 text-white hover:bg-black disabled:opacity-40`;
export function SportArtwork({ icon, name }: { icon: SportIcon; name: string }) {
  return icon.kind === "upload" ? <Image src={icon.src} alt={`${name} icon`} width={64} height={64} unoptimized className="size-full object-contain grayscale" /> : <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-8">{services.find(service => service.id === icon.id)?.icon ?? customSportIcon}</svg>;
}
export function SportSwitch({ active, label, onChange }: { active: boolean; label: string; onChange: () => void }) {
  return <button type="button" role="switch" aria-label={label} aria-checked={active} onClick={onChange} className="flex size-10 items-center justify-center rounded-lg focus-visible:outline-2"><span className={`flex h-5 w-9 items-center rounded-full p-0.5 ${active ? "bg-neutral-900" : "bg-neutral-300"}`}><span className={`size-4 rounded-full bg-white transition-transform ${active ? "translate-x-4" : ""}`} /></span></button>;
}
export function SportDialog({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = ref.current;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; element?.showModal();
    return () => { element?.close(); document.body.style.overflow = overflow; if (previous?.isConnected) { const disclosure = previous.closest("details"); if (disclosure && !disclosure.open) disclosure.querySelector("summary")?.focus(); else previous.focus(); } else document.getElementById("add-sport")?.focus(); };
  }, []);
  return <dialog ref={ref} aria-labelledby="sport-dialog-title" onCancel={onClose} onClose={event => { if (!event.currentTarget.open) onClose(); }} onClick={event => {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
  }} className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[420px] overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-0 text-neutral-900 shadow-2xl backdrop:bg-black/45">
    <header className="flex items-center justify-between border-b border-neutral-100 px-6 py-4"><h2 id="sport-dialog-title" className="text-lg font-semibold">{title}</h2><button type="button" aria-label="Close sport dialog" onClick={onClose} className="flex size-9 items-center justify-center rounded-lg hover:bg-neutral-100 focus-visible:outline-2"><AdminIcon name="close" /></button></header>{children}
  </dialog>;
}
export function AdminSportModal({ sport, sports, onSave, onClose }: { sport: AdminSport | null; sports: AdminSport[]; onSave: (values: SportValues) => void; onClose: () => void }) {
  const [name, setName] = useState(sport?.name ?? "");
  const [icon, setIcon] = useState<SportIcon>(sport?.icon ?? { kind: "builtin", id: "custom" });
  const [active, setActive] = useState(sport?.active ?? true);
  const [error, setError] = useState("");
  const [iconError, setIconError] = useState("");
  const [loading, setLoading] = useState(false);
  const reader = useRef<FileReader | null>(null);
  useEffect(() => () => { reader.current?.abort(); }, []);
  function upload(file?: File) {
    reader.current?.abort(); setLoading(false); setIconError("");
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 2 * 1024 * 1024) { setIconError("Choose a PNG, JPEG or WebP image up to 2 MB."); return; }
    const next = new FileReader(); reader.current = next; setLoading(true);
    next.onload = async () => {
      const src = String(next.result);
      const preview = new window.Image(); preview.src = src;
      try { await preview.decode(); if (reader.current === next) { setIcon({ kind: "upload", src }); setLoading(false); } }
      catch { if (reader.current === next) { setIconError("This image could not be opened. Choose another file."); setLoading(false); } }
    };
    next.onerror = () => { setIconError("The icon could not be read. Try again."); setLoading(false); };
    next.readAsDataURL(file);
  }
  function save() {
    const trimmed = name.trim().replace(/\s+/g, " ");
    if (!trimmed) { setError("Enter a sport name."); return; }
    if (sports.some(item => item.id !== sport?.id && item.name.toLowerCase() === trimmed.toLowerCase())) { setError("A sport with this name already exists."); return; }
    if (!loading) onSave({ name: trimmed, icon, active });
  }
  return <SportDialog title={sport ? "Edit Sport" : "Add New Sport"} onClose={onClose}><form onSubmit={event => { event.preventDefault(); save(); }}>
    <div className="space-y-7 p-6">
      <div><p className="text-xs font-semibold">Sport Icon</p><label className="relative mx-auto mt-3 flex size-24 cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 text-neutral-500 hover:bg-neutral-100 focus-within:outline-2 focus-within:outline-neutral-800">
        <input type="file" aria-label="Upload sport icon" accept="image/png,image/jpeg,image/webp" onChange={event => { upload(event.target.files?.[0]); event.target.value = ""; }} className="absolute inset-0 size-full cursor-pointer opacity-0" />
        {icon.kind === "upload" || sport ? <span className="flex size-12 items-center justify-center"><SportArtwork icon={icon} name={name || "Sport"} /></span> : <AdminIcon name="plus" className="size-6" />}<span className="text-[10px] font-semibold uppercase">{loading ? "Loading…" : icon.kind === "upload" || sport ? "Change icon" : "Upload icon"}</span>
      </label><p className="mt-2 text-center text-[10px] text-neutral-400">PNG, JPEG or WebP · Up to 2 MB</p>{icon.kind === "upload" && <button type="button" onClick={() => setIcon({ kind: "builtin", id: sport?.id ?? "custom" })} className="mx-auto mt-2 block rounded text-xs underline underline-offset-4 focus-visible:outline-2">Remove uploaded icon</button>}{iconError && <p role="alert" className="mt-2 text-xs">{iconError}</p>}</div>
      <label className="grid gap-2 text-xs font-semibold">Sport Name<input required maxLength={80} value={name} onChange={event => { setName(event.target.value); setError(""); }} placeholder="e.g. Cricket" aria-invalid={Boolean(error)} aria-describedby={error ? "sport-name-error" : undefined} className="min-h-11 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-sm font-normal outline-none focus:ring-2 focus:ring-neutral-500" /></label>{error && <p id="sport-name-error" role="alert" className="text-xs">{error}</p>}
      <div className="flex items-center justify-between gap-4"><div><p className="text-sm font-medium">{active ? "Active" : "Inactive"}</p><p className="mt-1 text-xs text-neutral-500">{active ? "Enable this sport for new venue listings" : "Unavailable for new venue setup"}</p></div><SportSwitch active={active} label="Sport active" onChange={() => setActive(!active)} /></div>
    </div><footer className="grid grid-cols-2 gap-3 border-t border-neutral-100 p-6"><button type="button" onClick={onClose} className={sportButton}>Cancel</button><button type="submit" disabled={loading} className={sportPrimary}>{sport ? "Save Changes" : "Save Sport"}</button></footer>
  </form></SportDialog>;
}
