"use client";

import Link from "next/link";
import { useState } from "react";
import { ManagerBottomNav } from "@/components/manager/manager-bottom-nav";
import { ManagerDialog } from "@/components/manager/manager-dialog";
import { useManagerOnboarding } from "@/components/manager/manager-onboarding-provider";
import { usePreviewSession } from "@/app/session-navigation";

const venueRows = [
  ["Services", "services", "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-2 0c-4 6 8 12 4 18"],
  ["Name Your Courts", "courts", "m3 7 9-4 9 4-9 4-9-4Zm0 5 9 4 9-4M3 17l9 4 9-4"],
  ["Venue Location", "location", "M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0ZM12 8v4m-2-2h4"],
  ["Venue Photos", "photos", "M3 4h18v16H3V4Zm0 13 6-6 4 4 3-3 5 5M7 8h1"],
  ["Venue Description", "description", "M6 3h8l4 4v14H6V3Zm8 0v5h4M9 12h6m-6 4h6"],
  ["Amenities", "amenities", "m3 5 1 1 2-3m3 2h12M3 12l1 1 2-3m3 2h12M3 19l1 1 2-3m3 2h12"],
  ["Set Time Slots", "slots", "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4v5l3 2"],
];
const bankPath = "M3 5h18v14H3V5Zm0 5h18M6 15h4";
const buttonClass = "min-h-12 rounded-xl border border-neutral-200 px-4 font-semibold hover:bg-neutral-50 focus-visible:outline-2";
function Icon({ path, chevron = false }: { path: string; chevron?: boolean }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className={chevron ? "size-4 shrink-0 text-neutral-300" : "size-4"} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={path} /></svg>;
}
function Row({ label, path, href, onClick }: { label: string; path: string; href?: string; onClick?: () => void }) {
  const content = <><span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-neutral-50 text-neutral-600"><Icon path={path} /></span><span className="min-w-0 flex-1 [overflow-wrap:anywhere]">{label}</span><Icon path="m9 5 7 7-7 7" chevron /></>;
  const className = "flex min-h-[65px] w-full cursor-pointer items-center gap-3 border-b border-neutral-50 px-4 py-3 text-left text-sm last:border-0 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:-outline-offset-4";
  return href ? <Link href={href} className={className}>{content}</Link> : <button type="button" onClick={onClick} className={className}>{content}</button>;
}

