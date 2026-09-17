"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

// UI-only service areas; replace this list with a location source in a later phase.
const areas = [
  { id: "gachibowli", name: "Gachibowli" },
  { id: "hitech-city", name: "Hitech City" },
  { id: "madhapur", name: "Madhapur" },
  { id: "kondapur", name: "Kondapur" },
  { id: "miyapur", name: "Miyapur" },
  { id: "kukatpally", name: "Kukatpally" },
  { id: "manikonda", name: "Manikonda" },
  { id: "nallagandla", name: "Nallagandla" },
  { id: "financial-district", name: "Financial District" },
];

function Icon({ children, className = "size-5" }: { children: ReactNode; className?: string }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className={`${className} shrink-0`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{children}</svg>;
}

function Pin() {
  return <Icon className="size-4"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2" /></Icon>;
}

function Divider() {
  return <div className="my-4 flex items-center gap-3" aria-hidden="true"><span className="h-px flex-1 bg-neutral-200" /><span className="text-xs font-semibold tracking-widest text-neutral-400">OR</span><span className="h-px flex-1 bg-neutral-200" /></div>;
}

export default function Page() {
  const router = useRouter();
  const [mapsUrl, setMapsUrl] = useState("");
  const [search, setSearch] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [mockDetected, setMockDetected] = useState(false);
  const [mapExpanded, setMapExpanded] = useState(false);
  const filteredAreas = areas.filter((area) => area.name.toLowerCase().includes(search.trim().toLowerCase()));
  const canContinue = Boolean(mapsUrl.trim() || selectedArea || mockDetected);

  function detectMockLocation() {
    // Deliberately simulated: no browser geolocation or external requests.
    setSelectedArea("gachibowli");
    setSearch("");
    setMockDetected(true);
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-neutral-50 font-sans text-neutral-900">
      <header className="border-b border-neutral-200 bg-white pt-[env(safe-area-inset-top)]">
        <div className="flex h-[72px] items-center gap-2 px-4">
          <button type="button" aria-label="Back to Select Services" onClick={() => router.push("/manager/onboarding/services")} className="flex size-10 shrink-0 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900">
            <Icon><path d="m14 6-6 6 6 6M8 12h12" /></Icon>
          </button>
          <h1 className="text-lg font-semibold">Venue Location</h1>
        </div>
      </header>

      <main className="flex-1 px-6 pt-5 pb-6">
        <div id="venue-map-preview" className={`relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-300 shadow-sm ${mapExpanded ? "h-[300px]" : "h-[190px]"}`}>
          <svg role="img" aria-label="Illustrative venue location map, not a real geographic location" viewBox="0 0 360 200" preserveAspectRatio="xMidYMid slice" className="size-full">
            <rect width="360" height="200" fill="#d4d4d4" />
            <path d="m136 49 110-38 38 31-41 157-102-5-31-90Z" fill="#a3a3a3" />
            <g fill="#737373">
              <path d="m12 9 29-5 5 21-29 8Zm45 8 26-9 7 19-27 11ZM7 69l25-17 14 18-26 18Zm38 22 23-17 16 21-24 18Zm-16 44 18-19 20 14-20 20Zm37-18 14-12 14 21-14 10Zm-52 45 20-16 11 16-21 15Zm40 6 20-18 18 17-18 20Zm31-28 13-8 13 26-14 8ZM177 0h24v18h-24Zm34 0h19v9h-19Zm76 5 17 5-7 22-17-5Zm39 10 23 8-6 23-24-8Zm-15 38 16 5-6 19-16-5Zm24 14 20 6-5 19-22-5Zm-37 30 25-6 5 20-25 7Zm39 10 19-4 4 23-17 3Zm-50 31 19 5-5 21-20-6Zm31 6 23 4-6 23-22-5Zm-46 29 25 7-5 19-25-7Zm33 9 25 5-3 13h-25Z" />
            </g>
            <g fill="none" stroke="#f5f5f5" strokeWidth="8">
              <path d="M-10 20 95 99l39 111M-10 197 98 67l41-24 37-9L246-3M269 209 289 125 326-10M288 119l82-24M281 145l78 22M37-5l-9 54M49 129l62 30" />
            </g>
            <g fill="none" stroke="#b0b0b0" strokeWidth="1.5">
              <path d="M-10 20 95 99l39 111M-10 197 98 67l41-24 37-9L246-3M269 209 289 125 326-10" />
            </g>
            <ellipse cx="183" cy="181" rx="17" ry="5" fill="#737373" opacity=".35" />
            <path d="M205 145c0 17-22 39-22 39s-22-22-22-39a22 22 0 1 1 44 0Z" fill="#171717" />
            <circle cx="183" cy="144" r="8" fill="#fafafa" />
          </svg>
          <span className="absolute top-3 left-3 rounded-md bg-white/95 px-2 py-1 text-[10px] font-medium text-neutral-600">Map preview</span>
          <button type="button" aria-label={mapExpanded ? "Collapse map preview" : "Expand map preview"} aria-expanded={mapExpanded} aria-controls="venue-map-preview" onClick={() => setMapExpanded((current) => !current)} className="absolute right-3 bottom-3 flex size-11 items-center justify-center rounded-xl bg-white text-neutral-700 shadow-sm hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900">
            <Icon><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" /></Icon>
          </button>
        </div>

        <label htmlFor="maps-url" className="mt-6 block text-sm font-semibold text-neutral-700">Paste Google Maps URL</label>
        <div className="relative mt-2">
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-neutral-400"><Icon className="size-4"><path d="m10 13 4-4m-6 6-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 2 1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0" /></Icon></span>
          <input id="maps-url" type="text" inputMode="url" autoCapitalize="none" spellCheck={false} value={mapsUrl} onChange={(event) => setMapsUrl(event.target.value)} placeholder="https://maps.google.com/..." className="min-h-12 w-full min-w-0 rounded-2xl border border-neutral-200 bg-white py-3 pr-3 pl-10 text-base shadow-sm placeholder:text-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900" />
        </div>

        <Divider />
        <button type="button" onClick={detectMockLocation} className="flex min-h-[60px] w-full items-center justify-center gap-2 rounded-2xl border-2 border-neutral-900 bg-white px-3 py-3 text-sm font-semibold hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900">
          <Icon><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /><path d="M12 2v4m0 12v4M2 12h4m12 0h4" /></Icon>
          Detect my current location
        </button>
        <p role="status" className={mockDetected ? "mt-2 text-xs leading-5 text-neutral-500" : "sr-only"}>{mockDetected ? "Demo location selected: Gachibowli. Your real location was not accessed." : ""}</p>
        <Divider />

        <fieldset className="min-w-0">
          <legend className="text-sm font-semibold">Preferred Area</legend>
          <p id="area-description" className="mt-1 text-xs leading-5 text-neutral-500">Select the area where you want your venue to appear in search</p>
          <label htmlFor="area-search" className="sr-only">Search area</label>
          <div className="relative mt-3">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-neutral-400"><Icon className="size-4"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></Icon></span>
            <input id="area-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search area (e.g. Gachibowli, Hitech City)" className="min-h-[50px] w-full min-w-0 rounded-full border border-neutral-700 bg-white py-3 pr-3 pl-10 text-base placeholder:text-xs placeholder:text-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900" />
          </div>
          <div className="mt-2 overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm" aria-describedby="area-description">
            {filteredAreas.map((area) => (
              <label key={area.id} className={`relative flex min-h-[50px] cursor-pointer items-center gap-3 border-b border-neutral-100 px-4 py-3 text-sm last:border-b-0 hover:bg-neutral-50 ${selectedArea === area.id ? "bg-neutral-100 font-semibold text-neutral-900" : "text-neutral-700"}`}>
                <input type="radio" name="preferred-area" value={area.id} checked={selectedArea === area.id} onChange={() => setSelectedArea(area.id)} className="peer sr-only" />
                <span className="pointer-events-none absolute inset-1 rounded-lg peer-focus-visible:outline-2 peer-focus-visible:outline-neutral-900" />
                <span className={selectedArea === area.id ? "text-neutral-900" : "text-neutral-400"}><Pin /></span>
                <span className="min-w-0 flex-1">{area.name}</span>
                {selectedArea === area.id && <Icon className="size-4"><path d="m5 12 4 4L19 6" /></Icon>}
              </label>
            ))}
            {filteredAreas.length === 0 && <p role="status" className="px-4 py-5 text-sm text-neutral-500">No areas found</p>}
          </div>
        </fieldset>
      </main>

      <footer className="sticky bottom-0 border-t border-neutral-100 bg-white px-6 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <button type="button" disabled={!canContinue} onClick={() => { if (canContinue) router.push("/manager/onboarding/photos"); }} className="flex min-h-[60px] w-full items-center justify-center rounded-2xl bg-neutral-900 px-4 py-4 text-lg font-semibold text-white shadow-sm hover:bg-neutral-800 active:bg-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500 disabled:shadow-none motion-safe:transition-colors">
          Save &amp; Continue
        </button>
      </footer>
    </div>
  );
}
