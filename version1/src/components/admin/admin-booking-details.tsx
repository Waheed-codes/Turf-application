"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AdminIcon } from "./admin-icon";
import { formatRupees } from "@/data/admin/mockAdmin";
import { type AdminBooking, type BookingAction, bookingContext, bookingDate, bookingTime, statusLabel, canCancelBooking, canRefundBooking } from "@/data/admin/mockAdminBookings";

const button = "rounded-xl border border-neutral-200 px-4 py-3 text-xs font-semibold hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-40";
const badge = "inline-block rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-1 text-[10px] font-semibold";
function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className="space-y-3"><h3 className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">{title}</h3>{children}</section>;
}
function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div className="min-w-0"><dt className="text-[10px] tracking-wide text-neutral-500 uppercase">{label}</dt><dd className="mt-1 break-words text-sm font-medium">{children}</dd></div>;
}
function timelineTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" }).format(new Date(value)).replace(/am|pm/g, part => part.toUpperCase());
}

function Confirmation({ action, onDismiss, onConfirm }: { action: BookingAction; onDismiss: () => void; onConfirm: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = ref.current;
    element?.showModal();
    return () => element?.close();
  }, []);
  return <dialog ref={ref} aria-labelledby="booking-confirm-title" aria-describedby="booking-confirm-description" onCancel={onDismiss} className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-900 shadow-xl backdrop:bg-black/50">
    <h2 id="booking-confirm-title" className="text-lg font-semibold">{action === "cancel" ? "Cancel this booking?" : "Simulate this refund?"}</h2>
    <p id="booking-confirm-description" className="mt-3 text-sm text-neutral-600">{action === "cancel" ? "This changes the mock booking to CANCELLED. Payment status stays unchanged." : "This changes the mock payment to REFUNDED. No real refund or payment will be made."}</p>
    <div className="mt-6 flex justify-end gap-2"><button autoFocus type="button" className={button} onClick={onDismiss}>Go Back</button><button type="button" className={`${button} !border-black !bg-black text-white`} onClick={onConfirm}>{action === "cancel" ? "Confirm Cancellation" : "Confirm Refund"}</button></div>
  </dialog>;
}

