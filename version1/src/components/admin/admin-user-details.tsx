"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { type AdminUser, userBookings, userTotals, userLastActive, userFavoriteSport } from "@/data/admin/mockAdminUsers";
import { bookingContext, bookingDate, bookingTime, statusLabel } from "@/data/admin/mockAdminBookings";
import { formatRupees } from "@/data/admin/mockAdmin";
import Image from "next/image";
import { AdminIcon } from "./admin-icon";

export const userButton = "min-h-10 rounded-lg border border-neutral-200 px-4 text-sm font-semibold hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2";
export function UserBadge({ status }: { status: AdminUser["status"] }) {
  return <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${status === "ACTIVE" ? "border-neutral-800 bg-neutral-800 text-white" : "border-neutral-300 bg-neutral-100 text-neutral-600"}`}>{status}</span>;
}
export function UserAvatar({ user }: { user: AdminUser }) {
  return <span role="img" aria-label={`${user.name} avatar`} className="flex size-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 text-xs font-semibold text-neutral-600">{user.avatar}</span>;
}
export function UserDialog({ title, onClose, children, drawer = false, header }: { title: string; onClose: () => void; children: ReactNode; drawer?: boolean; header?: ReactNode }) {
  const titleId = useId();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = ref.current;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; element?.showModal();
    const animation = drawer && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? element?.animate([{ transform: "translateX(100%)" }, { transform: "translateX(0)" }], { duration: 220, easing: "ease-out" }) : undefined;
    return () => { animation?.cancel(); element?.close(); document.body.style.overflow = overflow;
      if (previous?.isConnected) { const details = previous.closest("details"); if (details && !details.open) details.querySelector("summary")?.focus(); else previous.focus(); }
      else document.getElementById("user-search")?.focus();
    };
  }, [drawer]);
  return <dialog ref={ref} aria-labelledby={titleId} onCancel={event => { if (event.target === event.currentTarget) onClose(); }} onClose={event => { if (event.target === event.currentTarget && !event.currentTarget.open) onClose(); }} onClick={event => {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
  }} className={`fixed bg-white p-0 text-neutral-900 shadow-2xl backdrop:bg-black/40 ${drawer ? "inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-[480px] border-0 border-l border-neutral-200 open:flex open:flex-col" : "inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[580px] overflow-y-auto rounded-2xl border border-neutral-200"}`}><header className="flex shrink-0 items-start justify-between gap-3 border-b border-neutral-100 bg-white px-6 py-5"><h2 id={titleId} className={header ? "sr-only" : "text-lg font-semibold"}>{title}</h2>{header}<button type="button" aria-label="Close user dialog" onClick={onClose} className="flex size-9 shrink-0 items-center justify-center rounded-lg hover:bg-neutral-100 focus-visible:outline-2"><AdminIcon name="close" /></button></header>{children}</dialog>;
}
export function AdminUserDetails({ user, onClose, onStatusChange }: { user: AdminUser; onClose: () => void; onStatusChange: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [notice, setNotice] = useState("");
  const bookings = userBookings(user.id).sort((a, b) => b.date.localeCompare(a.date) || b.startMinutes - a.startMinutes || b.id.localeCompare(a.id));
  const totals = userTotals(user.id);
  const shown = expanded ? bookings : bookings.slice(0, 3);
  const heading = "text-[11px] font-semibold tracking-wider text-neutral-500 uppercase";
  return <UserDialog title="User Details" drawer onClose={onClose} header={<div className="flex min-w-0 items-center gap-4"><UserAvatar user={user} /><div className="min-w-0"><h3 className="mb-2 text-xl font-semibold break-words">{user.name}</h3><UserBadge status={user.status} /></div></div>}>
    <div className="min-h-0 flex-1 space-y-7 overflow-y-auto p-6">
      <section aria-label="Contact info"><h3 className={heading}>Contact Info</h3><dl className="mt-4 space-y-4 rounded-xl border border-neutral-100 bg-neutral-50/40 p-4">{[["Phone Number", user.phone], ["Email Address", user.email], ["Joined Date", bookingDate(user.signupDate)]].map(([label, value]) => <div key={label}><dt className="text-[10px] text-neutral-500">{label}</dt><dd className="mt-1 text-xs font-semibold break-words">{value}</dd></div>)}</dl><p className="mt-2 text-[10px] text-neutral-500">Last active: {userLastActive(user.lastActive)}</p></section>
      <section aria-label="Stats overview"><h3 className={heading}>Stats Overview</h3><dl className="mt-4 grid grid-cols-3 gap-2">{[["Total Bookings", String(totals.totalBookings)], ["Total Spend", formatRupees(totals.totalSpend)], ["Fav. Sport", userFavoriteSport(user.id)]].map(([label, value]) => <div key={label} className="flex min-w-0 flex-col-reverse gap-2 rounded-xl border border-neutral-200 p-3 text-center"><dt className="text-[9px] font-semibold text-neutral-500 uppercase">{label}</dt><dd className="text-sm font-bold break-words sm:text-base">{value}</dd></div>)}</dl><p className="mt-2 text-[10px] text-neutral-500">Spend includes paid bookings only; refunds and unpaid bookings are excluded.</p></section>
      <section aria-label="User booking history"><div className="mb-4 flex items-center justify-between gap-2"><h3 className={heading}>Booking History</h3>{bookings.length > 3 && <button type="button" aria-expanded={expanded} aria-controls="user-booking-list" onClick={() => setExpanded(!expanded)} className="rounded px-2 py-1 text-[10px] font-semibold uppercase hover:bg-neutral-100 focus-visible:outline-2">{expanded ? "Show Less" : "View All"}</button>}</div>{bookings.length ? <ul id="user-booking-list" className="space-y-3">{shown.map(booking => {
        const { venue, resource } = bookingContext(booking);
        const photo = venue.photos[0];
        return <li key={booking.id} className="rounded-xl border border-neutral-200 p-4"><div className="flex flex-wrap items-center justify-between gap-2 text-[9px] text-neutral-500"><span>#{booking.id}</span><span className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-1 font-semibold">{statusLabel(booking.status)}</span></div><div className="mt-3 flex items-start gap-3"><div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-neutral-100">{photo ? <Image src={photo.previewUrl} alt={venue.name} width={44} height={44} unoptimized className="size-full object-cover grayscale" /> : <AdminIcon name="venues" />}</div><div className="min-w-0 flex-1"><h4 className="text-xs font-semibold">{venue.name}</h4><p className="mt-1 text-[10px] text-neutral-500">{resource.sportLabel} · {resource.name}</p><p className="mt-1 text-[10px] text-neutral-500">{bookingDate(booking.date)}</p><p className="mt-1 text-[10px] text-neutral-500">{bookingTime(booking)}</p></div><span className="text-xs font-semibold whitespace-nowrap">{formatRupees(booking.amount)}</span></div></li>;
      })}</ul> : <p className="rounded-xl bg-neutral-50 p-6 text-center text-sm text-neutral-500">No bookings yet.</p>}</section>
      {notice && <p role="status" className="rounded-lg bg-neutral-100 p-3 text-xs text-neutral-600">{notice}</p>}
    </div><footer className="grid shrink-0 grid-cols-3 gap-2 border-t border-neutral-100 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]"><button type="button" onClick={onStatusChange} className={`${userButton} px-2! text-xs!`}>{user.status === "ACTIVE" ? "Block User" : "Unblock User"}</button><button type="button" onClick={() => setNotice("Notifications are not connected in this preview. No notification was sent.")} className={`${userButton} px-2! text-xs!`}>Notification</button><button type="button" onClick={onClose} className={`${userButton} bg-neutral-900 px-2! text-xs! text-white hover:bg-black`}>Close</button></footer>
  </UserDialog>;
}
