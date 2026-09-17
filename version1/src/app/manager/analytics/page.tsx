"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { customSportIcon, services, useManagerOnboarding } from "@/components/manager/manager-onboarding-provider";
import { ManagerBottomNav } from "@/components/manager/manager-bottom-nav";
import { AnalyticsChart } from "@/components/manager/analytics-chart";
import { analyticsDate, deriveAnalytics, hourLabel, type AnalyticsRange } from "@/components/manager/analytics-utils";
import { bookingAmount } from "@/components/manager/booking-utils";

function money(value: number | null) {
  if (value === null) return "—";
  if (Math.abs(value) >= 100000) return `₹${Number((value / 100000).toFixed(1))}L`;
  if (Math.abs(value) >= 10000) return `₹${Number((value / 1000).toFixed(1))}K`;
  return bookingAmount(value);
}
function percentage(value: number | null) {
  if (value === null) return "—";
  if (value > 0 && value < 1) return "<1%";
  return `${Math.round(value)}%`;
}
const heading = "mb-4 text-sm font-bold tracking-wide";
const card = "rounded-2xl border border-neutral-200 bg-white shadow-sm";
const shades = ["bg-neutral-50 text-neutral-500", "bg-neutral-200 text-neutral-700", "bg-neutral-400 text-neutral-950", "bg-neutral-600 text-white", "bg-black text-white"];