export function AdminBookingDetails({ booking, onClose, onAction }: { booking: AdminBooking; onClose: () => void; onAction: (action: BookingAction) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [action, setAction] = useState<BookingAction | null>(null);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    element?.showModal();
    return () => {
      element?.close();
      document.body.style.overflow = overflow;
      if (previousFocus?.isConnected) previousFocus.focus();
      else document.querySelector<HTMLInputElement>('input[aria-label="Search by user or venue"]')?.focus();
    };
  }, []);
  const { venue, resource } = bookingContext(booking);
  const photo = venue.photos[0];
  const canCancel = canCancelBooking(booking);
  const canRefund = canRefundBooking(booking);
  function confirm() {
    if (!action) return;
    onAction(action);
    setNotice(action === "cancel" ? "Booking cancelled in this preview. Payment status is unchanged." : "Payment marked refunded in this preview. No real money was moved.");
    setAction(null);
  }
  return <dialog ref={dialog} onCancel={event => { if (event.target === event.currentTarget) onClose(); }} onClose={event => {
    // Effect replay can reopen the dialog before cleanup's queued close event fires.
    if (event.target === event.currentTarget && !event.currentTarget.open) onClose();
  }} aria-labelledby="booking-details-title" onClick={event => {
    if (event.target !== event.currentTarget || action) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
  }} className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[580px] overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-0 text-neutral-900 shadow-2xl backdrop:bg-black/50">
    <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-neutral-100 bg-white px-6 py-5">
      <div className="flex flex-1 flex-wrap items-center gap-2"><h2 id="booking-details-title" className="text-lg font-semibold">Booking Details</h2><span className="text-sm text-neutral-500">#{booking.id}</span><span className={badge}>{statusLabel(booking.status)}</span></div>
      <button autoFocus type="button" onClick={onClose} aria-label="Close booking details" className="rounded-lg p-2 hover:bg-neutral-100"><AdminIcon name="close" className="size-4" /></button>
    </header>
    <div className="space-y-7 p-6">
      <Section title="User Info"><div className="flex items-center gap-4 rounded-xl border border-neutral-100 bg-neutral-50/60 p-4">
        <span role="img" aria-label={`${booking.customerName} avatar`} className="flex size-14 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-neutral-200 text-lg font-semibold">{booking.customerName.split(" ").map(part => part[0]).join("")}</span>
        <div className="min-w-0"><p className="font-semibold">{booking.customerName}</p><div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-600"><span>{booking.phoneNumber}</span><span className="break-all">{booking.email}</span></div></div>
      </div></Section>
      <Section title="Venue Info"><div className="flex items-start gap-4">
        <div className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">{photo ? <Image src={photo.previewUrl} alt={venue.name} fill sizes="96px" className="object-cover grayscale" unoptimized /> : <span className="p-2 text-center text-xs text-neutral-500">No venue image</span>}</div>
        <div className="min-w-0 flex-1"><p className="font-semibold">{venue.name}</p><div className="mt-1"><span className={badge}>{resource.sportLabel}</span></div><dl className="mt-3 grid gap-3 sm:grid-cols-2"><Field label="Court / Pitch">{resource.name}</Field><Field label="Area">{venue.location.area}</Field><Field label="Manager">{venue.manager.name}</Field></dl></div>
      </div></Section>
      <Section title="Booking Info"><dl className="grid grid-cols-1 gap-5 rounded-xl border border-neutral-100 bg-neutral-50/50 p-5 sm:grid-cols-2">
        <Field label="Date & Time"><span>{bookingDate(booking.date)}</span><span className="mt-1 block text-xs font-normal text-neutral-600">{bookingTime(booking)}</span></Field>
        <Field label="Amount">{formatRupees(booking.amount)}</Field>
        <Field label="Duration">{booking.endMinutes - booking.startMinutes} Minutes</Field>
        <Field label="Payment status"><span className={badge}>{booking.paymentStatus}</span></Field>
        <Field label="Payment method">{booking.paymentMethod ?? "Not provided"}</Field>
        <Field label="Transaction ID">{booking.transactionId ?? "Not available"}</Field>
        <Field label="Booking source">{booking.source}</Field>
      </dl></Section>
      <Section title="Booking Timeline"><ol className="ml-2 border-l border-neutral-200">{booking.timeline.map((event, index) => <li key={`${event.title}-${index}`} className="relative pb-5 pl-4 last:pb-0"><span aria-hidden="true" className="absolute top-1 -left-1.5 size-3 rounded-full border-2 border-white bg-neutral-700 ring-1 ring-neutral-200" /><div className="flex flex-wrap justify-between gap-1"><p className="text-xs font-semibold">{event.title}</p><time dateTime={event.at} className="text-[10px] text-neutral-500">{timelineTime(event.at)} IST</time></div><p className="mt-1 text-[11px] text-neutral-500">{event.description}</p></li>)}</ol></Section>
      <p className="text-[11px] text-neutral-500">Frontend simulation only. Changes last until this page is reloaded or left.</p>
      {notice && <p role="status" className="rounded-lg bg-neutral-100 p-3 text-xs">{notice}</p>}
    </div>
    <footer className="sticky bottom-0 border-t border-neutral-100 bg-white p-5">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3"><button type="button" disabled={!canCancel} aria-describedby={!canCancel ? "booking-action-help" : undefined} onClick={() => setAction("cancel")} className={button}>Cancel Booking</button><button type="button" disabled={!canRefund} aria-describedby="booking-action-help" onClick={() => setAction("refund")} className={button}>Issue Refund</button><button type="button" onClick={onClose} className={`${button} !border-black !bg-black text-white`}>Close</button></div>
      <p id="booking-action-help" className="mt-2 text-[10px] text-neutral-500">Refund requires a cancelled, paid booking. Completed and cancelled bookings cannot be cancelled.</p>
    </footer>
    {action && <Confirmation action={action} onDismiss={() => setAction(null)} onConfirm={confirm} />}
  </dialog>;
}
