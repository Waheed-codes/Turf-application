"use client";

import CustomerNavigation from "@/components/navigation/customer-navigation";
import { useState } from "react";
import {
  dates,
  mockLocation,
  sports,
  timeOptions,
  upcomingGame,
  type UpcomingGame,
} from "@/data/mockHome";
import HomeIcon from "./home-icon";

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

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const [sport, setSport] = useState(sports[0].id);
  const [date, setDate] = useState(dates[0].id);
  const [startTime, setStartTime] = useState("20:00");
  const [endTime, setEndTime] = useState("22:00");
  const [notice, setNotice] = useState("");

  return (
    <main className="min-h-svh bg-neutral-50 px-6 pt-8 pb-[calc(8rem+env(safe-area-inset-bottom))] font-sans text-neutral-950">
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
            className={`flex size-11 items-center justify-center rounded-full border border-neutral-200 bg-neutral-200 text-neutral-600 ${focus}`}
          >
            <HomeIcon name="profile" className="size-6" />
          </button>
        </header>

        <div className="mt-6">
          <UpcomingGameBar game={upcomingGame} />
        </div>

        <form
          className="mt-6"
          onSubmit={(event) => {
            event.preventDefault();
            setNotice(
              endTime <= startTime
                ? "Choose an end time later than the start time."
                : "Venue results are not available yet. No availability has been checked.",
            );
          }}
        >
          <label className="flex min-h-12 items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 shadow-xs focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-black">
            <HomeIcon
              name="search"
              className="size-5 shrink-0 text-neutral-400"
            />
            <span className="sr-only">Search venues, areas, or locations</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search venues, areas, or locations"
              className="min-h-12 w-full min-w-0 bg-transparent text-sm placeholder:text-neutral-400 focus:outline-none"
            />
          </label>

          <fieldset className="mt-8">
            <legend className="text-base font-semibold tracking-tight">
              What do you want to play?
            </legend>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {sports.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={sport === option.id}
                  onClick={() => setSport(option.id)}
                  className={`min-h-11 rounded-full border px-2 py-2 text-xs font-semibold sm:text-sm ${focus} ${sport === option.id ? "border-neutral-950 bg-neutral-950 text-white" : "border-neutral-200 bg-white"}`}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-9">
            <legend className="text-base font-semibold tracking-tight">
              Select date
            </legend>
            <div className="mt-5 grid grid-cols-4 gap-3">
              {dates.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-label={option.label}
                  aria-pressed={date === option.id}
                  onClick={() => setDate(option.id)}
                  className={`flex min-h-26 flex-col items-center justify-center rounded-full py-3 ${focus} ${date === option.id ? "bg-neutral-950 text-white shadow-md" : "text-neutral-800"}`}
                >
                  <span
                    className={`text-[0.625rem] font-semibold ${date === option.id ? "text-neutral-300" : "text-neutral-500"}`}
                  >
                    {option.weekday}
                  </span>
                  <span className="mt-1 text-2xl leading-7 font-semibold">
                    {option.day}
                  </span>
                  <span className="mt-1 text-[0.625rem] font-semibold">
                    {option.month}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`mt-2 size-1 rounded-full ${date === option.id ? "bg-white" : "bg-transparent"}`}
                  />
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-8">
            <legend className="text-base font-semibold tracking-tight">
              Select time
            </legend>
            <div className="mt-4 flex items-center gap-3">
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
                        (kind === "start" ? setStartTime : setEndTime)(
                          event.target.value,
                        );
                        setNotice("");
                      }}
                      className={`min-h-14 w-full appearance-none rounded-full border border-neutral-200 bg-white py-3 pr-7 pl-3 text-sm font-semibold shadow-xs ${focus}`}
                    >
                      {timeOptions.map((option) => (
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

          <p className="mt-7 text-center text-xs leading-5 text-neutral-500 italic">
            Select a sport, date and time to see available venues.
          </p>
          <button
            type="submit"
            className={`mt-3 flex min-h-14 w-full items-center justify-center rounded-xl bg-neutral-950 px-4 py-4 text-sm font-semibold text-white shadow-md hover:bg-neutral-800 ${focus}`}
          >
            Find Available Venues
          </button>
        </form>
        <p
          role="status"
          className="mt-3 text-center text-sm leading-5 text-neutral-600"
        >
          {notice}
        </p>
        <p className="mt-2 text-center text-[0.625rem] text-neutral-500">
          Preview · sample game and dates · no real bookings
        </p>
      </div>

 V1-login-home
      <CustomerNavigation active="/home" onUnavailable={setNotice} />

      <nav
        aria-label="Customer navigation"
        className="fixed inset-x-6 bottom-[calc(1rem+env(safe-area-inset-bottom))] mx-auto flex max-w-sm items-center justify-between rounded-full border border-neutral-100 bg-white p-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
      >
        <Link
          href="/home"
          aria-label="Home"
          title="Home"
          aria-current="page"
          className={`flex min-h-11 w-1/4 items-center justify-center rounded-full bg-neutral-950 text-white ${focus}`}
        >
          <HomeIcon name="home" />
        </Link>
        {(
          [
            { label: "Search", icon: "search" },
            { label: "Favourite", icon: "heart" },
            { label: "Recent Bookings", icon: "bookings" },
          ] as const
        ).map((item) => (
          <button
            key={item.label}
            type="button"
            aria-label={item.label}
            title={item.label}
            onClick={() =>
              setNotice(`${item.label} will be available in a future update.`)
            }
            className={`flex min-h-11 w-1/4 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 ${focus}`}
          >
            <HomeIcon name={item.icon} />
          </button>
        ))}
      </nav>
main
    </main>
  );
}
