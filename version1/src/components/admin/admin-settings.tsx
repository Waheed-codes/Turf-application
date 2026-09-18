"use client";

import { useState } from "react";
import { adminRoles, roleLabels, permissions, settingsTabs, mockAdminSettings, validateSettings, type SettingsTab, type SettingsAdmin } from "@/data/admin/mockAdminSettings";
import { AdminPageHeader } from "./admin-page-header";
import { AdminIcon, type AdminIconName } from "./admin-icon";
import { AdminEditor, SettingsDialog, settingsButton, settingsPrimary } from "./admin-settings-dialog";

import { GeneralSettings, CommissionSettings, NotificationSettings, SecuritySettings, PaymentGatewaySettings } from "./admin-settings-sections";

const icons: Record<SettingsTab, AdminIconName> = { General: "settings", "Commission & Fees": "payments", Notifications: "bell", "Admin Roles & Permissions": "managers", "Payment Gateway": "payments", Security: "check" };
const subtitles: Record<SettingsTab, string> = { General: "Basic platform configuration", "Commission & Fees": "Configure platform fees in INR (₹)", Notifications: "Control automated messages sent to managers and users", "Admin Roles & Permissions": "Manage who can access and edit platform data", "Payment Gateway": "Configure how the platform collects payments from users", Security: "Manage authentication and platform security settings" };
function loginLabel(value: string | null) { return value ? new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: true }).format(new Date(value)) : "—"; }
export function AdminSettings() {
  const [tab, setTab] = useState<SettingsTab>("General");
  const [saved, setSaved] = useState(mockAdminSettings);
  const [draft, setDraft] = useState(mockAdminSettings);
  const [editor, setEditor] = useState<{ admin: SettingsAdmin | null } | null>(null);
  const [removing, setRemoving] = useState<SettingsAdmin | null>(null);
  const [notice, setNotice] = useState(""); const [error, setError] = useState("");
  const dirty = JSON.stringify(saved) !== JSON.stringify(draft);
  const [revision, setRevision] = useState(0);
  const updateDraft = (update: (current: typeof draft) => typeof draft) => { setDraft(update); setError(""); setNotice(""); };
  function save() { const invalid = validateSettings(draft); if (invalid) { setTab(invalid.tab); setError(invalid.message); setNotice(""); return; } setSaved(draft); setError(""); setNotice("Settings saved for this preview session."); }
  function saveAdmin(values: Pick<SettingsAdmin, "name" | "email" | "role" | "status">) {
    if (!editor) return;
    const previous = editor.admin;
    const admin: SettingsAdmin = { ...values, id: previous?.id ?? `admin-${crypto.randomUUID()}`, lastLogin: previous?.lastLogin ?? null };
    setDraft(current => ({ ...current, admins: previous ? current.admins.map(item => item.id === previous.id ? admin : item) : [...current.admins, admin] }));
    setEditor(null); setNotice(`${values.name} ${previous ? "updated" : "added as invited"}. Save Changes to keep this draft.`);
  }
  return <>
    <AdminPageHeader title="Settings" subtitle="Manage platform configuration and preferences" />
    <div className="grid min-w-0 grid-cols-1 items-start gap-6 lg:grid-cols-[230px_minmax(0,1fr)]">
      <nav aria-label="Settings sections" className="flex min-w-0 gap-1 overflow-x-auto rounded-xl border border-neutral-100 bg-white p-2 shadow-xs lg:flex-col lg:gap-0 lg:p-0 lg:py-2">{settingsTabs.map(item => <button key={item} type="button" aria-current={tab === item ? "page" : undefined} onClick={() => { setTab(item); setError(""); }} className={`flex min-h-14 shrink-0 items-center gap-3 border-l-2 px-4 py-3 text-left text-sm focus-visible:outline-2 focus-visible:-outline-offset-4 lg:shrink ${tab === item ? "border-neutral-900 bg-neutral-100 font-semibold text-neutral-900" : "border-transparent text-neutral-500 hover:bg-neutral-50 hover:text-black"}`}><AdminIcon name={icons[item]} /><span className="whitespace-nowrap lg:whitespace-normal">{item}</span></button>)}</nav>
      <section aria-label={tab} className="min-w-0 rounded-xl border border-neutral-100 bg-white shadow-xs">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 p-6 sm:p-8"><div><h2 className="text-xl font-semibold">{tab === "General" ? "General Settings" : tab === "Notifications" ? "Notification Settings" : tab}</h2><p className="mt-1 text-sm text-neutral-500">{subtitles[tab]}</p></div>{tab === "Admin Roles & Permissions" && <button id="invite-admin" type="button" onClick={() => setEditor({ admin: null })} className={settingsPrimary}><AdminIcon name="plus" />Invite Admin</button>}</header>
        <form onSubmit={event => { event.preventDefault(); save(); }} noValidate>
          {tab === "Admin Roles & Permissions" ? <>
            <div className="overflow-x-auto px-6 py-4 sm:px-8"><table className="w-full min-w-[700px] text-left text-xs"><thead className="text-[10px] tracking-wider text-neutral-400 uppercase"><tr>{["Admin", "Email", "Role", "Last Login", "Status", "Actions"].map(label => <th key={label} scope="col" className="px-2 py-5 font-semibold">{label}</th>)}</tr></thead><tbody className="divide-y divide-neutral-100">{draft.admins.map(admin => <tr key={admin.id}><th scope="row" className="px-2 py-5"><div className="flex items-center gap-2"><span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-[10px] text-neutral-500">{admin.name.split(" ").map(part => part[0]).join("").slice(0,2)}</span><span className="min-w-20 font-semibold">{admin.name}</span></div></th><td className="px-2 py-5 text-neutral-500">{admin.email}</td><td className="px-2 py-5"><span className="whitespace-nowrap rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-[9px] font-semibold uppercase">{roleLabels[admin.role]}</span></td><td className="px-2 py-5 text-neutral-500">{loginLabel(admin.lastLogin)}</td><td className="px-2 py-5"><span className="text-[10px] font-semibold text-neutral-600">{admin.status}</span></td><td className="px-2 py-5"><div className="flex gap-1"><button type="button" aria-label={`Edit ${admin.name}`} onClick={() => setEditor({ admin })} className="rounded px-2 py-2 text-neutral-500 hover:bg-neutral-100 focus-visible:outline-2">Edit</button><button type="button" aria-label={`Remove ${admin.name}`} onClick={() => setRemoving(admin)} className="rounded px-2 py-2 text-neutral-500 hover:bg-neutral-100 focus-visible:outline-2">Remove</button></div></td></tr>)}</tbody></table>{!draft.admins.length && <p className="p-6 text-center text-sm text-neutral-500">No admins in this preview. Invite an admin to get started.</p>}</div>
            <div className="border-t border-neutral-100 p-6 sm:p-8"><h3 className="text-sm font-semibold tracking-wide uppercase">Role Permissions</h3><p className="mt-1 text-xs text-neutral-400">Default feature access for each role. Authorization is not enforced in this preview.</p><div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-100 bg-neutral-50/60"><table aria-label="Role permissions" className="w-full min-w-[500px] text-left text-xs"><thead className="text-[9px] tracking-wider text-neutral-400 uppercase"><tr><th scope="col" className="px-5 py-4">Permission</th>{adminRoles.map(role => <th key={role} scope="col" className="px-3 py-4 text-center">{roleLabels[role]}</th>)}</tr></thead><tbody className="divide-y divide-neutral-100">{permissions.map(permission => <tr key={permission.id}><th scope="row" className="px-5 py-4 font-normal text-neutral-600">{permission.label}</th>{adminRoles.map(role => <td key={role} className="px-3 py-4 text-center">{permission.roles.some(value => value === role) ? <span className="relative inline-flex size-4 items-center justify-center rounded-full bg-neutral-800 text-white"><AdminIcon name="check" className="size-3" /><span className="sr-only">Allowed</span></span> : <span className="relative inline-block size-2 rounded-full bg-neutral-200"><span className="sr-only">Not allowed</span></span>}</td>)}</tr>)}</tbody></table></div></div>
          </> : <div className="space-y-6 p-6 sm:p-8">
            {tab === "General" && <GeneralSettings key={revision} draft={draft} onChange={updateDraft} />}
            {tab === "Commission & Fees" && <CommissionSettings draft={draft} onChange={updateDraft} />}
            {tab === "Notifications" && <NotificationSettings draft={draft} onChange={updateDraft} />}
            {tab === "Security" && <SecuritySettings draft={draft} onChange={updateDraft} />}
            {tab === "Payment Gateway" && <PaymentGatewaySettings draft={draft} onChange={updateDraft} />}
          </div>}
          <footer className="flex flex-col items-stretch justify-between gap-4 border-t border-neutral-100 p-6 sm:flex-row sm:items-center sm:px-8"><div className="min-w-0 flex-1"><p className="text-xs text-neutral-500">{dirty ? "Unsaved changes" : "No unsaved changes"}</p>{error && <p role="alert" className="mt-2 text-sm font-medium">{error}</p>}{notice && <p role="status" className="mt-2 text-xs text-neutral-600">{notice}</p>}</div><div className="flex shrink-0 flex-wrap gap-3"><button type="button" onClick={() => { setDraft(saved); setRevision(value => value + 1); setError(""); setNotice("Unsaved changes discarded."); }} className={settingsButton}>Discard</button>{tab === "Payment Gateway" && <button type="button" onClick={() => setNotice(`Simulated check for ${draft.values.paymentProvider} (${draft.values.paymentMode} mode) complete. No connection was made or credentials verified.`)} className={settingsButton}>Test Connection</button>}<button type="submit" className={settingsPrimary}>Save Changes</button></div></footer>
        </form>
      </section>
    </div><p className="mt-4 text-xs text-neutral-500">Frontend preview · Saved settings last until you leave or reload this page.</p>
    {editor && <AdminEditor admin={editor.admin} admins={draft.admins} onSave={saveAdmin} onClose={() => setEditor(null)} />}
    {removing && <SettingsDialog title="Remove this admin?" onClose={() => setRemoving(null)}><p className="p-6 text-sm text-neutral-600">Remove <strong className="text-neutral-900">{removing.name}</strong> from this preview?</p><footer className="flex justify-end gap-3 border-t border-neutral-100 p-6"><button autoFocus type="button" onClick={() => setRemoving(null)} className={settingsButton}>Cancel</button><button type="button" onClick={() => { setDraft(current => ({ ...current, admins: current.admins.filter(admin => admin.id !== removing.id) })); setNotice(`${removing.name} removed from the draft. Save Changes to keep this change.`); setRemoving(null); }} className={settingsPrimary}>Remove Admin</button></footer></SettingsDialog>}
  </>;
}
