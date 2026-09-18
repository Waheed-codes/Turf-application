"use client";

import { useState } from "react";
import HomeIcon from "@/app/home/home-icon";
import {
  themes,
  themeList,
  getThemeVariables,
  type ThemeId,
  type ThemeDefinition,
} from "@/lib/theme/themes";

export default function ThemePlaygroundPage() {
  const [activeThemeId, setActiveThemeId] = useState<ThemeId>("moss-bone");
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [compareThemeIdA, setCompareThemeIdA] = useState<ThemeId>("moss-bone");
  const [compareThemeIdB, setCompareThemeIdB] = useState<ThemeId>("graphite-sand");

  const activeTheme = themes[activeThemeId];
  const themeA = themes[compareThemeIdA];
  const themeB = themes[compareThemeIdB];

  return (
    <div className="min-h-screen bg-neutral-900 font-sans text-neutral-100 selection:bg-neutral-700 selection:text-white">
      {/* Top Sticky Control Bar */}
      <header className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950/95 backdrop-blur-sm px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center rounded-md bg-neutral-800 px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-300">
                Dev Tool
              </span>
              <h1 className="text-base font-bold tracking-tight text-white sm:text-lg">
                ArenaX Theme Playground
              </h1>
            </div>
            <p className="mt-0.5 text-xs text-neutral-400">
              Preview the existing ArenaX UI under 6 curated design systems.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Switcher */}
            <div className="inline-flex rounded-lg border border-neutral-800 bg-neutral-900 p-1 text-xs">
              <button
                type="button"
                onClick={() => setIsCompareMode(false)}
                className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
                  !isCompareMode
                    ? "bg-neutral-700 text-white shadow-xs"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Single View
              </button>
              <button
                type="button"
                onClick={() => setIsCompareMode(true)}
                className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
                  isCompareMode
                    ? "bg-neutral-700 text-white shadow-xs"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Compare Themes
              </button>
            </div>
          </div>
        </div>

        {/* Theme Selectors */}
        {!isCompareMode ? (
          <div className="mx-auto mt-3 max-w-7xl">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Theme:
              </span>
              {themeList.map((t) => {
                const isSelected = t.id === activeThemeId;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveThemeId(t.id)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                      isSelected
                        ? "border-neutral-400 bg-neutral-800 text-white shadow-sm ring-1 ring-neutral-400"
                        : "border-neutral-800 bg-neutral-900/80 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800"
                    }`}
                  >
                    <span
                      className="size-3 rounded-full border border-neutral-600 shrink-0"
                      style={{ backgroundColor: t.tokens.primary }}
                    />
                    {t.name}
                  </button>
                );
              })}
            </div>

            {/* Active Theme Info Pill */}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-neutral-800/80 bg-neutral-900/50 px-3 py-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-neutral-200">
                  {activeTheme.name}
                </span>
                <span className="text-neutral-500">•</span>
                <span className="text-neutral-400">{activeTheme.tagline}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-neutral-500">Palette:</span>
                <span
                  title="Background"
                  className="size-3 rounded-sm border border-neutral-700"
                  style={{ backgroundColor: activeTheme.tokens.background }}
                />
                <span
                  title="Surface"
                  className="size-3 rounded-sm border border-neutral-700"
                  style={{ backgroundColor: activeTheme.tokens.surface }}
                />
                <span
                  title="Primary"
                  className="size-3 rounded-sm border border-neutral-700"
                  style={{ backgroundColor: activeTheme.tokens.primary }}
                />
                <span
                  title="Accent"
                  className="size-3 rounded-sm border border-neutral-700"
                  style={{ backgroundColor: activeTheme.tokens.accent }}
                />
                <span
                  title="Text"
                  className="size-3 rounded-sm border border-neutral-700"
                  style={{ backgroundColor: activeTheme.tokens.textPrimary }}
                />
                <span
                  title="Border"
                  className="size-3 rounded-sm border border-neutral-700"
                  style={{ backgroundColor: activeTheme.tokens.border }}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Compare Mode Selectors */
          <div className="mx-auto mt-3 grid max-w-7xl grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900/80 p-2">
              <span className="shrink-0 text-xs font-bold uppercase tracking-wider text-neutral-400">
                Left:
              </span>
              <select
                value={compareThemeIdA}
                onChange={(e) => setCompareThemeIdA(e.target.value as ThemeId)}
                className="w-full rounded border border-neutral-700 bg-neutral-800 px-2.5 py-1 text-xs font-semibold text-white focus:outline-none"
              >
                {themeList.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} — {t.tagline}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900/80 p-2">
              <span className="shrink-0 text-xs font-bold uppercase tracking-wider text-neutral-400">
                Right:
              </span>
              <select
                value={compareThemeIdB}
                onChange={(e) => setCompareThemeIdB(e.target.value as ThemeId)}
                className="w-full rounded border border-neutral-700 bg-neutral-800 px-2.5 py-1 text-xs font-semibold text-white focus:outline-none"
              >
                {themeList.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} — {t.tagline}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {!isCompareMode ? (
          /* Single Theme View */
          <div className="flex flex-col items-center">
            <div className="w-full max-w-md">
              <div className="mb-3 flex items-center justify-between px-1">
                <div>
                  <span className="text-xs font-mono font-medium text-neutral-400 uppercase tracking-wider">
                    Previewing Active Identity
                  </span>
                  <h2 className="text-sm font-semibold text-neutral-200">
                    {activeTheme.name}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-neutral-500 font-mono">
                    {activeTheme.isDark ? "Dark Theme" : "Light Theme"}
                  </span>
                </div>
              </div>
              <ArenaXMobilePreview theme={activeTheme} />
            </div>
          </div>
        ) : (
          /* Desktop Side-by-Side Comparison */
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="flex flex-col items-center">
              <div className="mb-3 w-full max-w-md px-1 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-medium text-neutral-400 uppercase tracking-wider">
                    Theme A
                  </span>
                  <h2 className="text-sm font-semibold text-white">
                    {themeA.name}
                  </h2>
                </div>
                <span className="text-[11px] text-neutral-500">
                  {themeA.tagline}
                </span>
              </div>
              <div className="w-full max-w-md">
                <ArenaXMobilePreview theme={themeA} />
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="mb-3 w-full max-w-md px-1 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-medium text-neutral-400 uppercase tracking-wider">
                    Theme B
                  </span>
                  <h2 className="text-sm font-semibold text-white">
                    {themeB.name}
                  </h2>
                </div>
                <span className="text-[11px] text-neutral-500">
                  {themeB.tagline}
                </span>
              </div>
              <div className="w-full max-w-md">
                <ArenaXMobilePreview theme={themeB} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// -----------------------------------------------------------------------------
// ArenaX Mobile Preview Component
// Scoped entirely with CSS variables:
// --background, --surface, --surface-secondary, --text-primary,
// --text-secondary, --border, --primary, --primary-hover, --accent, --button-text
// -----------------------------------------------------------------------------

function ArenaXMobilePreview({ theme }: { theme: ThemeDefinition }) {
  const [selectedSport, setSelectedSport] = useState("football");
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [startTime, setStartTime] = useState("06:00");
  const [endTime, setEndTime] = useState("07:00");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"home" | "search" | "favorites" | "bookings">("home");

  const sportsList = [
    { id: "football", name: "Football" },
    { id: "cricket", name: "Cricket" },
    { id: "badminton", name: "Badminton" },
    { id: "pickleball", name: "Pickleball" },
    { id: "table-tennis", name: "Table Tennis" },
  ];

  const dateOptions = [
    { weekday: "FRI", day: "18", month: "SEP", label: "Today" },
    { weekday: "SAT", day: "19", month: "SEP", label: "Tomorrow" },
    { weekday: "SUN", day: "20", month: "SEP", label: "Sunday" },
    { weekday: "MON", day: "21", month: "SEP", label: "Monday" },
    { weekday: "TUE", day: "22", month: "SEP", label: "Tuesday" },
  ];

  const timeOptionsList = [
    { value: "05:00", label: "05:00 AM" },
    { value: "06:00", label: "06:00 AM" },
    { value: "07:00", label: "07:00 AM" },
    { value: "18:00", label: "06:00 PM" },
    { value: "19:00", label: "07:00 PM" },
    { value: "20:00", label: "08:00 PM" },
    { value: "21:00", label: "09:00 PM" },
  ];

  return (
    <div
      style={getThemeVariables(theme)}
      className="relative mx-auto w-full max-w-[400px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] shadow-xl transition-colors duration-200"
    >
      {/* Mobile Device Status / Top Bar */}
      <div className="flex items-center justify-between border-b border-[var(--border)]/40 px-5 pt-3 pb-2 text-[10px] font-semibold text-[var(--text-secondary)]">
        <span>09:41</span>
        <div className="flex items-center gap-1.5">
          <span className="inline-block size-2 rounded-full bg-[var(--accent)]" />
          <span>ARENAX LIVE</span>
        </div>
      </div>

      <div className="px-5 pt-4 pb-28">
        {/* 1. HEADER */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-black tracking-wider uppercase text-[var(--text-primary)]">
              ARENA<span style={{ color: "var(--primary)" }}>X</span>
            </span>
            <span className="text-xs text-[var(--text-secondary)]">|</span>
            <div className="flex items-center gap-1 text-xs font-medium text-[var(--text-secondary)]">
              <HomeIcon name="location" className="size-3.5 text-[var(--text-secondary)]" />
              <span>Hyderabad</span>
              <HomeIcon name="chevron" className="size-2.5 rotate-90 text-[var(--text-secondary)]" />
            </div>
          </div>
          <button
            type="button"
            aria-label="Profile"
            className="flex size-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] transition-colors hover:border-[var(--primary)]"
          >
            <HomeIcon name="profile" className="size-4" />
          </button>
        </header>

        {/* 2. UPCOMING BOOKING CARD */}
        <section aria-label="Upcoming Booking" className="mt-4">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="flex size-7 items-center justify-center rounded-lg text-xs font-bold"
                  style={{
                    backgroundColor: "var(--surface-secondary)",
                    color: "var(--primary)",
                  }}
                >
                  <HomeIcon name="ball" className="size-4" />
                </span>
                <div>
                  <div className="text-xs font-bold tracking-tight text-[var(--text-primary)]">
                    ARENA X • HITEC CITY
                  </div>
                  <div className="text-[11px] text-[var(--text-secondary)]">
                    Football 7v7 • Court 2
                  </div>
                </div>
              </div>
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor: "var(--surface-secondary)",
                  color: "var(--primary)",
                  border: "1px solid var(--border)",
                }}
              >
                Confirmed
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-[var(--border)]/60 pt-2.5 text-xs">
              <div className="text-[var(--text-secondary)]">
                Today, 08:00 PM - 09:00 PM
              </div>
              <div className="flex items-center gap-1 font-mono text-[11px] font-semibold text-[var(--text-primary)]">
                <span className="text-[var(--text-secondary)]">Starts in</span>
                <span
                  className="rounded px-1.5 py-0.5 text-[10px] font-bold"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "var(--button-text)",
                  }}
                >
                  01:42:35
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. SEARCH & AVAILABILITY SECTION */}
        <section aria-label="Find Venues" className="mt-5">
          {/* Search Input */}
          <label className="flex min-h-10 items-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-xs shadow-xs">
            <HomeIcon name="search" className="size-4 shrink-0 text-[var(--text-secondary)]" />
            <span className="sr-only">Search venues, sports, or areas</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search venues, sports, or areas"
              className="w-full bg-transparent text-xs text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none"
            />
          </label>

          {/* Sport Selector Pills */}
          <div className="mt-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Select Sport
            </div>
            <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {sportsList.map((sport) => {
                const isSelected = selectedSport === sport.id;
                return (
                  <button
                    key={sport.id}
                    type="button"
                    onClick={() => setSelectedSport(sport.id)}
                    className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
                    style={{
                      backgroundColor: isSelected
                        ? "var(--primary)"
                        : "var(--surface)",
                      color: isSelected
                        ? "var(--button-text)"
                        : "var(--text-primary)",
                      border: isSelected
                        ? "1px solid var(--primary)"
                        : "1px solid var(--border)",
                    }}
                  >
                    {sport.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Selector */}
          <div className="mt-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Select Date
            </div>
            <div className="mt-2 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {dateOptions.map((item, idx) => {
                const isSelected = selectedDateIndex === idx;
                return (
                  <button
                    key={item.day}
                    type="button"
                    onClick={() => setSelectedDateIndex(idx)}
                    className="flex h-[72px] w-[56px] shrink-0 flex-col items-center justify-center rounded-xl transition-all"
                    style={{
                      backgroundColor: isSelected
                        ? "var(--primary)"
                        : "var(--surface)",
                      color: isSelected
                        ? "var(--button-text)"
                        : "var(--text-primary)",
                      border: isSelected
                        ? "1px solid var(--primary)"
                        : "1px solid var(--border)",
                    }}
                  >
                    <span
                      className="text-[10px] font-semibold"
                      style={{
                        color: isSelected
                          ? "var(--button-text)"
                          : "var(--text-secondary)",
                      }}
                    >
                      {item.weekday}
                    </span>
                    <span className="text-lg font-bold leading-tight">
                      {item.day}
                    </span>
                    <span
                      className="text-[9px] font-medium"
                      style={{
                        color: isSelected
                          ? "var(--button-text)"
                          : "var(--text-secondary)",
                      }}
                    >
                      {item.month}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Selector Dropdowns */}
          <div className="mt-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Select Time
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="relative flex-1">
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none"
                >
                  {timeOptionsList.map((opt) => (
                    <option key={`start-${opt.value}`} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <HomeIcon
                  name="chevron"
                  className="pointer-events-none absolute top-1/2 right-3 size-2.5 -translate-y-1/2 rotate-90 text-[var(--text-secondary)]"
                />
              </div>

              <span className="text-[11px] font-bold text-[var(--text-secondary)]">
                TO
              </span>

              <div className="relative flex-1">
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none"
                >
                  {timeOptionsList.map((opt) => (
                    <option key={`end-${opt.value}`} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <HomeIcon
                  name="chevron"
                  className="pointer-events-none absolute top-1/2 right-3 size-2.5 -translate-y-1/2 rotate-90 text-[var(--text-secondary)]"
                />
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            className="mt-4 flex min-h-11 w-full items-center justify-center rounded-xl text-xs font-bold uppercase tracking-wider transition-opacity hover:opacity-90 active:scale-[0.99]"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--button-text)",
            }}
          >
            Find Available Venues
          </button>
        </section>

        {/* 4. VENUE CARD */}
        <section aria-label="Featured Venue" className="mt-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Available Venue
            </span>
            <span
              className="text-[11px] font-semibold"
              style={{ color: "var(--accent)" }}
            >
              2 slots left
            </span>
          </div>

          <div className="mt-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-xs">
            <div className="flex gap-3">
              {/* Venue Thumbnail Placeholder */}
              <div
                className="flex size-18 shrink-0 flex-col items-center justify-center rounded-lg border border-[var(--border)] text-center"
                style={{ backgroundColor: "var(--surface-secondary)" }}
              >
                <HomeIcon name="ball" className="size-5 text-[var(--primary)]" />
                <span className="mt-1 text-[9px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Court 1
                </span>
              </div>

              {/* Venue Details */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-1">
                  <h3 className="truncate text-xs font-bold text-[var(--text-primary)]">
                    The Base Athletic Turf
                  </h3>
                  <span
                    className="flex shrink-0 items-center gap-0.5 text-[10px] font-bold"
                    style={{ color: "var(--accent)" }}
                  >
                    ★ 4.9
                  </span>
                </div>
                <div className="mt-0.5 flex items-center gap-1 text-[11px] text-[var(--text-secondary)]">
                  <HomeIcon name="location" className="size-3 shrink-0" />
                  <span>Gachibowli, Hyderabad</span>
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span
                    className="rounded px-1.5 py-0.2 text-[9px] font-medium"
                    style={{
                      backgroundColor: "var(--surface-secondary)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Football & Cricket
                  </span>
                  <span
                    className="rounded px-1.5 py-0.2 text-[9px] font-semibold"
                    style={{
                      backgroundColor: "var(--surface-secondary)",
                      color: "var(--primary)",
                    }}
                  >
                    Instant Booking
                  </span>
                </div>
              </div>
            </div>

            {/* Price & Book Action */}
            <div className="mt-3 flex items-center justify-between border-t border-[var(--border)]/60 pt-2.5">
              <div>
                <span className="text-[10px] text-[var(--text-secondary)]">
                  Starts from
                </span>
                <div className="text-xs font-bold text-[var(--text-primary)]">
                  ₹1,200
                  <span className="text-[10px] font-normal text-[var(--text-secondary)]">
                    /hour
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="rounded-lg px-4 py-1.5 text-xs font-bold transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--button-text)",
                }}
              >
                Book Now
              </button>
            </div>
          </div>
        </section>

        {/* 5. SMALL UI ELEMENTS (Design Token Demonstration) */}
        <section aria-label="Design Token Showcase" className="mt-5">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            UI Components & States
          </div>

          <div className="mt-2 space-y-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-xs">
            {/* Badges & Accents */}
            <div>
              <span className="text-[10px] font-semibold text-[var(--text-secondary)]">
                Badges & Tokens
              </span>
              <div className="mt-1 flex flex-wrap gap-1.5">
                <span
                  className="rounded-md border px-2 py-0.5 text-[10px] font-semibold"
                  style={{
                    backgroundColor: "var(--surface-secondary)",
                    borderColor: "var(--border)",
                    color: "var(--text-primary)",
                  }}
                >
                  Surface Secondary
                </span>
                <span
                  className="rounded-md border px-2 py-0.5 text-[10px] font-bold"
                  style={{
                    borderColor: "var(--accent)",
                    color: "var(--accent)",
                  }}
                >
                  Accent Token
                </span>
                <span
                  className="rounded-md px-2 py-0.5 text-[10px] font-bold"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "var(--button-text)",
                  }}
                >
                  Primary Token
                </span>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-t border-[var(--border)]" />

            {/* Input & Disabled Button State */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] font-semibold text-[var(--text-secondary)]">
                  Disabled Button
                </span>
                <button
                  type="button"
                  disabled
                  className="mt-1 w-full rounded-lg border border-[var(--border)] px-2 py-1.5 text-[11px] font-medium text-[var(--text-secondary)] opacity-50 cursor-not-allowed"
                  style={{ backgroundColor: "var(--surface-secondary)" }}
                >
                  Unavailable
                </button>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-[var(--text-secondary)]">
                  Secondary Action
                </span>
                <button
                  type="button"
                  className="mt-1 w-full rounded-lg border border-[var(--border)] px-2 py-1.5 text-[11px] font-semibold text-[var(--text-primary)] hover:border-[var(--primary)]"
                  style={{ backgroundColor: "var(--surface)" }}
                >
                  View Details
                </button>
              </div>
            </div>

            {/* Notice / Alert State */}
            <div
              className="flex items-start gap-2 rounded-lg border border-[var(--border)] p-2"
              style={{ backgroundColor: "var(--surface-secondary)" }}
            >
              <span
                className="mt-0.5 flex size-3.5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--button-text)",
                }}
              >
                !
              </span>
              <p className="text-[11px] leading-4 text-[var(--text-secondary)]">
                Selected slot is in high demand. 1 slot remaining for 06:00 PM.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* 6. BOTTOM NAVIGATION */}
      <nav
        aria-label="Preview Bottom Navigation"
        className="absolute inset-x-4 bottom-3 flex items-center justify-between rounded-xl border border-[var(--border)] px-3 py-2 shadow-lg"
        style={{ backgroundColor: "var(--surface)" }}
      >
        {[
          { id: "home" as const, label: "Home", icon: "home" as const },
          { id: "search" as const, label: "Search", icon: "search" as const },
          { id: "favorites" as const, label: "Favorites", icon: "heart" as const },
          { id: "bookings" as const, label: "Bookings", icon: "bookings" as const },
        ].map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center justify-center gap-0.5 px-3 py-1 text-center transition-colors"
              style={{
                color: isActive ? "var(--primary)" : "var(--text-secondary)",
              }}
            >
              <HomeIcon name={item.icon} className="size-4" />
              <span className="text-[9px] font-semibold">{item.label}</span>
              {isActive && (
                <span
                  className="size-1 rounded-full"
                  style={{ backgroundColor: "var(--primary)" }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
