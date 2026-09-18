"use client";

import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import HomeIcon from "@/app/home/home-icon";
import CustomerNavigation from "@/components/navigation/customer-navigation";
import { usePreviewSession } from "@/app/session-navigation";
import { useUserProfile } from "@/hooks/use-user-profile";

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";
const icons = {
  edit: <><path d="m15 4 5 5M4 20l4-1L20 7a2 2 0 0 0-4-4L4 15v5Z" /></>,
  payment: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 10h18M7 15h3" /></>,
  notifications: <><path d="M5 17h14l-2-3V9a5 5 0 0 0-10 0v5l-2 3Zm5 3h4" /></>,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 5m0 3h.01" /></>,
  referral: <><circle cx="9" cy="8" r="3" /><path d="M3 21v-2a6 6 0 0 1 12 0v2m2-14h5m-2.5-2.5v5" /></>,
  terms: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Zm0 0v6h6M8 13h8M8 17h6" /></>,
  privacy: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" /><path d="m8 12 3 3 5-6" /></>,
  logout: <><path d="M9 4H5v16h4m5-12 4 4-4 4m-5-4h12" /></>,
};
function Icon({ name }: { name: keyof typeof icons }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-5 shrink-0">{icons[name]}</svg>;
}
const placeholders: Record<string, string> = {
  "Help & Support": "Support contact options will be available soon.",
  "Refer a Friend": "Inviting friends to ArenaX will be available soon.",
  "Terms & Conditions": "Terms and conditions will be published here when available.",
  "Privacy Policy": "The privacy policy will be published here when available.",
};

export default function ProfileScreen() {
  const { user } = useUserProfile();
  const { logout } = usePreviewSession();
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState("");
  function open(label: string) {
    setSelected(label);
    dialog.current?.showModal();
  }
  function row(label: string, icon: ReactNode, href?: string) {
    const content = <><span className="text-neutral-500">{icon}</span><span className="min-w-0 flex-1">{label}</span><HomeIcon name="chevron" className="size-3 shrink-0 text-neutral-400" /></>;
    const className = `flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-neutral-50 active:bg-neutral-100 ${focus}`;
    return <li key={label}>{href ? <Link href={href} className={className}>{content}</Link> : <button type="button" onClick={() => open(label)} className={className}>{content}</button>}</li>;
  }
  return <main className="min-h-svh bg-neutral-50 px-6 pt-8 pb-[calc(8rem+env(safe-area-inset-bottom))] font-sans text-neutral-950">
    <div className="mx-auto w-full max-w-sm">
      <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
      <section aria-label="Your profile" className="mt-6 flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-neutral-100"><HomeIcon name="profile" className="size-6 text-neutral-600" /></div>
        <div className="min-w-0 flex-1"><h2 className="text-base font-semibold [overflow-wrap:anywhere]">{user.name}</h2><p className="mt-1 text-xs text-neutral-500">{user.phone}</p></div>
        <Link href="/profile/personal-details" aria-label="Edit personal details" className={`flex size-11 shrink-0 items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200 ${focus}`}><Icon name="edit" /></Link>
      </section>
      <dl className="mt-5 grid grid-cols-3 divide-x divide-neutral-200 py-3 text-center">
        {[["Bookings", user.bookings], ["Fav sport", user.favoriteSport], ["Member since", user.memberSince]].map(([label, value]) => <div key={label} className="min-w-0 px-1"><dt className="text-[0.5625rem] font-medium tracking-wide text-neutral-500 uppercase">{label}</dt><dd className="mt-1 text-xs font-semibold sm:text-sm">{value}</dd></div>)}
      </dl>
      <section aria-labelledby="account" className="mt-6"><h2 id="account" className="text-xs font-semibold tracking-widest text-neutral-500">ACCOUNT</h2><ul className="mt-3 overflow-hidden rounded-2xl border border-neutral-200 bg-white divide-y divide-neutral-100">
        {row("Personal Details", <HomeIcon name="profile" />, "/profile/personal-details")}
        {row("Payment Methods", <Icon name="payment" />, "/profile/payment-methods")}
        {row("Favourites", <HomeIcon name="heart" />, "/favorites")}
      </ul></section>
      <section aria-labelledby="preferences" className="mt-6"><h2 id="preferences" className="text-xs font-semibold tracking-widest text-neutral-500">PREFERENCES</h2><ul className="mt-3 overflow-hidden rounded-2xl border border-neutral-200 bg-white">{row("Notification Settings", <Icon name="notifications" />, "/profile/notifications")}</ul></section>
      <section aria-labelledby="support" className="mt-6"><h2 id="support" className="text-xs font-semibold tracking-widest text-neutral-500">SUPPORT</h2><ul className="mt-3 overflow-hidden rounded-2xl border border-neutral-200 bg-white divide-y divide-neutral-100">
        {row("Help & Support", <Icon name="help" />)}
        {row("Refer a Friend", <Icon name="referral" />)}
        {row("Terms & Conditions", <Icon name="terms" />)}
        {row("Privacy Policy", <Icon name="privacy" />)}
      </ul></section>
      <button type="button" onClick={logout} className={`mt-7 flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-neutral-300 text-sm font-semibold hover:bg-neutral-100 active:bg-neutral-200 ${focus}`}><Icon name="logout" />Log Out</button>
    </div>
    <CustomerNavigation active="/home" onUnavailable={open} />
    <dialog ref={dialog} aria-labelledby="profile-action-title" aria-describedby="profile-action-description" className="fixed inset-0 m-auto w-[calc(100%-3rem)] max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-950 shadow-xl backdrop:bg-black/30">
      <h2 id="profile-action-title" className="text-lg font-semibold">{selected}</h2>
      <p id="profile-action-description" className="mt-3 text-sm leading-6 text-neutral-500">{placeholders[selected]}</p>
      <form method="dialog"><button className={`mt-6 min-h-11 w-full rounded-full border border-neutral-300 text-sm font-semibold hover:bg-neutral-100 ${focus}`}>Close</button></form>
    </dialog>
  </main>;
}