export default function SettingsPage() {
  const [panel, setPanel] = useState<string | null>(null);
  const { notificationPreferences, setNotificationPreferences } = useManagerOnboarding();
  const { logout } = usePreviewSession();
  const editHref = (step: string) => `/manager/onboarding/${step}?mode=edit&from=settings`;
  return <div className="mx-auto min-h-dvh w-full max-w-md bg-white font-sans text-neutral-900">
    <header className="border-b border-neutral-100 pt-[env(safe-area-inset-top)]"><h1 className="px-5 py-4 text-xl font-bold tracking-tight">Settings</h1></header>
    <main className="px-5 pt-6 pb-[calc(8rem+env(safe-area-inset-bottom))]">
      <button type="button" onClick={() => setPanel("Manager Profile")} className="flex min-h-[90px] w-full cursor-pointer items-center gap-4 rounded-2xl border border-neutral-100 p-4 text-left shadow-xs hover:bg-neutral-50 focus-visible:outline-2">
        <span aria-hidden="true" className="flex size-14 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-lg font-semibold text-neutral-600">AM</span>
        <span className="min-w-0 flex-1"><span className="block font-bold [overflow-wrap:anywhere]">Arjun Mehta</span><span className="mt-0.5 block text-xs text-neutral-400">Green Park Turf</span></span><Icon path="m9 5 7 7-7 7" chevron />
      </button>
      {(["VENUE", "ACCOUNT", "SUPPORT"] as const).map((section) => <section key={section} aria-labelledby={`${section}-title`} className="mt-8">
        <h2 id={`${section}-title`} className="mb-3 px-1 text-[11px] font-semibold tracking-widest text-neutral-400">{section}</h2>
        <div className="overflow-hidden rounded-2xl border border-neutral-100 shadow-xs">
          {section === "VENUE" && venueRows.map(([label, step, path]) => <Row key={step} label={label} path={path} href={editHref(step)} />)}
          {section === "ACCOUNT" && <><Row label="Banking Details" path={bankPath} href={editHref("banking")} /><Row label="Notifications" path="M5 17h14l-2-3V9a5 5 0 0 0-10 0v5l-2 3Zm5 3h4" onClick={() => setPanel("Notifications")} /><Row label="Change Password" path="M5 10h14v11H5V10Zm3 0V7a4 4 0 0 1 8 0v3" onClick={() => setPanel("Change Password")} /></>}
          {section === "SUPPORT" && <><Row label="Help & FAQs" path="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-2 5a2 2 0 1 1 3 2l-1 2m0 4h.01" onClick={() => setPanel("Help & FAQs")} /><Row label="Contact Admin" path="M4 14v-3a8 8 0 0 1 16 0v3M4 12H2v6h4v-6H4Zm16 0h2v6h-4v-6h2Zm0 6v3h-7" onClick={() => setPanel("Contact Admin")} /></>}
        </div>
      </section>)}
      <button type="button" onClick={logout} className="mt-12 flex min-h-[58px] w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-neutral-100 text-base font-bold hover:bg-neutral-50 focus-visible:outline-2"><Icon path="M10 4H4v16h6m4-13 5 5-5 5m-6-5h11" />Log Out</button>
    </main>
    <ManagerBottomNav active="Settings" />
    {panel && <ManagerDialog title={panel} onDismiss={() => setPanel(null)}>
      {panel === "Manager Profile" && <div className="mt-4 space-y-2 text-sm"><p className="font-semibold">Arjun Mehta · Green Park Turf</p><p className="text-neutral-500">Profile editing is coming soon.</p></div>}
      {panel === "Notifications" && <div className="mt-4"><p className="mb-3 text-sm text-neutral-500">Preferences apply to this preview only.</p>{Object.entries(notificationPreferences).map(([name, checked]) => <label key={name} className="flex min-h-14 cursor-pointer items-center justify-between gap-3 border-b border-neutral-100 text-sm">{name} Notifications<input type="checkbox" role="switch" checked={checked} onChange={(event) => setNotificationPreferences((current) => ({ ...current, [name]: event.target.checked }))} className="size-5 shrink-0 accent-neutral-900 focus-visible:outline-2" /></label>)}</div>}
      {panel === "Change Password" && <p className="mt-4 text-sm leading-6 text-neutral-500">Password changes are not available in this preview. Your current sign-in details remain unchanged.</p>}
      {panel === "Contact Admin" && <p className="mt-4 text-sm leading-6 text-neutral-500">Admin contact details have not been added yet. Support messaging will be available in a future release.</p>}
      {panel === "Help & FAQs" && <div className="mt-4 space-y-3">{[["How do I edit my venue?", "Choose a row under Venue to open your existing setup. Save Changes returns you to Settings."], ["Can I rename a court?", "Open Name Your Courts, tap a court, and save its new name. Its bookings and schedule stay linked."], ["How do I change opening hours?", "Open Set Time Slots and select the playing area you want to update."], ["Will my changes survive a refresh?", "This preview keeps venue changes only during your current session."]].map(([question, answer]) => <details key={question} className="rounded-xl border border-neutral-100 p-3 text-sm"><summary className="cursor-pointer font-semibold focus-visible:outline-2">{question}</summary><p className="mt-2 leading-6 text-neutral-500">{answer}</p></details>)}</div>}
      <button type="button" onClick={() => setPanel(null)} className={`${buttonClass} mt-6 w-full`}>Done</button>
    </ManagerDialog>}
  </div>;
}
