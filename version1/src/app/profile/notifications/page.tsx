"use client";

import { useState } from "react";
import ProfilePageHeader from "@/components/profile/profile-page-header";

const preferences = [
  { id: "bookingConfirmations", label: "Booking confirmations", description: "Get notified when your booking is confirmed." },
  { id: "bookingReminders", label: "Booking reminders", description: "Get a reminder before your game starts." },
  { id: "promotionalOffers", label: "Promotional offers", description: "Occasional updates about offers and new venues." },
] as const;

export default function NotificationsPage() {
  const [enabled, setEnabled] = useState({ bookingConfirmations: true, bookingReminders: true, promotionalOffers: false });

  return <main className="min-h-svh bg-neutral-50 px-6 pt-6 pb-[calc(2rem+env(safe-area-inset-bottom))] font-sans text-neutral-950">
    <div className="mx-auto w-full max-w-sm">
      <ProfilePageHeader title="Notifications" />
      <section aria-label="Notification preferences" className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xs">
        <ul className="divide-y divide-neutral-100">
          {preferences.map((preference) => <li key={preference.id} className="flex items-center gap-3 px-4 py-5">
            <div className="min-w-0 flex-1">
              <h2 id={`${preference.id}-label`} className="text-sm font-semibold leading-5">{preference.label}</h2>
              <p id={`${preference.id}-description`} className="mt-1 text-xs leading-4 text-neutral-500">{preference.description}</p>
            </div>
            <button type="button" role="switch" aria-checked={enabled[preference.id]} aria-labelledby={`${preference.id}-label`} aria-describedby={`${preference.id}-description`} onClick={() => setEnabled((previous) => ({ ...previous, [preference.id]: !previous[preference.id] }))} className="flex size-11 shrink-0 items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
              <span aria-hidden="true" className={`relative block h-6 w-10 rounded-full transition-colors motion-reduce:transition-none ${enabled[preference.id] ? "bg-neutral-950" : "bg-neutral-200"}`}>
                <span className={`absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow-xs transition-transform motion-reduce:transition-none ${enabled[preference.id] ? "translate-x-4" : "translate-x-0"}`} />
              </span>
            </button>
          </li>)}
        </ul>
      </section>
      <p className="mt-6 px-3 text-center text-xs leading-5 text-neutral-500">Manage which ArenaX notifications you&apos;d like to receive.</p>
      <p className="mt-1 px-3 text-center text-xs leading-5 text-neutral-500">You can change these preferences at any time.</p>
    </div>
  </main>;
}
