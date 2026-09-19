"use client";

import { useSetupEdit } from "@/components/manager/use-setup-edit";
import { formatVenueDimensions, useManagerOnboarding } from "@/components/manager/manager-onboarding-provider";
import { useRouter } from "next/navigation";

const MIN_DESCRIPTION_LENGTH = 20;
const MAX_DESCRIPTION_LENGTH = 500;

export default function Page() {
  const router = useRouter();
  const { settingsEdit, destination } = useSetupEdit();
  const { description, setDescription, dimensions, setDimensions } = useManagerOnboarding();
  const positive = (value: number | null) => value != null && Number.isFinite(value) && value > 0;
  const validDimensions = positive(dimensions.length) && positive(dimensions.width) && (dimensions.height == null || positive(dimensions.height));
  const canContinue = description.trim().length >= MIN_DESCRIPTION_LENGTH && validDimensions;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-white font-sans text-neutral-900">
      <header className="border-b border-neutral-200 pt-[env(safe-area-inset-top)]">
        <div className="flex h-[72px] items-center gap-2 px-4">
          <button type="button" aria-label={settingsEdit ? "Back to Settings" : "Go back"} onClick={() => router.push(destination("/manager/onboarding/photos"))} className="flex size-10 shrink-0 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m14 6-6 6 6 6M8 12h12" /></svg>
          </button>
          <p className="text-lg font-semibold">Venue Description</p>
        </div>
      </header>

      <main className="flex-1 px-6 pt-6 pb-6">
        <h1 className="text-[26px] leading-8 font-bold tracking-tight">Tell your story</h1>
        <p id="description-intro" className="mt-2 max-w-sm text-sm leading-[21px] text-neutral-500">Provide details about your facilities, dimensions, and unique features to attract more players.</p>

        <fieldset className="mt-8 min-w-0">
          <legend className="text-sm font-semibold text-neutral-700">Dimensions</legend>
          <div className="mt-3 flex flex-wrap items-end gap-3">
            {(["length", "width", "height"] as const).map((dimension, index) => (
              <div key={dimension} className="flex min-w-0 flex-1 basis-[120px] items-end gap-3">
                {index > 0 && <span aria-hidden="true" className="flex min-h-14 items-center text-neutral-500">×</span>}
                <div className="min-w-0 flex-1">
                  <label htmlFor={`venue-${dimension}`} className="block text-xs font-medium text-neutral-500">{dimension === "length" ? "Length" : dimension === "width" ? "Width" : "Height"}</label>
                  <div className="relative mt-2">
                    <input
                      id={`venue-${dimension}`}
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="any"
                      required={dimension !== "height"}
                      value={dimensions[dimension] ?? ""}
                      placeholder={dimension === "length" ? "120" : dimension === "width" ? "70" : "20"}
                      aria-describedby="dimensions-unit"
                      onWheel={(event) => event.currentTarget.blur()}
                      onKeyDown={(event) => { if (event.key === "-") event.preventDefault(); }}
                      onChange={(event) => {
                        const value = event.target.valueAsNumber;
                        if (event.target.value === "") setDimensions((current) => ({ ...current, [dimension]: null }));
                        else if (Number.isFinite(value) && value > 0) setDimensions((current) => ({ ...current, [dimension]: value }));
                        else event.target.value = dimensions[dimension] == null ? "" : String(dimensions[dimension]);
                      }}
                      className="min-h-14 w-full min-w-0 rounded-2xl border border-neutral-200 bg-neutral-50 py-3 pr-10 pl-4 text-base text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 [-moz-appearance:textfield] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0"
                    />
                    <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-neutral-500">ft</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p id="dimensions-unit" className="mt-2 text-xs leading-5 text-neutral-500">Length and width are required. Height is optional. Enter positive values in feet.</p>
          {validDimensions && <p className="mt-2 text-xs text-neutral-500">{formatVenueDimensions(dimensions)}</p>}
        </fieldset>

        <label htmlFor="venue-description" className="mt-8 block text-sm font-semibold text-neutral-700">About the Venue</label>
        <div className="relative mt-2">
          <textarea
            id="venue-description"
            name="description"
            value={description}
            onChange={(event) => setDescription(event.target.value.slice(0, MAX_DESCRIPTION_LENGTH))}
            maxLength={MAX_DESCRIPTION_LENGTH}
            placeholder="Describe your turf (surface type, capacity, etc.)"
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
        <button type="button" disabled={!canContinue} onClick={() => { if (canContinue) router.push(destination("/manager/onboarding/amenities")); }} className="flex min-h-[60px] w-full items-center justify-center rounded-2xl bg-neutral-900 px-4 py-4 text-lg font-semibold text-white shadow-sm hover:bg-neutral-800 active:bg-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500 disabled:shadow-none motion-safe:transition-colors">
          {settingsEdit ? "Save Changes" : "Save & Continue"}
        </button>
      </footer>
    </div>
  );
}
