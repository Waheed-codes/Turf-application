"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { adminRoles, roleLabels, type AdminRole, type SettingsAdmin } from "@/data/admin/mockAdminSettings";
import { AdminIcon } from "./admin-icon";
export const settingsInput = "min-h-11 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-sm font-normal outline-none focus:ring-2 focus:ring-neutral-500";
export const settingsButton = "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-neutral-200 px-4 text-sm font-semibold hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2";
export const settingsPrimary = `${settingsButton} border-neutral-900 bg-neutral-900 text-white hover:bg-black`;
export function SettingsDialog({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null); const titleId = useId();
  useEffect(() => {
    const element = ref.current;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; element?.showModal();
    return () => { element?.close(); document.body.style.overflow = overflow; if (previous?.isConnected) previous.focus(); else document.getElementById("invite-admin")?.focus(); };
  }, []);
  return <dialog ref={ref} aria-labelledby={titleId} onCancel={onClose} onClose={event => { if (!event.currentTarget.open) onClose(); }} onClick={event => {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
  }} className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-0 text-neutral-900 shadow-2xl backdrop:bg-black/40"><header className="flex items-center justify-between border-b border-neutral-100 px-6 py-4"><h2 id={titleId} className="text-lg font-semibold">{title}</h2><button type="button" aria-label="Close settings dialog" onClick={onClose} className="flex size-9 items-center justify-center rounded-lg hover:bg-neutral-100 focus-visible:outline-2"><AdminIcon name="close" /></button></header>{children}</dialog>;
}
export function AdminEditor({ admin, admins, onClose, onSave }: { admin: SettingsAdmin | null; admins: SettingsAdmin[]; onClose: () => void; onSave: (values: Pick<SettingsAdmin, "name" | "email" | "role" | "status">) => void }) {
  const [name, setName] = useState(admin?.name ?? ""); const [email, setEmail] = useState(admin?.email ?? "");
  const [role, setRole] = useState<AdminRole>(admin?.role ?? "SUPPORT"); const [status, setStatus] = useState<SettingsAdmin["status"]>(admin?.status ?? "INVITED"); const [error, setError] = useState("");
  return <SettingsDialog title={admin ? "Edit Admin" : "Invite Admin"} onClose={onClose}><form onSubmit={event => { event.preventDefault(); const cleanEmail = email.trim().toLowerCase(); if (!name.trim()) { setError("Enter an admin name."); return; } if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) { setError("Enter a valid email address."); return; } if (admins.some(item => item.id !== admin?.id && item.email.toLowerCase() === cleanEmail)) { setError("This email already belongs to an admin."); return; } onSave({ name: name.trim(), email: cleanEmail, role, status: admin ? status : "INVITED" }); }}><div className="space-y-5 p-6"><label className="grid gap-2 text-xs font-semibold">Name<input required maxLength={80} value={name} onChange={event => { setName(event.target.value); setError(""); }} className={settingsInput} /></label><label className="grid gap-2 text-xs font-semibold">Email<input required type="email" maxLength={254} value={email} onChange={event => { setEmail(event.target.value); setError(""); }} className={settingsInput} /></label><label className="grid gap-2 text-xs font-semibold">Role<select aria-label="Role" value={role} onChange={event => setRole(event.target.value as AdminRole)} className={settingsInput}>{adminRoles.map(value => <option key={value} value={value}>{roleLabels[value]}</option>)}</select></label>{admin && <label className="grid gap-2 text-xs font-semibold">Status<select aria-label="Status" value={status} onChange={event => setStatus(event.target.value as SettingsAdmin["status"])} className={settingsInput}><option value="ACTIVE">Active</option><option value="INVITED">Invited</option></select></label>}{error && <p role="alert" className="text-xs">{error}</p>}<p className="text-xs text-neutral-500">Preview only. No invitation email will be sent.</p></div><footer className="grid grid-cols-2 gap-3 border-t border-neutral-100 p-6"><button type="button" onClick={onClose} className={settingsButton}>Cancel</button><button type="submit" className={settingsPrimary}>{admin ? "Save Admin" : "Send Invite"}</button></footer></form></SettingsDialog>;
}
