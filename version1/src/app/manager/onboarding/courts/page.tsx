"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { services, customSportIcon, resourceTypes, terminology, useManagerOnboarding, type PlayingArea } from "@/components/manager/manager-onboarding-provider";

const normalize = (name: string) => name.trim().replace(/\s+/g, " ");

function AreaIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m3 8 9-5 9 5-9 5-9-5Zm0 4 9 5 9-5M3 16l9 5 9-5" /></svg>;
}

export default function Page() {
  const router = useRouter();
  const { selectedSports, playingAreas: areas, setPlayingAreas: setAreas } = useManagerOnboarding();
  const sports = selectedSports.map((sport) => ({ ...sport, icon: services.find((service) => service.id === sport.id)?.icon ?? customSportIcon }));
  const [editing, setEditing] = useState<{ id: string; name: string } | null>(null);
  const [error, setError] = useState("");
  const namesValid = sports.every((sport) => {
    const resources = areas.filter((area) => area.sportId === sport.id);
    const names = resources.map((area) => normalize(area.name).toLowerCase());
    return names.length > 0 && names.every(Boolean) && new Set(names).size === names.length;
  });
  const canContinue = sports.length > 0 && namesValid && editing === null;

  function addArea(sportId: string) {
    const sport = selectedSports.find((item) => item.id === sportId);
    if (!sport) return;
    const id = `${sportId}-resource-${crypto.randomUUID()}`;
    setAreas((current) => {
      const resources = current.filter((area) => area.sportId === sportId);
      const resourceType = resourceTypes[sportId] ?? "area";
      let number = resources.length + 1;
      let name = `${terminology[resourceType].name} ${number}`;
      // A renamed resource may already use the next default label.
      while (resources.some((area) => normalize(area.name).toLowerCase() === name.toLowerCase())) {
        name = `${terminology[resourceType].name} ${++number}`;
      }
      return [...current, { id, sportId, sportLabel: sport.label, resourceType, name }];
    });
  }

  function removeLastArea(sportId: string) {
    const resources = areas.filter((area) => area.sportId === sportId);
    if (resources.length <= 1) return;
    const last = resources[resources.length - 1];
    setAreas((current) => current.filter((area) => area.id !== last.id));
    if (editing?.id === last.id) { setEditing(null); setError(""); }
  }

  function saveName(event: FormEvent<HTMLFormElement>, area: PlayingArea) {
    event.preventDefault();
    if (!editing || editing.id !== area.id) return;
    const name = normalize(editing.name);
    if (!name) { setError("Enter a name for this playing area."); return; }
    if (areas.some((other) => other.sportId === area.sportId && other.id !== area.id && normalize(other.name).toLowerCase() === name.toLowerCase())) {
      setError("This name already exists for this sport."); return;
    }
    setAreas((current) => current.map((item) => item.id === area.id ? { ...item, name } : item));
    setEditing(null);
    setError("");
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-white font-sans text-neutral-900">
      <header className="border-b border-neutral-200 pt-[env(safe-area-inset-top)]">
        <div className="flex h-[72px] items-center gap-2 px-4">
          <button type="button" aria-label="Back to Select Services" onClick={() => router.push("/manager/onboarding/services")} className="flex size-10 shrink-0 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m14 6-6 6 6 6M8 12h12" /></svg>
          </button>
          <p className="text-lg font-semibold">Name Your Courts</p>
        </div>
      </header>
      <main className="flex-1 px-6 pt-6 pb-6">
        {sports.length === 0 ? (
          <div className="space-y-4">
            <h1 className="text-xl font-semibold">No sports selected.</h1>
            <button type="button" onClick={() => router.push("/manager/onboarding/services")} className="min-h-12 rounded-2xl bg-neutral-900 px-5 py-3 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900">Select Sports</button>
          </div>
        ) : <>
        <h1 className="text-[26px] leading-8 font-bold tracking-tight">Confirm your court names</h1>
        <p className="mt-2 max-w-sm text-sm leading-[21px] text-neutral-500">We&apos;ve named them for you — tap any court to rename it.</p>
        <div className="mt-8 space-y-8">
          {sports.map((sport) => {
            const resources = areas.filter((area) => area.sportId === sport.id);
            return (
              <section key={sport.id} aria-labelledby={`${sport.id}-title`}>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600"><svg aria-hidden="true" viewBox="0 0 32 32" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{sport.icon}</svg></span>
                    <h2 id={`${sport.id}-title`} className="min-w-0 text-base font-semibold [overflow-wrap:anywhere]">{sport.label}</h2>
                  </div>
                  <div className="flex items-center rounded-xl border border-neutral-200">
                    <button type="button" aria-label={`Remove last ${sport.label} playing area`} disabled={resources.length === 1} onClick={() => removeLastArea(sport.id)} className="flex size-11 items-center justify-center rounded-xl hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-neutral-900 disabled:cursor-not-allowed disabled:text-neutral-300"><svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /></svg></button>
                    <span role="status" aria-label={`${sport.label} playing area count`} className="min-w-5 text-center text-sm font-semibold tabular-nums">{resources.length}</span>
                    <button type="button" aria-label={`Add ${sport.label} playing area`} onClick={() => addArea(sport.id)} className="flex size-11 items-center justify-center rounded-xl hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-neutral-900"><svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5v14" /></svg></button>
                  </div>
                </div>
                <div className="space-y-3">
                  {resources.map((area) => {
                    const expanded = editing?.id === area.id;
                    return (
                      <div key={area.id} className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
                        <button type="button" aria-expanded={expanded} aria-controls={`${area.id}-editor`} aria-label={`Rename ${sport.label} ${area.name}`} onClick={() => { setEditing(expanded ? null : { id: area.id, name: area.name }); setError(""); }} className="flex min-h-[68px] w-full items-center gap-3 rounded-2xl px-4 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900">
                          <AreaIcon />
                          <span className="min-w-0 flex-1"><span className="block text-[10px] font-semibold tracking-wider text-neutral-400">{terminology[area.resourceType].label}</span><span className="block text-sm font-semibold [overflow-wrap:anywhere]">{area.name}</span></span>
                          <svg aria-hidden="true" viewBox="0 0 24 24" className={`size-4 shrink-0 ${expanded ? "rotate-180 text-neutral-900" : "text-neutral-300"}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                        </button>
                        <div id={`${area.id}-editor`} hidden={!expanded}>
                          {expanded && <form onSubmit={(event) => saveName(event, area)} className="px-4 pb-4">
                            <label htmlFor={`${area.id}-name`} className="sr-only">Name for {sport.label} {area.name}</label>
                            <div className="flex gap-2">
                              <input id={`${area.id}-name`} value={editing.name} onChange={(event) => { setEditing({ id: area.id, name: event.target.value }); setError(""); }} maxLength={60} aria-invalid={Boolean(error)} aria-describedby={error ? `${area.id}-error` : undefined} className="min-h-11 w-full min-w-0 flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900" />
                              <button type="submit" className="min-h-11 shrink-0 rounded-xl bg-neutral-900 px-4 text-sm font-semibold text-white hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900">Save</button>
                            </div>
                            {error && <p id={`${area.id}-error`} role="alert" className="mt-2 text-xs leading-5 text-neutral-600">{error}</p>}
                          </form>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
        {editing && <p className="mt-4 text-xs text-neutral-500">Save your rename or close the card before continuing.</p>}
        </>}
      </main>
      {sports.length > 0 && <footer className="sticky bottom-0 border-t border-neutral-100 bg-white px-6 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <button type="button" disabled={!canContinue} onClick={() => { if (canContinue) router.push("/manager/onboarding/location"); }} className="flex min-h-[60px] w-full items-center justify-center rounded-2xl bg-neutral-900 px-4 py-4 text-lg font-semibold text-white shadow-sm hover:bg-neutral-800 active:bg-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500 disabled:shadow-none motion-safe:transition-colors">Save &amp; Continue</button>
      </footer>}
    </div>
  );
}
