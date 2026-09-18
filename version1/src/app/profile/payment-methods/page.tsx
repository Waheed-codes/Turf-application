"use client";

import { useRef, useState } from "react";
import ProfilePageHeader from "@/components/profile/profile-page-header";
import { mockPaymentMethods, type PaymentMethod } from "@/data/mockPaymentMethods";

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";
const secondary = `min-h-12 rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold hover:bg-neutral-100 active:bg-neutral-200 ${focus}`;
function methodLabel(method: PaymentMethod) {
  return method.type === "card" ? `${method.network} ending in ${method.last4}` : `UPI ${method.upiId}`;
}

export default function PaymentMethodsPage() {
  const [saved, setSaved] = useState({ methods: mockPaymentMethods, defaultId: mockPaymentMethods[0]?.id ?? "" });
  const [removing, setRemoving] = useState<PaymentMethod | null>(null);
  const [notice, setNotice] = useState("");
  const confirmation = useRef<HTMLDialogElement>(null);
  const information = useRef<HTMLDialogElement>(null);
  function remove() {
    if (!removing) return;
    setSaved((previous) => {
      const methods = previous.methods.filter((method) => method.id !== removing.id);
      return { methods, defaultId: previous.defaultId === removing.id ? methods[0]?.id ?? "" : previous.defaultId };
    });
    setNotice("Payment method removed.");
    confirmation.current?.close();
  }
  return <main className="min-h-svh bg-neutral-50 px-6 pt-6 pb-[calc(2rem+env(safe-area-inset-bottom))] font-sans text-neutral-950">
    <div className="mx-auto w-full max-w-sm">
      <ProfilePageHeader title="Payment Methods" />
      <p className="mt-5 text-sm leading-6 text-neutral-500">Manage payment methods for faster checkout.</p>
      <section aria-labelledby="saved-methods" className="mt-8">
        <h2 id="saved-methods" className="text-xs font-semibold tracking-widest text-neutral-500">SAVED PAYMENT METHODS</h2>
        {saved.methods.length ? <ul className="mt-4 space-y-4">{saved.methods.map((method) => <li key={method.id} className="rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold uppercase">{method.type === "card" ? method.network : "UPI"}</h3>
            <div className="flex items-center gap-2">
              {saved.defaultId === method.id && <span className="rounded-md bg-neutral-100 px-2 py-1 text-[0.5625rem] font-semibold tracking-wide text-neutral-600">DEFAULT</span>}
              <details className="relative">
                <summary aria-label={`Manage ${methodLabel(method)}`} className={`flex size-11 cursor-pointer list-none items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100 [&::-webkit-details-marker]:hidden ${focus}`}><svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-5"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg></summary>
                <div className="absolute right-0 top-12 z-10 w-44 rounded-xl border border-neutral-200 bg-white p-1 shadow-md">
                  {saved.defaultId === method.id ? <p className="px-3 py-3 text-sm text-neutral-500">Default</p> : <button type="button" onClick={(event) => { setSaved((previous) => ({ ...previous, defaultId: method.id })); setNotice(`${methodLabel(method)} is now the default.`); event.currentTarget.closest("details")?.removeAttribute("open"); }} className={`min-h-11 w-full rounded-lg px-3 text-left text-sm hover:bg-neutral-100 ${focus}`}>Set as default</button>}
                  <button type="button" onClick={(event) => { setRemoving(method); event.currentTarget.closest("details")?.removeAttribute("open"); confirmation.current?.showModal(); }} className={`min-h-11 w-full rounded-lg px-3 text-left text-sm hover:bg-neutral-100 ${focus}`}>Remove</button>
                </div>
              </details>
            </div>
          </div>
          <p className="mt-3 text-base font-medium [overflow-wrap:anywhere]">{method.type === "card" ? `•••• ${method.last4}` : method.upiId}</p>
          {method.type === "card" && <p className="mt-1 text-xs text-neutral-500">Expires {method.expiry}</p>}
        </li>)}</ul> : <div className="py-10 text-center"><p className="text-sm font-semibold">No saved payment methods yet.</p><p className="mt-3 text-sm leading-6 text-neutral-500">You can add or save a payment method during checkout once payments are enabled.</p></div>}
      </section>
      <button type="button" onClick={() => information.current?.showModal()} className={`mt-6 w-full ${secondary}`}>+ Add Payment Method</button>
      <p role="status" className="mt-4 text-center text-sm leading-6 text-neutral-600">{notice}</p>
    </div>
    <dialog ref={confirmation} onClose={() => setRemoving(null)} aria-labelledby="remove-title" aria-describedby="remove-description" className="fixed inset-0 m-auto max-h-[85dvh] w-[calc(100%-3rem)] max-w-sm overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-950 shadow-xl backdrop:bg-black/30">
      <h2 id="remove-title" className="text-lg font-semibold">Remove payment method?</h2>
      {removing && <p className="mt-2 text-sm font-medium [overflow-wrap:anywhere]">{methodLabel(removing)}</p>}
      <p id="remove-description" className="mt-3 text-sm leading-6 text-neutral-500">This payment method will be removed from your saved methods.</p>
      <div className="mt-6 flex gap-3"><button type="button" onClick={() => confirmation.current?.close()} className={`flex-1 ${secondary}`}>Cancel</button><button type="button" onClick={remove} className={`min-h-12 flex-1 rounded-full bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-800 ${focus}`}>Remove</button></div>
    </dialog>
    <dialog ref={information} aria-labelledby="add-title" aria-describedby="add-description" className="fixed inset-0 m-auto max-h-[85dvh] w-[calc(100%-3rem)] max-w-sm overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-950 shadow-xl backdrop:bg-black/30">
      <h2 id="add-title" className="text-lg font-semibold">Add Payment Method</h2>
      <p id="add-description" className="mt-3 text-sm leading-6 text-neutral-500">Payment methods will be securely added through our payment provider during checkout.</p>
      <form method="dialog"><button className={`mt-6 w-full ${secondary}`}>GOT IT</button></form>
    </dialog>
  </main>;
}
