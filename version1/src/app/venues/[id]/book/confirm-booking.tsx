"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { simulatePayment } from "@/lib/mock-payment";
import HomeIcon from "@/app/home/home-icon";
import { bookingQuery, mockPrice, type BookingContext } from "@/lib/booking-context";
import type { Venue } from "@/types/venue";
import { BookingSummary, PriceDetails } from "../booking-selection";

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";
const dialogStyle = "fixed inset-0 m-auto max-h-[85dvh] w-[calc(100%-3rem)] max-w-sm overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-950 shadow-xl backdrop:bg-black/30";

export default function ConfirmBooking({ venue, context }: { venue: Venue; context: BookingContext | null }) {
  const policy = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const paying = useRef(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const venueHref = `/venues/${venue.id}${context ? `?${bookingQuery(context)}` : ""}`;
  const total = context ? mockPrice(venue, context).total : null;

  async function proceedToPay() {
    if (!context || paying.current) return;
    paying.current = true;
    setProcessing(true);
    setError("");
    try {
      const receipt = await simulatePayment(venue, context);
      router.replace(`/game-pass/${encodeURIComponent(receipt.id)}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Please try again.");
      paying.current = false;
      setProcessing(false);
    }
  }
  return <main className="min-h-svh bg-neutral-50 px-6 pt-6 pb-[calc(8rem+env(safe-area-inset-bottom))] font-sans text-neutral-950">
    <div className="mx-auto w-full max-w-sm">
      <header className="flex items-center gap-3"><Link href={venueHref} replace aria-label="Back to venue" className={`flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-neutral-100 ${focus}`}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-5"><path d="M19 12H5m7-7-7 7 7 7" /></svg></Link><h1 className="text-xl font-semibold tracking-tight">Confirm Booking</h1></header>
      <section aria-label="Venue" className="mt-6"><h2 className="text-lg font-semibold [overflow-wrap:anywhere]">{venue.name}</h2><p className="mt-1 text-sm text-neutral-500">{venue.area}, {venue.city}</p></section>
      {context ? <>
        <BookingSummary venue={venue} context={context} title="Your Booking" />
        <PriceDetails venue={venue} context={context} showPreviewNote={false} />
        <button type="button" onClick={() => policy.current?.showModal()} className={`mt-6 flex min-h-14 w-full items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white px-4 text-left text-sm font-semibold hover:bg-neutral-100 ${focus}`}>Cancellation Policy<HomeIcon name="chevron" className="size-3 text-neutral-500" /></button>
        <p className="mt-5 text-center text-xs leading-5 text-neutral-500">By proceeding, you agree to the booking and cancellation terms.</p>
      </> : <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-5"><p className="text-sm leading-6 text-neutral-600">Choose available slots at this venue to continue.</p><Link href={venueHref} replace className={`mt-4 inline-flex min-h-11 items-center text-sm font-semibold underline ${focus}`}>Choose slots</Link></div>}
      <p role="status" className="mt-4 text-center text-sm text-neutral-600">{error}</p>
    </div>
    {context && total !== null && <div className="fixed inset-x-6 bottom-[calc(1rem+env(safe-area-inset-bottom))] mx-auto flex max-w-sm items-center gap-3 rounded-full border border-neutral-100 bg-white p-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
      <div className="shrink-0 pl-3"><p className="text-[0.625rem] font-semibold tracking-wider text-neutral-500">TOTAL</p><p className="text-lg font-bold">₹{total.toLocaleString("en-IN")}</p></div>
      <button type="button" onClick={proceedToPay} disabled={processing} aria-busy={processing} className={`flex min-h-11 min-w-0 flex-1 items-center justify-center rounded-full bg-black px-3 py-2 text-xs font-semibold text-white hover:bg-neutral-800 ${focus}`}>{processing ? "PROCESSING…" : "PROCEED TO PAY"}</button>
    </div>}
    <dialog ref={policy} aria-labelledby="policy-title" aria-describedby="policy-description" className={dialogStyle}>
      <h2 id="policy-title" className="text-lg font-semibold">Cancellation Policy</h2>
      <p id="policy-description" className="mt-3 text-sm leading-6 text-neutral-500">Cancellation and refund eligibility may depend on how long before the booking the cancellation is made. The final venue-specific cancellation policy will be connected later.</p>
      <form method="dialog"><button className={`mt-6 min-h-11 w-full rounded-full border border-neutral-300 text-sm font-semibold hover:bg-neutral-100 ${focus}`}>GOT IT</button></form>
    </dialog>
  </main>;
}
