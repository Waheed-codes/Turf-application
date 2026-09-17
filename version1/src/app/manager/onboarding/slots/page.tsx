"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSetupEdit } from "@/components/manager/use-setup-edit";
import { useRouter, useSearchParams } from "next/navigation";
import { DAY_MINUTES, durations, useManagerOnboarding, type PlayingArea } from "@/components/manager/manager-onboarding-provider";

function formatTime(minutes: number): string {
  const time = minutes % DAY_MINUTES;
  const hour = Math.floor(time / 60);
  return `${String(hour % 12 || 12).padStart(2, "0")}:${String(time % 60).padStart(2, "0")} ${hour < 12 ? "AM" : "PM"}`;
}

function Clock() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
}

function TimePicker({ id, label, value, onChange }: { id: string; label: string; value: number; onChange: (value: number) => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [draftMinutes, setDraftMinutes] = useState(0);
  const hour24 = Math.floor(draftMinutes / 60);
  const hour12 = hour24 % 12 || 12;
  const minute = draftMinutes % 60;
  const isPm = hour24 >= 12;
  const optionClass = (selected: boolean) => `min-h-11 rounded-xl border px-3 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 ${selected ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100"}`;

  return (
    <>
      <button id={id} type="button" aria-label={`${label}: ${formatTime(value % DAY_MINUTES)}`} aria-haspopup="dialog" aria-controls={`${id}-dialog`} aria-describedby="operating-hours-note" onClick={() => {
        setDraftMinutes(value % DAY_MINUTES);
        dialogRef.current?.showModal();
      }} className="mt-2 flex min-h-14 w-full min-w-0 max-w-full items-center justify-between gap-1 rounded-2xl border border-neutral-200 bg-neutral-50 px-2 py-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900">
        <span>{formatTime(value % DAY_MINUTES)}</span>
        <Clock />
      </button>
      <dialog ref={dialogRef} id={`${id}-dialog`} aria-labelledby={`${id}-title`} className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-sm overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-5 text-neutral-900 shadow-xl backdrop:bg-black/40">
        <form onSubmit={(event) => {
          event.preventDefault();
          onChange(draftMinutes);
          dialogRef.current?.close();
        }}>
          <h2 id={`${id}-title`} className="text-lg font-semibold">{label}</h2>
          <p className="mt-2 text-2xl font-semibold tabular-nums" aria-live="polite">{formatTime(draftMinutes)}</p>
          <fieldset className="mt-5 min-w-0">
            <legend className="text-xs font-semibold tracking-wide text-neutral-500">HOUR</legend>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {Array.from({ length: 12 }, (_, index) => index + 1).map((hour) => <button key={hour} type="button" aria-pressed={hour12 === hour} onClick={() => setDraftMinutes((hour % 12 + (isPm ? 12 : 0)) * 60 + minute)} className={optionClass(hour12 === hour)}>{String(hour).padStart(2, "0")}</button>)}
            </div>
          </fieldset>
          <fieldset className="mt-4 min-w-0">
            <legend className="text-xs font-semibold tracking-wide text-neutral-500">MINUTE</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {[0, 30].map((minutes) => <button key={minutes} type="button" aria-pressed={minute === minutes} onClick={() => setDraftMinutes(hour24 * 60 + minutes)} className={optionClass(minute === minutes)}>{String(minutes).padStart(2, "0")}</button>)}
            </div>
          </fieldset>
          <fieldset className="mt-4 min-w-0">
            <legend className="text-xs font-semibold tracking-wide text-neutral-500">AM / PM</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {["AM", "PM"].map((period) => <button key={period} type="button" aria-pressed={isPm === (period === "PM")} onClick={() => setDraftMinutes((hour12 % 12 + (period === "PM" ? 12 : 0)) * 60 + minute)} className={optionClass(isPm === (period === "PM"))}>{period}</button>)}
            </div>
          </fieldset>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button type="button" onClick={() => dialogRef.current?.close()} className="min-h-12 rounded-xl border border-neutral-300 px-3 text-sm font-semibold hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900">Cancel</button>
            <button type="submit" className="min-h-12 rounded-xl bg-neutral-900 px-3 text-sm font-semibold text-white hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900">Done</button>
          </div>
        </form>
      </dialog>
    </>
  );
}

export default function Page() {
  return <Suspense fallback={<p className="p-6">Loading time slots…</p>}><SlotsPage /></Suspense>;
}

function SlotsPage() {
  const router = useRouter();
  const { settingsEdit, destination } = useSetupEdit();
  const { playingAreas } = useManagerOnboarding();
  if (playingAreas.length === 0) return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-white font-sans text-neutral-900">
      <header className="border-b border-neutral-200 pt-[env(safe-area-inset-top)]">
        <div className="flex h-[72px] items-center gap-2 px-4">
          <button type="button" aria-label={settingsEdit ? "Back to Settings" : "Back to Amenities"} onClick={() => router.push(destination("/manager/onboarding/amenities"))} className="flex size-10 shrink-0 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m14 6-6 6 6 6M8 12h12" /></svg>
          </button>
          <p className="text-lg font-semibold">Set Time Slots</p>
        </div>
      </header>
      <main className="space-y-4 px-6 py-6">
        <h1 className="text-xl font-semibold">No playing areas configured.</h1>
        <button type="button" onClick={() => router.push(settingsEdit ? "/manager/onboarding/courts?mode=edit&from=settings" : "/manager/onboarding/courts")} className="min-h-12 rounded-2xl bg-neutral-900 px-5 py-3 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900">Set Up Playing Areas</button>
      </main>
    </div>
  );
  return <ScheduleEditor resources={playingAreas} />;
}

