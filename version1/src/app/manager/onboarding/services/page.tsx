"use client";

import { useRef, useState, type FormEvent } from "react";
import { useSetupEdit } from "@/components/manager/use-setup-edit";
import { useRouter } from "next/navigation";
import { ManagerDialog } from "@/components/manager/manager-dialog";
import { services, customSportIcon, useManagerOnboarding } from "@/components/manager/manager-onboarding-provider";

export default function Page() {
  const router = useRouter();
  const { settingsEdit, destination } = useSetupEdit();
  const { selectedSports, customSports, toggleSport, addCustomSport, playingAreas, schedulesByResource, mockBookings } = useManagerOnboarding();
  const [removing, setRemoving] = useState<{ id: string; label: string } | null>(null);
  const selectedIds = selectedSports.map((sport) => sport.id);
  const [sportName, setSportName] = useState("");
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const allServices = [...services, ...customSports.map((sport) => ({ ...sport, icon: customSportIcon }))];

  function addSport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const label = sportName.trim().replace(/\s+/g, " ");
    if (!label) return;
    if (allServices.some((sport) => sport.label.toLowerCase() === label.toLowerCase())) {
      setError("This sport is already listed. Choose it from the grid.");
      inputRef.current?.focus();
      return;
    }
    const id = `custom-${crypto.randomUUID()}`;
    addCustomSport({ id, label });
    dialogRef.current?.close();
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-white font-sans text-neutral-900">
      <header className="border-b border-neutral-200 pt-[env(safe-area-inset-top)]">
        <div className="flex h-[72px] items-center gap-2 px-4">
          <button
            type="button"
            aria-label="Go back"
            onClick={() => { if (settingsEdit) router.push("/manager/settings"); else if (window.history.length > 1) router.back(); }}
            className="flex size-10 shrink-0 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m14 6-6 6 6 6M8 12h12" />
            </svg>
          </button>
          <p className="text-lg font-semibold">Select Services</p>
        </div>
      </header>

      <main className="flex-1 px-6 pt-6 pb-3">
        <h1 className="text-[26px] leading-8 font-bold tracking-tight">What do you offer?</h1>
        <p id="services-description" className="mt-2 max-w-sm text-sm leading-[21px] text-neutral-500">
          Select all the sports and services available at your venue. You can add more later.
        </p>

        <div role="group" aria-label="Sports and services" aria-describedby="services-description" className="mt-8 grid grid-cols-2 gap-4">
          {allServices.map((service) => {
            const selected = selectedIds.includes(service.id);
            return (
              <button
                key={service.id}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  const sport = { id: service.id, label: service.label };
                  const dependentAreas = playingAreas.filter((area) => area.sportId === sport.id);
                  if (selected && (dependentAreas.length || dependentAreas.some((area) => schedulesByResource[area.id]) || mockBookings.some((booking) => booking.sportId === sport.id))) setRemoving(sport);
                  else toggleSport(sport);
                }}
                className={`relative flex h-[120px] min-w-0 flex-col items-center justify-center gap-3 rounded-2xl border px-2 text-sm font-semibold motion-safe:transition-[background-color,border-color,box-shadow] motion-safe:duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 ${selected
                  ? "border-neutral-900 bg-neutral-900 text-white shadow-md"
                  : "border-neutral-200 bg-white text-neutral-600 shadow-sm hover:border-neutral-400"}`}
              >
                {selected && (
                  <span className="absolute top-3.5 right-3.5 flex size-5 items-center justify-center rounded-full bg-white text-neutral-900">
                    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 10 3 3 7-7" /></svg>
                  </span>
                )}
                <svg aria-hidden="true" viewBox="0 0 32 32" className="size-8 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {service.icon}
                </svg>
                <span className={service.id.startsWith("custom-") ? "line-clamp-2 w-full [overflow-wrap:anywhere]" : undefined}>{service.label}</span>
              </button>
            );
          })}
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => {
              setSportName("");
              setError("");
              dialogRef.current?.showModal();
              inputRef.current?.focus();
            }}
            className="flex h-[120px] min-w-0 flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-200 bg-white px-2 text-sm font-semibold text-neutral-600 shadow-sm hover:border-neutral-400 active:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 motion-safe:transition-colors"
          >
            <svg aria-hidden="true" viewBox="0 0 32 32" className="size-8 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="16" cy="16" r="12" /><path d="M16 10v12M10 16h12" />
            </svg>
            <span>Add Sport</span>
          </button>
        </div>
      </main>

      <footer className="sticky bottom-0 border-t border-neutral-100 bg-white px-6 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          disabled={selectedIds.length === 0}
          onClick={() => { if (selectedIds.length > 0) router.push(destination("/manager/onboarding/courts")); }}
          className="flex min-h-[60px] w-full items-center justify-center rounded-2xl bg-neutral-900 px-4 py-4 text-lg font-semibold text-white shadow-sm hover:bg-neutral-800 active:bg-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500 disabled:shadow-none motion-safe:transition-colors"
        >
          {settingsEdit ? "Save Changes" : "Save & Continue"}
        </button>
      </footer>

      {removing && <ManagerDialog title={`Remove ${removing.label}?`} onDismiss={() => setRemoving(null)}>
        <p className="mt-4 text-sm leading-6 text-neutral-600">{removing.label} has {playingAreas.filter((area) => area.sportId === removing.id).length} playing areas configured. Removing it deletes those playing areas and their schedules. Existing bookings remain in booking history. Adding this sport again creates new playing areas.</p>
        <div className="mt-6 grid grid-cols-2 gap-3"><button type="button" onClick={() => setRemoving(null)} className="min-h-12 rounded-xl border border-neutral-200 focus-visible:outline-2">Cancel</button><button type="button" onClick={() => { toggleSport(removing); setRemoving(null); }} className="min-h-12 rounded-xl bg-neutral-900 text-white focus-visible:outline-2">Remove</button></div>
      </ManagerDialog>}
      <dialog
        ref={dialogRef}
        aria-labelledby="add-sport-title"
        aria-describedby="add-sport-description"
        className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-sm overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-900 shadow-xl backdrop:bg-black/40"
      >
        <form onSubmit={addSport}>
          <h2 id="add-sport-title" className="text-xl font-semibold">Add a Sport</h2>
          <p id="add-sport-description" className="mt-2 text-sm leading-5 text-neutral-500">Add a sport or activity available at your venue.</p>
          <label htmlFor="sport-name" className="mt-6 block text-sm font-medium">Sport name</label>
          <input
            ref={inputRef}
            id="sport-name"
            name="sportName"
            value={sportName}
            onChange={(event) => { setSportName(event.target.value); setError(""); }}
            placeholder="e.g. Pickleball"
            required
            maxLength={60}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "sport-name-error" : undefined}
            className="mt-2 min-h-12 w-full min-w-0 rounded-xl border border-neutral-300 px-3 text-base placeholder:text-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
          />
          {error && <p id="sport-name-error" role="alert" className="mt-2 text-sm text-neutral-600">{error}</p>}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button type="button" onClick={() => dialogRef.current?.close()} className="min-h-12 rounded-xl border border-neutral-300 px-3 text-sm font-semibold hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900">Cancel</button>
            <button type="submit" disabled={!sportName.trim()} className="min-h-12 rounded-xl bg-neutral-900 px-3 text-sm font-semibold text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900">Add Sport</button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
