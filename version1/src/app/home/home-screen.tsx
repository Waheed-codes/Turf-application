"use client";

import DateSelector from "@/components/booking/date-selector";
import CustomerNavigation from "@/components/navigation/customer-navigation";
import { useState } from "react";
import {
  generateUpcomingDates,
  mockLocation,
  sports,
  timeOptions,
  upcomingGame,
  type UpcomingGame,
} from "@/data/mockHome";
import HomeIcon from "./home-icon";
import VenueCard from "@/components/venues/venue-card";
import { mockAvailabilityVenues } from "@/data/mockAvailabilityVenues";
import { venueAvailabilityContext, readAvailabilityContext, type AvailabilityContext } from "@/lib/booking-context";

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black";

function UpcomingGameBar({ game }: { game: UpcomingGame }) {
  return (
    <div
      aria-label={`Sample upcoming game: ${game.venue}, static countdown ${game.countdown}`}
      title="Sample game — static countdown"
      className="mx-auto flex w-fit max-w-full items-center gap-2 rounded-full bg-neutral-950 px-4 py-3 text-xs font-semibold text-white shadow-lg"
    >
      <HomeIcon name="ball" className="size-4 shrink-0 text-emerald-500" />
      <span className="tabular-nums">{game.countdown}</span>
      <span aria-hidden="true" className="text-neutral-500">
        |
      </span>
      <span className="text-[0.625rem] tracking-wide text-neutral-400">
        {game.venue}
      </span>
      <HomeIcon name="chevron" className="size-3 text-neutral-400" />
    </div>
  );
}