function ScheduleEditor({ resources }: { resources: PlayingArea[] }) {
  const router = useRouter();
  const { settingsEdit, destination } = useSetupEdit();
  const searchParams = useSearchParams();
  const editMode = searchParams.get("mode") === "edit";
  const initialResource = resources.find((resource) => resource.id === searchParams.get("resourceId")) ?? resources[0];
  const { schedulesByResource, updateConfiguration, toggleSlot, setDashboardSelection } = useManagerOnboarding();
  const [requestedResourceId, setSelectedResourceId] = useState(initialResource.id);
  const selectedChipRef = useRef<HTMLButtonElement>(null);
  const selectedIndex = Math.max(0, resources.findIndex((resource) => resource.id === requestedResourceId));
  const selectedResource = resources[selectedIndex];
  const selectedResourceId = selectedResource.id;
  const schedule = schedulesByResource[selectedResourceId];
  const availableCount = schedule.slots.filter((slot) => slot.enabled).length;
  const overnight = schedule.closingMinutes === DAY_MINUTES || schedule.closingMinutes < schedule.openingMinutes;
  const isFinalResource = selectedIndex === resources.length - 1;

  useEffect(() => {
    selectedChipRef.current?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [selectedResourceId]);

  function saveAndContinue() {
    if (availableCount === 0) return;
    if (editMode) {
      setDashboardSelection((current) => ({ ...current, sportId: selectedResource.sportId, resourceId: selectedResourceId }));
      router.push(destination("/manager/dashboard"));
      return;
    }
    if (isFinalResource) router.push("/manager/onboarding/banking");
    else setSelectedResourceId(resources[selectedIndex + 1].id);
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-white font-sans text-neutral-900">
      <header className="border-b border-neutral-200 pt-[env(safe-area-inset-top)]">
        <div className="flex h-[72px] items-center gap-2 px-4">
          <button type="button" aria-label={settingsEdit ? "Back to Settings" : editMode ? "Back to Dashboard" : "Back to Amenities"} onClick={() => router.push(destination(editMode ? "/manager/dashboard" : "/manager/onboarding/amenities"))} className="flex size-10 shrink-0 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m14 6-6 6 6 6M8 12h12" /></svg>
          </button>
          <p className="text-lg font-semibold">Set Time Slots</p>
        </div>
      </header>

      <main className="flex-1 px-6 pt-6 pb-6">
        <div role="group" aria-label="Playing areas" className="flex gap-2 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {resources.map((resource) => {
            const selected = resource.id === selectedResourceId;
            return (
              <button key={resource.id} ref={selected ? selectedChipRef : null} type="button" aria-pressed={selected} aria-label={`${resource.sportLabel} • ${resource.name}`} onClick={() => setSelectedResourceId(resource.id)} className={`min-h-12 shrink-0 rounded-full border px-5 py-2 text-center focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-neutral-500 ${selected ? "border-neutral-950 bg-neutral-950 text-white" : "border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50"}`}>
                <span className="block max-w-40 truncate text-[10px] leading-4" title={resource.sportLabel}>{resource.sportLabel}</span>
                <span className="block max-w-40 truncate text-sm font-semibold" title={resource.name}>{resource.name}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-3 flex items-start gap-1.5 text-xs leading-[18px] text-neutral-500">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-0.5 size-3 shrink-0" fill="currentColor"><circle cx="12" cy="12" r="10" /><path d="M12 11v6m0-10v1" fill="none" stroke="white" strokeWidth="2" /></svg>
          <span className="min-w-0 [overflow-wrap:anywhere]">Set hours for {selectedResource.sportLabel} • {selectedResource.name}. You can customize each playing area separately.</span>
        </p>
        <h1 className="mt-8 text-[26px] leading-8 font-bold tracking-tight">Operating Hours</h1>
        <p className="mt-2 max-w-sm text-sm leading-[21px] text-neutral-500">Define when this playing area is open for bookings and set the duration for each session.</p>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="min-w-0">
            <label htmlFor="opening-time" className="block text-xs font-semibold tracking-wide text-neutral-500">OPENING TIME</label>
            <TimePicker id="opening-time" label="Opening time" value={schedule.openingMinutes} onChange={(openingMinutes) => updateConfiguration(selectedResourceId, { openingMinutes })} />
          </div>
          <div className="min-w-0">
            <label htmlFor="closing-time" className="block text-xs font-semibold tracking-wide text-neutral-500">CLOSING TIME</label>
            <TimePicker id="closing-time" label="Closing time" value={schedule.closingMinutes} onChange={(closingMinutes) => updateConfiguration(selectedResourceId, { closingMinutes: closingMinutes === 0 ? DAY_MINUTES : closingMinutes })} />
          </div>
        </div>
        <p id="operating-hours-note" className={overnight ? "mt-6 text-xs italic text-neutral-500" : "sr-only"}>{overnight ? "Closing time is on the following day." : "Choose different opening and closing times."}</p>

        <label htmlFor="slot-duration" className="mt-10 block text-xs font-semibold tracking-wide text-neutral-500">SLOT DURATION</label>
        <div className="relative mt-2">
          <select id="slot-duration" value={schedule.durationMinutes} onChange={(event) => updateConfiguration(selectedResourceId, { durationMinutes: Number(event.target.value) })} className="min-h-14 w-full min-w-0 appearance-none rounded-2xl border border-neutral-200 bg-neutral-50 py-3 pr-10 pl-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900">
            {durations.map((duration) => <option key={duration.minutes} value={duration.minutes}>{duration.label}</option>)}
          </select>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute top-5 right-4 size-4 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
        </div>

        <section aria-labelledby="generated-slots-title" className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="generated-slots-title" className="text-sm font-semibold">GENERATED SLOTS</h2>
            <p role="status" className="text-xs text-neutral-500">{availableCount} {availableCount === 1 ? "Slot" : "Slots"} Available</p>
          </div>
          {schedule.slots.length === 0 && <p role="status" className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm leading-6 text-neutral-600">Operating hours must allow at least one complete slot.</p>}
          {schedule.slots.length > 0 && availableCount === 0 && <p role="status" className="mt-4 text-sm text-neutral-600">Enable at least one slot to continue.</p>}
          <div className="mt-4 space-y-3">
            {schedule.slots.map((slot) => {
              const range = `${formatTime(slot.startMinutes)} – ${formatTime(slot.endMinutes)}`;
              const nextDay = slot.endMinutes >= DAY_MINUTES;
              return (
                <div key={slot.id} className={`flex min-h-[58px] items-center gap-2 rounded-2xl border px-3 py-1.5 shadow-sm ${slot.enabled ? "border-neutral-200 bg-white text-neutral-800" : "border-neutral-100 bg-neutral-50 text-neutral-400"}`}>
                  <span className={`flex size-5 shrink-0 items-center justify-center ${slot.enabled ? "bg-neutral-50 text-neutral-500" : "bg-white text-neutral-400"}`}><Clock /></span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-semibold min-[375px]:text-sm ${slot.enabled ? "" : "line-through"}`}>{range}</p>
                    {nextDay && <p className="mt-0.5 text-[10px] text-neutral-500">{slot.startMinutes >= DAY_MINUTES ? "Next day" : "Ends next day"}</p>}
                  </div>
                  <button type="button" role="switch" aria-checked={slot.enabled} aria-label={`Enable ${formatTime(slot.startMinutes)} to ${formatTime(slot.endMinutes)}${nextDay ? (slot.startMinutes >= DAY_MINUTES ? ", next day" : ", ends next day") : ""}`} onClick={() => toggleSlot(selectedResourceId, slot.id)} className="flex size-11 shrink-0 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900">
                    <span aria-hidden="true" className={`flex h-6 w-11 items-center rounded-full p-0.5 motion-safe:transition-colors ${slot.enabled ? "bg-neutral-900" : "bg-neutral-200"}`}><span className={`size-5 rounded-full bg-white shadow-sm motion-safe:transition-transform ${slot.enabled ? "translate-x-5" : "translate-x-0"}`} /></span>
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="sticky bottom-0 border-t border-neutral-100 bg-white px-6 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <button type="button" disabled={availableCount === 0} onClick={saveAndContinue} className="flex min-h-[60px] w-full items-center justify-center rounded-2xl bg-neutral-900 px-4 py-4 text-lg font-semibold text-white shadow-sm hover:bg-neutral-800 active:bg-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500 disabled:shadow-none motion-safe:transition-colors">
          {editMode ? "Save Changes" : isFinalResource ? "Save & Continue" : "Save & Next Court"}
        </button>
      </footer>
    </div>
  );
}
