"use client";

import { useEffect, useRef, useState } from "react";
import { BookingDetails } from "./booking-details";
import { DAY_MINUTES, useManagerOnboarding } from "./manager-onboarding-provider";

export type SlotSelection = {
  resourceId: string;
  sportLabel: string;
  resourceName: string;
  resourceLabel: string;
  date: string;
  dateLabel: string;
  startMinutes: number;
  endMinutes: number;
};

function timeRange(start: number, end: number) {
  const format = (minutes: number) => {
    const time = minutes % DAY_MINUTES;
    const hour = Math.floor(time / 60);
    return `${String(hour % 12 || 12).padStart(2, "0")}:${String(time % 60).padStart(2, "0")} ${hour < 12 ? "AM" : "PM"}`;
  };
  return `${format(start)} – ${format(end)}${end >= DAY_MINUTES ? (start >= DAY_MINUTES ? " (next day)" : " (ends next day)") : ""}`;
}

const secondaryButton = "min-h-12 rounded-xl border border-neutral-300 px-4 py-3 text-sm font-semibold hover:bg-neutral-50 active:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900";
const inputClass = "mt-2 min-h-12 w-full min-w-0 rounded-xl border border-neutral-300 bg-white px-3 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900";

export function SlotBookingDialog({ selection, onDismiss }: { selection: SlotSelection; onDismiss: () => void }) {
  const [now] = useState(() => Date.now());
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { mockBookings, markSlotBooked } = useManagerOnboarding();
  const bookings = mockBookings.filter((booking) => booking.status !== "CANCELLED" && booking.resourceId === selection.resourceId && booking.date === selection.date && booking.startMinutes < selection.endMinutes && booking.endMinutes > selection.startMinutes);
  const booked = bookings.length > 0;

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return <dialog ref={dialogRef} onClose={(event) => { if (!event.currentTarget.open) onDismiss(); }} aria-labelledby="slot-dialog-title" className="fixed inset-x-0 top-auto bottom-0 m-0 mx-auto max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-neutral-200 bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-neutral-900 shadow-xl backdrop:bg-black/40 sm:inset-y-0 sm:m-auto sm:rounded-3xl">
    <h2 id="slot-dialog-title" className="text-xl font-bold">{booked ? "Booking Details" : "Mark Slot as Booked"}</h2>
    {booked ? <>
      {bookings.map((booking) => <BookingDetails key={booking.id} booking={booking} now={now} />)}
      <button type="button" onClick={() => dialogRef.current?.close()} className={`mt-6 w-full ${secondaryButton}`}>Close</button>
    </> : <form onSubmit={(event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      markSlotBooked({ resourceId: selection.resourceId, date: selection.date, startMinutes: selection.startMinutes, endMinutes: selection.endMinutes, customerName: String(data.get("customerName") ?? ""), phoneNumber: String(data.get("phoneNumber") ?? "") });
      dialogRef.current?.close();
    }}>
      <div className="mt-4 space-y-1 rounded-2xl bg-neutral-50 p-4 text-sm [overflow-wrap:anywhere]">
        <p className="font-semibold">{selection.sportLabel} • {selection.resourceName}</p>
        <p className="text-neutral-600">{selection.dateLabel}</p>
        <p className="font-medium tabular-nums">{timeRange(selection.startMinutes, selection.endMinutes)}</p>
      </div>
      <label htmlFor="booking-customer-name" className="mt-5 block text-sm font-medium">Customer Name <span className="font-normal text-neutral-500">(Optional)</span></label>
      <input id="booking-customer-name" name="customerName" autoComplete="off" maxLength={100} placeholder="Enter customer name" className={inputClass} />
      <label htmlFor="booking-phone-number" className="mt-4 block text-sm font-medium">Phone Number <span className="font-normal text-neutral-500">(Optional)</span></label>
      <input id="booking-phone-number" name="phoneNumber" type="tel" autoComplete="off" maxLength={40} placeholder="Enter phone number" className={inputClass} />
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button type="button" onClick={() => dialogRef.current?.close()} className={secondaryButton}>Cancel</button>
        <button type="submit" className="min-h-12 rounded-xl bg-neutral-900 px-3 py-3 text-sm font-semibold text-white hover:bg-neutral-800 active:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900">Mark as Booked</button>
      </div>
    </form>}
  </dialog>;
}