export default function HomeScreen({ initialContext, initialQuery = "" }: { initialContext?: AvailabilityContext | null; initialQuery?: string }) {
  const [submitted, setSubmitted] = useState<AvailabilityContext | null>(null);
  const [query, setQuery] = useState(initialQuery);
  const [sport, setSport] = useState(initialContext?.sport === "Box Cricket" ? "cricket" : initialContext?.sport.toLowerCase() ?? "all");
  const [dates] = useState(() => generateUpcomingDates(7, initialContext?.date));
  const [date, setDate] = useState(() => dates[0].id);
  const [startTime, setStartTime] = useState(initialContext?.start ?? "04:00");
  const [endTime, setEndTime] = useState(initialContext?.end ?? "11:00");
  const [notice, setNotice] = useState("");

  const results = submitted ? mockAvailabilityVenues.flatMap((venue) => {
    const context = venueAvailabilityContext(venue, submitted);
    const matches = [venue.name, venue.area, venue.city, ...venue.sports].some((value) => value.toLowerCase().includes(query.trim().toLowerCase()));
    return context && matches ? [{ venue, context }] : [];
  }) : [];

  const displaySports = [{ id: "all", name: "All" }, ...sports];

  return (
    <main className="min-h-svh bg-neutral-50 px-6 pt-5 pb-[calc(6.5rem+env(safe-area-inset-bottom))] font-sans text-neutral-950">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="sr-only">Find a sports venue</h1>
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm font-semibold">
            <HomeIcon name="location" className="size-5 text-neutral-600" />
            {mockLocation}
            <HomeIcon
              name="chevron"
              className="size-3 rotate-90 text-neutral-400"
            />
          </div>
          <button
            type="button"
            aria-label="Profile"
            title="Profile"
            onClick={() =>
              setNotice("Profile will be available in a future update.")
            }
            className={`flex size-10 items-center justify-center rounded-full border border-neutral-200 bg-neutral-200 text-neutral-600 ${focus}`}
          >
            <HomeIcon name="profile" className="size-5" />
          </button>
        </header>

        <form
          className="mt-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (!startTime || !endTime) {
              setNotice("Please select a start and end time.");
            } else if (endTime <= startTime) {
              setNotice("Choose an end time later than the start time.");
            } else {
              const selectedSport = sport === "all" ? "all" : sport === "cricket" ? "Box Cricket" : sports.find((option) => option.id === sport)?.name;
              const context = readAvailabilityContext({ source: "availability", sport: selectedSport, date, start: startTime, end: endTime });
              if (!context) { setNotice("Please choose a sport and a valid date before checking availability."); return; }
              setNotice("");
              setSubmitted(context);
            }
          }}
        >
          <label className="flex min-h-11 items-center gap-3 rounded-full bg-white px-4 shadow-sm">
            <HomeIcon
              name="search"
              className="size-5 shrink-0 text-neutral-400"
            />
            <span className="sr-only">Search venues, areas, or locations</span>
            <input
              type="search"
              value={query}
              onChange={(event) => { setQuery(event.target.value); setSubmitted(null); }}
              placeholder="Search venues, areas, or locations"
              className="min-h-11 w-full min-w-0 bg-transparent text-sm placeholder:text-neutral-400 focus:outline-none"
            />
          </label>

          <fieldset className="mt-5 min-w-0">
            <legend className="text-sm font-semibold tracking-tight">
              Select Sport
            </legend>
            <div className="mt-2.5 flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {displaySports.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={sport === option.id}
                  onClick={() => { setSport(option.id); setSubmitted(null); }}
                  className={`shrink-0 min-h-10 min-w-[68px] rounded-full border px-4 py-1.5 text-xs font-semibold sm:text-sm ${focus} ${sport === option.id ? "border-neutral-950 bg-neutral-950 text-white" : "border-neutral-200 bg-white"}`}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </fieldset>

          <DateSelector dates={dates} date={date} onChange={(value) => { setDate(value); setSubmitted(null); }} />

          <fieldset className="mt-5 min-w-0">
            <legend className="text-sm font-semibold tracking-tight">
              Select time
            </legend>
            <div className="mt-2.5 flex items-center gap-3">
              {(["start", "end"] as const).map((kind, index) => (
                <div key={kind} className="contents">
                  {index === 1 && (
                    <span className="text-xs font-semibold tracking-wide text-neutral-500">
                      TO
                    </span>
                  )}
                  <label className="relative min-w-0 flex-1">
                    <span className="sr-only">
                      {kind === "start" ? "Start time" : "End time"}
                    </span>
                    <select
                      aria-label={kind === "start" ? "Start time" : "End time"}
                      value={kind === "start" ? startTime : endTime}
                      onChange={(event) => {
                        setSubmitted(null);
                        const newValue = event.target.value;
                        if (kind === "start") {
                          setStartTime(newValue);
                          if (newValue >= endTime) {
                            setEndTime("");
                          }
                        } else {
                          setEndTime(newValue);
                        }
                        setNotice("");
                      }}
                      className={`min-h-12 w-full appearance-none rounded-full border ${(kind === "start" ? startTime : endTime) ? "border-neutral-950" : "border-neutral-300"} bg-white py-2.5 px-4 text-left text-sm font-semibold focus:border-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950 transition-colors`}
                    >
                      <option value="" disabled hidden>
                        0:00
                      </option>
                      {(kind === "end" && startTime
                        ? timeOptions.filter((opt) => opt.value > startTime)
                        : kind === "start"
                          ? timeOptions.slice(0, -1)
                          : timeOptions
                      ).map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <HomeIcon
                      name="chevron"
                      className="pointer-events-none absolute top-1/2 right-3 size-3 -translate-y-1/2 rotate-90 text-neutral-400"
                    />
                  </label>
                </div>
              ))}
            </div>
          </fieldset>

          <p className="mt-4 text-center text-xs leading-4 text-neutral-500 italic">
            Select a sport, date and time to see available venues.
          </p>
          <button
            type="submit"
            className={`mt-2.5 flex min-h-12 w-full items-center justify-center rounded-full bg-neutral-950 px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-neutral-800 ${focus}`}
          >
            Find Available Venues
          </button>
        </form>
        <div aria-live="polite">
          {submitted && <section aria-labelledby="available-venues" className="mt-7">
            <h2 id="available-venues" className="text-xl font-semibold">Available Venues ({results.length})</h2>
            {results.length ? <ul className="mt-4 space-y-3">{results.map(({ venue, context }) => <li key={venue.id}><VenueCard venue={venue} bookingContext={context} /></li>)}</ul> : <div className="py-8 text-center">
              <h3 className="text-lg font-semibold">No venues available</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-500">No venues are available for this sport and time. Try changing your date or time.</p>
            </div>}
          </section>}
        </div>
        <p
          role="status"
          className="mt-2 text-center text-sm leading-5 text-neutral-600"
        >
          {notice}
        </p>
        <p className="mt-1 text-center text-[0.625rem] text-neutral-500">
          Preview · sample game and dates · no real bookings
        </p>
      </div>

      <CustomerNavigation active="/home" onUnavailable={setNotice} />
    </main>
  );
}
