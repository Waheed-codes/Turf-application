"use client";

import { useState } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { AdminTrendChart, AdminSportChart } from "@/components/admin/admin-chart";
import { AdminIcon } from "@/components/admin/admin-icon";
import { adminStats, bookingTrends, sportBookings, recentActivity, topVenues, formatRupees, type AdminRange } from "@/data/admin/mockAdmin";

const card = "min-w-0 rounded-xl border border-neutral-100 bg-white shadow-xs";
const badges = { Success: "bg-neutral-900 text-white", Cancelled: "border border-neutral-300 bg-white text-neutral-600", Warning: "bg-neutral-200 text-neutral-800", Info: "bg-neutral-100 text-neutral-500" };

export default function AdminDashboardPage() {
  const [range, setRange] = useState<AdminRange>(30);
  const [notice, setNotice] = useState("");
  return <>
    <AdminPageHeader title="Dashboard Overview" subtitle="Here's what's happening across your venues today.">
      <div className="relative flex items-center"><span className="pointer-events-none absolute left-3 text-neutral-400"><AdminIcon name="bookings" /></span><label htmlFor="admin-date-range" className="sr-only">Bookings trend date range</label><select id="admin-date-range" value={range} onChange={(event) => setRange(Number(event.target.value) as AdminRange)} className="min-h-10 appearance-none rounded-lg border border-neutral-200 bg-white py-2 pr-9 pl-9 text-sm text-neutral-600 focus-visible:outline-2">{([7, 30, 90] as const).map((days) => <option key={days} value={days}>Last {days} days</option>)}</select><span className="pointer-events-none absolute right-3 text-neutral-400"><AdminIcon name="chevron" className="size-3" /></span></div>
      <button type="button" onClick={() => setNotice("Exports are coming soon. No report has been generated.")} className="flex min-h-10 items-center gap-2 rounded-lg bg-neutral-900 px-4 text-sm font-medium text-white hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2"><AdminIcon name="export" />Export</button>
    </AdminPageHeader>
    {notice && <div role="status" className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-600"><p>{notice}</p><button type="button" aria-label="Dismiss message" onClick={() => setNotice("")} className="flex size-9 shrink-0 items-center justify-center rounded-lg hover:bg-neutral-100 focus-visible:outline-2"><AdminIcon name="close" /></button></div>}
    <dl aria-label="Platform summary" className="grid grid-cols-1 gap-5 min-[500px]:grid-cols-2 xl:grid-cols-4">{adminStats.map((stat) => <AdminStatCard key={stat.label} {...stat} />)}</dl>
    <div className="mt-7 grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.42fr)_minmax(0,1fr)]">
      <section aria-labelledby="booking-trend-title" className={`${card} p-5`}><div className="flex flex-wrap items-center justify-between gap-2"><h2 id="booking-trend-title" className="text-base font-semibold">Bookings Trend (Last {range} Days)</h2><span className="text-xs text-neutral-400">Daily count</span></div><AdminTrendChart points={bookingTrends[range]} /></section>
      <section aria-labelledby="sport-chart-title" className={`${card} self-stretch p-5`}><h2 id="sport-chart-title" className="text-base font-semibold">Bookings by Sport</h2><AdminSportChart sports={sportBookings} /><p className="mt-2 text-[10px] text-neutral-400">Platform distribution · Last 30 days</p></section>
      <section aria-labelledby="activity-title" className={card}><div className="flex items-center justify-between gap-2 px-5 pt-4 pb-2"><h2 id="activity-title" className="text-base font-semibold">Recent Activity</h2><button type="button" onClick={() => setNotice("All available preview activity is shown below.")} className="min-h-10 rounded-md px-1 text-xs font-medium text-neutral-600 underline-offset-4 hover:underline focus-visible:outline-2">View all</button></div><ul>{recentActivity.map((activity) => <li key={activity.id} className="flex min-h-[66px] items-center gap-4 border-b border-neutral-100 px-5 py-3 last:border-b-0"><span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600"><AdminIcon name={activity.icon} /></span><div className="min-w-0 flex-1"><p className="text-sm leading-5 text-neutral-600">{activity.title} — <span className="font-medium text-neutral-900">{activity.venue}</span></p><p className="mt-0.5 text-[11px] text-neutral-400">{activity.detail}</p></div><span className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-medium ${badges[activity.status]}`}>{activity.status}</span></li>)}</ul></section>
      <section aria-labelledby="top-venues-title" className={`${card} self-stretch p-5`}><div className="mb-4 flex flex-wrap items-center justify-between gap-2"><h2 id="top-venues-title" className="text-base font-semibold">Top Performing Venues</h2><span className="text-xs text-neutral-400">By revenue</span></div><ol className="space-y-4">{topVenues.map((venue) => <li key={venue.name}><div className="mb-1.5 flex items-center justify-between gap-3 text-sm"><span className="text-neutral-600">{venue.name}</span><span className="shrink-0 font-semibold tabular-nums">{formatRupees(venue.revenue)}</span></div><div aria-hidden="true" className="h-1.5 overflow-hidden rounded-full bg-neutral-100"><div className="h-full rounded-full bg-neutral-400" style={{ width: `${venue.revenue / topVenues[0].revenue * 100}%` }} /></div></li>)}</ol></section>
    </div>
    <p className="mt-5 text-xs text-neutral-400">Preview data · Date range applies to the bookings trend.</p>
  </>;
}
