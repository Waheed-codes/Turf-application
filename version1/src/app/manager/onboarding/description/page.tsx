"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const MIN_DESCRIPTION_LENGTH = 20;
const MAX_DESCRIPTION_LENGTH = 500;

export default function Page() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const canContinue = description.trim().length >= MIN_DESCRIPTION_LENGTH;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-white font-sans text-neutral-900">
      <header className="border-b border-neutral-200 pt-[env(safe-area-inset-top)]">
        <div className="flex h-[72px] items-center gap-2 px-4">
          <button type="button" aria-label="Back to Venue Photos" onClick={() => router.push("/manager/onboarding/photos")} className="flex size-10 shrink-0 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m14 6-6 6 6 6M8 12h12" /></svg>
          </button>
          <p className="text-lg font-semibold">Venue Description</p>
        </div>
      </header>

      <main className="flex-1 px-6 pt-6 pb-6">
        <h1 className="text-[26px] leading-8 font-bold tracking-tight">Tell your story</h1>
        <p id="description-intro" className="mt-2 max-w-sm text-sm leading-[21px] text-neutral-500">Provide details about your facilities, dimensions, and unique features to attract more players.</p>

        <label htmlFor="venue-description" className="mt-8 block text-sm font-semibold text-neutral-700">About the Venue</label>
        <div className="relative mt-2">
          <textarea
            id="venue-description"
            name="description"
            value={description}
            onChange={(event) => setDescription(event.target.value.slice(0, MAX_DESCRIPTION_LENGTH))}
            maxLength={MAX_DESCRIPTION_LENGTH}
            placeholder="Describe your turf (dimensions, surface type, capacity, etc.)"
            aria-describedby="description-intro description-requirement description-counter"
            className="block h-[300px] w-full min-w-0 resize-none rounded-3xl border border-neutral-200 bg-neutral-50 p-5 pb-12 text-base leading-7 text-neutral-900 placeholder:text-neutral-400 focus-visible:border-neutral-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
          />
          <span id="description-counter" className="pointer-events-none absolute right-5 bottom-3 text-xs tabular-nums text-neutral-500">{description.length} / {MAX_DESCRIPTION_LENGTH}</span>
        </div>
        <p id="description-requirement" className="sr-only">Enter at least 20 characters excluding leading and trailing spaces, up to 500 characters.</p>

        <aside aria-labelledby="pro-tip-title" className="mt-8 flex items-start gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 shrink-0 text-neutral-600" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18h6m-5 3h4M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 2H9s0-1-1-2Z" />
          </svg>
          <div className="min-w-0">
            <h2 id="pro-tip-title" className="text-xs font-semibold">PRO TIP</h2>
            <p className="mt-1 text-xs leading-5 text-neutral-600">Mention if you have changing rooms, water facilities, or floodlights for night games!</p>
          </div>
        </aside>
      </main>

      <footer className="sticky bottom-0 border-t border-neutral-100 bg-white px-6 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <button type="button" disabled={!canContinue} onClick={() => { if (canContinue) router.push("/manager/onboarding/amenities"); }} className="flex min-h-[60px] w-full items-center justify-center rounded-2xl bg-neutral-900 px-4 py-4 text-lg font-semibold text-white shadow-sm hover:bg-neutral-800 active:bg-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500 disabled:shadow-none motion-safe:transition-colors">
          Save &amp; Continue
        </button>
      </footer>
    </div>
  );
}