export default function ManagerAnalyticsPage() {
  const { selectedSports, playingAreas, schedulesByResource, mockBookings } = useManagerOnboarding();
  const [days, setDays] = useState<AnalyticsRange>(30);
  const [today, setToday] = useState(() => analyticsDate(new Date()));
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  useEffect(() => {
    const refresh = () => setToday(analyticsDate(new Date()));
    const timer = window.setInterval(refresh, 60_000);
    window.addEventListener("focus", refresh);
    return () => { window.clearInterval(timer); window.removeEventListener("focus", refresh); };
  }, []);
  const analytics = useMemo(() => deriveAnalytics({ selectedSports, playingAreas, schedulesByResource, bookings: mockBookings, days, today }), [selectedSports, playingAreas, schedulesByResource, mockBookings, days, today]);
  const maxDemand = Math.max(...analytics.hours);
  const dateLabel = (date: string) => new Date(`${date}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  return <div className="mx-auto min-h-dvh w-full max-w-md bg-white font-sans text-neutral-900">
    <header className="border-b border-neutral-100 px-5 pt-[env(safe-area-inset-top)]"><h1 className="flex min-h-[64px] items-center text-xl font-bold tracking-tight">Analytics</h1></header>
    <main className="px-5 pt-4 pb-[calc(7rem+env(safe-area-inset-bottom))]">
      <div className="mb-4 flex justify-end"><label htmlFor="analytics-range" className="sr-only">Date range</label><select id="analytics-range" value={days} onChange={(event) => setDays(Number(event.target.value) as AnalyticsRange)} className="min-h-11 max-w-full rounded-full border border-neutral-200 bg-white px-4 text-sm text-neutral-600 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"><option value={7}>Last 7 Days</option><option value={30}>Last 30 Days</option><option value={90}>Last 90 Days</option></select></div>
      <dl aria-label="Analytics summary" className="grid grid-cols-3 gap-2 min-[375px]:gap-3">
        {[{ label: "TOTAL BOOKINGS", value: analytics.totalBookings.toLocaleString("en-IN") }, { label: "TOTAL REVENUE", value: money(analytics.revenue) }, { label: "OCCUPANCY", value: percentage(analytics.occupancy) }].map((metric) => <div key={metric.label} className={`${card} min-w-0 px-2.5 py-3 min-[375px]:px-3`}><dt className="min-h-7 text-[9px] font-semibold tracking-wide text-neutral-500">{metric.label}</dt><dd className="mt-1 text-lg font-bold tabular-nums [overflow-wrap:anywhere] min-[375px]:text-xl">{metric.value}</dd></div>)}
      </dl>
      <p className="mt-3 text-[10px] leading-4 text-neutral-500">{dateLabel(analytics.from)} – {dateLabel(analytics.to)}, including today. Revenue uses known amounts{analytics.missingAmounts ? `; ${analytics.missingAmounts} ${analytics.missingAmounts === 1 ? "booking has" : "bookings have"} no amount` : ""}.</p>

      <section aria-labelledby="revenue-title" className="mt-7"><h2 id="revenue-title" className={heading}>REVENUE TREND</h2><AnalyticsChart trend={analytics.trend} /><p className="mt-2 text-[10px] text-neutral-500">{days === 7 ? "Daily totals" : days === 30 ? "Weekly totals; final week may be shorter" : "15-day totals"} · Known amounts only</p></section>

      <section aria-labelledby="performance-title" className="mt-8"><h2 id="performance-title" className={heading}>PERFORMANCE BY COURT</h2>
        {analytics.resources.length === 0 ? <div className={`${card} p-5`}><p className="text-sm text-neutral-500">No courts or pitches configured.</p><Link href="/manager/onboarding/courts" className="mt-4 inline-flex min-h-12 items-center rounded-xl bg-neutral-950 px-4 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950">Set Up Playing Areas</Link></div> : <div className="space-y-4">{analytics.resources.map((resource) => <article key={resource.area.id} aria-label={`${resource.sportName} - ${resource.area.name}`} className={`${card} p-4`}>
          <div className="flex items-center gap-3"><span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-neutral-50 text-neutral-600"><svg aria-hidden="true" viewBox="0 0 32 32" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{services.find((sport) => sport.id === resource.area.sportId)?.icon ?? customSportIcon}</svg></span><h3 className="min-w-0 flex-1 text-sm font-semibold [overflow-wrap:anywhere]">{resource.sportName} - {resource.area.name}</h3><span aria-label={`Occupancy: ${percentage(resource.occupancy)}`} title={`${resource.occupied} booked of ${resource.capacity} configured slot occurrences`} className="shrink-0 rounded-full border border-neutral-800 px-3 py-1 text-[10px] font-semibold">{percentage(resource.occupancy)}</span></div>
          <dl className="mt-5 grid grid-cols-3 gap-2">{[{ label: "BOOKINGS", value: resource.bookings.toLocaleString("en-IN") }, { label: "REVENUE", value: money(resource.revenue) }, { label: "PEAK HOUR", value: resource.peakHour === null ? "—" : hourLabel(resource.peakHour) }].map((metric) => <div key={metric.label} className="min-w-0"><dt className="text-[9px] font-semibold tracking-wide text-neutral-500">{metric.label}</dt><dd className="mt-0.5 text-sm font-semibold [overflow-wrap:anywhere]">{metric.value}</dd></div>)}</dl>
          <div role="meter" aria-label={`${resource.area.name} occupancy`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={resource.occupancy ?? 0} aria-valuetext={resource.occupancy === null ? "No configured capacity" : `${resource.occupied} of ${resource.capacity} slot occurrences booked`} className="mt-4 h-1.5 overflow-hidden rounded-full bg-neutral-100"><div className="h-full rounded-full bg-neutral-900" style={{ width: `${resource.occupancy ?? 0}%` }} /></div>
        </article>)}</div>}
        <p className="mt-3 text-[10px] leading-4 text-neutral-500">Occupancy uses current enabled slots repeated daily across this range. Schedule history is not yet available. Peak-hour ties use the earliest hour.</p>
      </section>

      <section aria-labelledby="peak-hours-title" className="mt-8"><h2 id="peak-hours-title" className={heading}>PEAK HOURS</h2><div className={`${card} p-4`}>
        {maxDemand === 0 ? <p className="py-10 text-center text-sm text-neutral-500">No booking data yet</p> : <>
          <div aria-label="Booking starts by hour" className="grid grid-cols-6 gap-2">{Array.from({ length: 24 }, (_, index) => (index + 6) % 24).map((hour) => {
            const count = analytics.hours[hour];
            const intensity = count ? Math.max(1, Math.ceil(count / maxDemand * 4)) : 0;
            return <button key={hour} type="button" aria-pressed={selectedHour === hour} aria-label={`${hourLabel(hour)}: ${count} ${count === 1 ? "booking" : "bookings"}`} onClick={() => setSelectedHour(hour)} title={`${hourLabel(hour)}: ${count} booking starts`} className={`flex min-h-11 min-w-0 items-center justify-center rounded-md text-[9px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 ${shades[intensity]} ${selectedHour === hour ? "ring-2 ring-neutral-700 ring-offset-2" : ""}`}>{hourLabel(hour)}</button>;
          })}</div>
          <p role="status" className="mt-3 text-[10px] text-neutral-500">{selectedHour === null ? "Booking start times · Tap an hour for demand" : `${hourLabel(selectedHour)}: ${analytics.hours[selectedHour]} booking starts`}</p>
          <div className="mt-4 flex items-center justify-between gap-2 text-[9px] font-semibold tracking-wide text-neutral-500"><span>LOW DEMAND</span><span aria-hidden="true" className="flex gap-1">{shades.map((shade) => <span key={shade} className={`size-3 rounded-sm border border-neutral-200 ${shade}`} />)}</span><span>PEAK</span></div>
        </>}
      </div></section>
    </main>
    <ManagerBottomNav active="Analytics" />
  </div>;
}
