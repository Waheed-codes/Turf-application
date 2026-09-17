"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { useSetupEdit } from "@/components/manager/use-setup-edit";
import { useManagerOnboarding } from "@/components/manager/manager-onboarding-provider";
import { useRouter } from "next/navigation";

type Amenity = { id: string; label: string; icon: ReactNode };

const amenities: Amenity[] = [
  { id: "washroom", label: "Washroom", icon: <><circle cx="7" cy="4" r="2" /><circle cx="17" cy="4" r="2" /><path d="M3 13V9h8v4M5 9v12m4-12v12m8-13-4 8h8l-4-8Zm-2 8v5m4-5v5" /></> },
  { id: "water", label: "Water", icon: <><path d="M3 10h11a5 5 0 0 1 5 5v1h-5v-1H3v-5Zm5 0V5m-3 0h6m6 14c-2 2-2 3 0 3s2-1 0-3Z" /></> },
  { id: "parking", label: "Parking", icon: <><rect x="3" y="3" width="18" height="18" rx="4" /><path d="M9 17V7h4a3 3 0 0 1 0 6H9" /></> },
  { id: "changing-room", label: "Changing Room", icon: <path d="m8 3-6 4 3 5 3-2v11h8V10l3 2 3-5-6-4a4 4 0 0 1-8 0Z" /> },
  { id: "first-aid", label: "First Aid", icon: <><rect x="2" y="6" width="20" height="15" rx="2" /><path d="M8 6V3h8v3m-4 5v6m-3-3h6" /></> },
  { id: "floodlights", label: "Floodlights", icon: <><path d="m6 3 12 3-2 8-12-3 2-8Zm4 10v8m-3 0h6M8 5l-1 5m5-4-1 5m9-2 2 1m-4 5 2 2" /></> },
  { id: "seating-area", label: "Seating Area", icon: <><path d="M5 12V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v5M3 12h3v4h12v-4h3v7H3v-7Zm2 7v2m14-2v2" /></> },
  { id: "cafeteria", label: "Cafeteria", icon: <><path d="M4 3v6a3 3 0 0 0 6 0V3M7 3v18m13 0V3c-5 2-5 10 0 10" /></> },
];

export default function Page() {
  const router = useRouter();
  const { settingsEdit, destination } = useSetupEdit();
  const { selectedAmenityIds: selectedIds, setSelectedAmenityIds: setSelectedIds, customAmenities, setCustomAmenities } = useManagerOnboarding();
  const [amenityName, setAmenityName] = useState("");
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const allAmenities = [...amenities, ...customAmenities];

  function addAmenity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const label = amenityName.trim().replace(/\s+/g, " ");
    if (!label) return;
    if (allAmenities.some((amenity) => amenity.label.toLowerCase() === label.toLowerCase())) {
      setError("This amenity already exists.");
      inputRef.current?.focus();
      return;
    }
    const id = `custom-${crypto.randomUUID()}`;
    setCustomAmenities((current) => [...current, {
      id,
      label,
      icon: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M9 21v-5h6v5M8 7h1m6 0h1M8 11h1m6 0h1" /></>,
    }]);
    setSelectedIds((current) => [...current, id]);
    dialogRef.current?.close();
  }

  function toggleAmenity(id: string) {
    setSelectedIds((current) => current.includes(id)
      ? current.filter((selectedId) => selectedId !== id)
      : [...current, id]);
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-white font-sans text-neutral-900">
      <header className="border-b border-neutral-200 pt-[env(safe-area-inset-top)]">
        <div className="flex h-[72px] items-center gap-2 px-4">
          <button
            type="button"
            aria-label={settingsEdit ? "Back to Settings" : "Go back"}
            onClick={() => router.push(destination("/manager/onboarding/description"))}
            className="flex size-10 shrink-0 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m14 6-6 6 6 6M8 12h12" />
            </svg>
          </button>
          <p className="text-lg font-semibold">Amenities</p>
        </div>
      </header>

      <main className="flex-1 px-6 pt-6 pb-6">
        <h1 className="text-[26px] leading-8 font-bold tracking-tight">Venue Amenities</h1>
        <p id="amenities-description" className="mt-2 max-w-sm text-sm leading-[21px] text-neutral-500">
          Select the facilities available for players at your venue.
        </p>

        <div role="group" aria-label="Venue amenities" aria-describedby="amenities-description" className="mt-8 grid grid-cols-2 gap-3">
          {allAmenities.map((amenity) => {
            const selected = selectedIds.includes(amenity.id);
            return (
              <button
                key={amenity.id}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleAmenity(amenity.id)}
                className={`relative flex h-[72px] min-w-0 items-center justify-center gap-2 rounded-2xl border px-3 text-sm font-semibold motion-safe:transition-[background-color,border-color,box-shadow] motion-safe:duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 ${selected
                  ? "border-neutral-900 bg-neutral-900 text-white shadow-sm"
                  : "border-neutral-200 bg-white text-neutral-600 shadow-sm hover:border-neutral-400"}`}
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {amenity.icon}
                </svg>
                <span className="min-w-0 line-clamp-2 [overflow-wrap:anywhere]">{amenity.label}</span>
              </button>
            );
          })}
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => {
              setAmenityName("");
              setError("");
              dialogRef.current?.showModal();
              inputRef.current?.focus();
            }}
            className="flex h-[72px] min-w-0 items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-600 shadow-sm hover:border-neutral-400 active:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 motion-safe:transition-colors"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>Add Amenity</span>
          </button>
        </div>
      </main>

      <footer className="sticky bottom-0 border-t border-neutral-100 bg-white px-6 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          disabled={selectedIds.length === 0}
          onClick={() => { if (selectedIds.length > 0) router.push(destination("/manager/onboarding/slots")); }}
          className="flex min-h-[60px] w-full items-center justify-center rounded-2xl bg-neutral-900 px-4 py-4 text-lg font-semibold text-white shadow-sm hover:bg-neutral-800 active:bg-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500 disabled:shadow-none motion-safe:transition-colors"
        >
          {settingsEdit ? "Save Changes" : "Save & Continue"}
        </button>
      </footer>

      <dialog
        ref={dialogRef}
        aria-labelledby="add-amenity-title"
        aria-describedby="add-amenity-description"
        className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-sm overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-900 shadow-xl backdrop:bg-black/40"
      >
        <form onSubmit={addAmenity}>
          <h2 id="add-amenity-title" className="text-xl font-semibold">Add an Amenity</h2>
          <p id="add-amenity-description" className="mt-2 text-sm leading-5 text-neutral-500">Add another facility available at your venue.</p>
          <label htmlFor="amenity-name" className="mt-6 block text-sm font-medium">Amenity name</label>
          <input
            ref={inputRef}
            id="amenity-name"
            name="amenityName"
            value={amenityName}
            onChange={(event) => { setAmenityName(event.target.value); setError(""); }}
            placeholder="e.g. Lockers"
            required
            maxLength={60}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "amenity-name-error" : undefined}
            className="mt-2 min-h-12 w-full min-w-0 rounded-xl border border-neutral-300 px-3 text-base placeholder:text-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
          />
          {error && <p id="amenity-name-error" role="alert" className="mt-2 text-sm text-neutral-600">{error}</p>}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button type="button" onClick={() => dialogRef.current?.close()} className="min-h-12 rounded-xl border border-neutral-300 px-3 text-sm font-semibold hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900">Cancel</button>
            <button type="submit" disabled={!amenityName.trim()} className="min-h-12 rounded-xl bg-neutral-900 px-3 text-sm font-semibold text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900">Add Amenity</button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
