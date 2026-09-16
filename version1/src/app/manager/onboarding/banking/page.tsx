"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type Details = {
  accountHolderName: string;
  ifscCode: string;
  accountNumber: string;
  confirmAccountNumber: string;
  upiId: string;
};
type Field = keyof Details;
const emptyDetails: Details = { accountHolderName: "", ifscCode: "", accountNumber: "", confirmAccountNumber: "", upiId: "" };
const fields: { key: Field; label: string; placeholder: string; numeric?: boolean; optional?: boolean }[] = [
  { key: "accountHolderName", label: "ACCOUNT HOLDER NAME", placeholder: "John Doe" },
  { key: "ifscCode", label: "IFSC CODE", placeholder: "HDFC0001234" },
  { key: "accountNumber", label: "BANK ACCOUNT NUMBER", placeholder: "Enter account number", numeric: true },
  { key: "confirmAccountNumber", label: "CONFIRM ACCOUNT NUMBER", placeholder: "Re-enter account number", numeric: true },
  { key: "upiId", label: "UPI ID", placeholder: "username@upi", optional: true },
];

function validate(details: Details): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {};
  if (!details.accountHolderName.trim()) errors.accountHolderName = "Enter the account holder name.";
  // Format checks only; these do not establish that an IFSC, account, or UPI ID exists.
  if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(details.ifscCode.trim())) errors.ifscCode = "Enter a valid IFSC code.";
  const account = details.accountNumber.trim();
  const confirmation = details.confirmAccountNumber.trim();
  if (!account) errors.accountNumber = "Enter the bank account number.";
  else if (!/^\d+$/.test(account)) errors.accountNumber = "Use digits only for the account number.";
  if (!confirmation) errors.confirmAccountNumber = "Confirm the account number.";
  else if (account !== confirmation) errors.confirmAccountNumber = "Account numbers do not match.";
  if (details.upiId.trim() && !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(details.upiId.trim())) errors.upiId = "Enter a valid UPI ID.";
  return errors;
}

export default function Page() {
  const router = useRouter();
  const [details, setDetails] = useState<Details>(emptyDetails);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const errors = validate(details);
  const canSave = Object.keys(errors).length === 0;

  function leavePage(destination: "/manager/onboarding/slots" | "/manager/dashboard") {
    // This preview never submits or persists banking details, including on completion.
    setDetails({ ...emptyDetails });
    setTouched({});
    router.push(destination);
  }

  function saveDetails(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSave) return;
    leavePage("/manager/dashboard");
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-white font-sans text-neutral-900">
      <header className="border-b border-neutral-200 pt-[env(safe-area-inset-top)]">
        <div className="flex h-[72px] items-center gap-2 px-4">
          <button type="button" aria-label="Back to Set Time Slots" onClick={() => leavePage("/manager/onboarding/slots")} className="flex size-10 shrink-0 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m14 6-6 6 6 6M8 12h12" /></svg>
          </button>
          <p className="text-lg font-semibold">Banking Details</p>
        </div>
      </header>

      <main className="flex-1 px-6 pt-6 pb-7">
        <h1 className="text-[26px] leading-8 font-bold tracking-tight">Payout Settings</h1>
        <p className="mt-2 text-sm leading-[23px] text-neutral-500">Enter your bank details to receive payments for your venue bookings.</p>

        <form id="banking-details" noValidate autoComplete="off" onSubmit={saveDetails} aria-describedby="payout-preview-note" className="mt-8 space-y-5">
          {fields.map(({ key, label, placeholder, numeric, optional }) => {
            const error = touched[key] ? errors[key] : undefined;
            return (
              <div key={key}>
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor={key} className="text-xs font-semibold tracking-wide text-neutral-500">{label}</label>
                  {optional && <span className="text-[10px] font-semibold tracking-wider text-neutral-500">OPTIONAL</span>}
                </div>
                <input id={key} type="text" inputMode={numeric ? "numeric" : "text"} autoComplete="off" autoCapitalize={key === "accountHolderName" ? "words" : key === "ifscCode" ? "characters" : "none"} spellCheck={false} required={!optional} value={details[key]} placeholder={placeholder} aria-invalid={Boolean(error)} aria-describedby={error ? `${key}-error` : undefined} onChange={(event) => {
                  const value = key === "ifscCode" ? event.target.value.toUpperCase() : event.target.value;
                  setDetails((current) => ({ ...current, [key]: value }));
                }} onBlur={() => setTouched((current) => ({ ...current, [key]: true }))} className="mt-2 min-h-14 w-full min-w-0 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-base text-neutral-900 placeholder:text-sm placeholder:text-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900" />
                {error && <p id={`${key}-error`} role="status" className="mt-2 text-xs leading-5 text-neutral-600">{error}</p>}
              </div>
            );
          })}
        </form>

        <aside aria-labelledby="secure-details-title" className="mt-8 flex items-start gap-3 rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
          <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-white text-neutral-500">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2" /></svg>
          </span>
          <div className="min-w-0">
            <h2 id="secure-details-title" className="text-xs font-semibold tracking-wide">SECURE PAYOUT DETAILS</h2>
            <p className="mt-1 text-xs leading-[18px] text-neutral-500">Your payout details will be securely processed for venue payouts.</p>
            <p id="payout-preview-note" className="mt-2 text-xs leading-[18px] text-neutral-600">UI prototype only: details are not saved or sent, and payouts are not enabled.</p>
          </div>
        </aside>
      </main>

      <footer className="sticky bottom-0 border-t border-neutral-100 bg-white px-6 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <button type="submit" form="banking-details" disabled={!canSave} className="flex min-h-[60px] w-full items-center justify-center rounded-2xl bg-neutral-900 px-4 py-4 text-lg font-semibold text-white shadow-sm hover:bg-neutral-800 active:bg-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500 disabled:shadow-none motion-safe:transition-colors">Save Details</button>
      </footer>
    </div>
  );
}
