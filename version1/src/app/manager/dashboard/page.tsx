"use client";

import Link from "next/link";
import { ManagerBottomNav } from "@/components/manager/manager-bottom-nav";
import { SlotBookingDialog, type SlotSelection } from "@/components/manager/slot-booking-dialog";
import { useEffect, useState, type ReactNode } from "react";
import { DAY_MINUTES, resourceTypes, terminology, useManagerOnboarding } from "@/components/manager/manager-onboarding-provider";

function localDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function formatTime(minutes: number) {
  const time = minutes % DAY_MINUTES;
  const hour = Math.floor(time / 60);
  return `${String(hour % 12 || 12).padStart(2, "0")}:${String(time % 60).padStart(2, "0")} ${hour < 12 ? "AM" : "PM"}`;
}

function Icon({ kind }: { kind: string }) {
  const paths: Record<string, ReactNode> = {
    sport: <><circle cx="12" cy="12" r="9" /><path d="M10 3c-4 6 8 12 4 18" strokeDasharray="2 2" /></>,
    area: <path d="m3 7 9-4 9 4-9 4-9-4Zm0 5 9 4 9-4M3 17l9 4 9-4" />,
    date: <><rect x="4" y="5" width="16" height="16" rx="2" /><path d="M8 3v4m8-4v4M4 11h16m-11 4h3v3H9z" /></>,
    edit: <path d="m4 16-1 5 5-1L21 7l-4-4L4 16Zm10-10 4 4M4 16l4 4" />,

  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[kind]}</svg>;
}

function Selector({ label, kind, children }: { label: string; kind: string; children: ReactNode }) {
  return <div className="flex min-h-[74px] min-w-0 items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-neutral-50 text-neutral-600"><Icon kind={kind} /></span>
    <div className="min-w-0 flex-1"><label htmlFor={`dashboard-${kind}`} className="block text-[11px] font-medium tracking-wider text-neutral-500">{label}</label>{children}</div>
  </div>;
}

const selectClass = "min-h-8 w-full min-w-0 bg-white text-sm font-semibold text-neutral-900 focus-visible:outline-2 focus-visible:outline-neutral-900";
const actionClass = "inline-flex min-h-12 items-center justify-center rounded-xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900";

export default function ManagerDashboardPage() {
  const { selectedSports, playingAreas, schedulesByResource, dashboardSelection, setDashboardSelection, mockBookings, seedMockBookings } = useManagerOnboarding();
  const [activeSlot, setActiveSlot] = useState<SlotSelection | null>(null);
  const sport = selectedSports.find((item) => item.id === dashboardSelection.sportId) ?? selectedSports[0];
  const areas = playingAreas.filter((area) => area.sportId === sport?.id);
  const resource = areas.find((area) => area.id === dashboardSelection.resourceId) ?? areas[0];
  const today = localDate();
  const date = dashboardSelection.date >= today ? dashboardSelection.date : today;
  const schedule = resource ? schedulesByResource[resource.id] : undefined;
  const resourceId = resource?.id;
  useEffect(() => {
    if (resourceId && schedule) seedMockBookings(resourceId, date, schedule.slots);
  }, [resourceId, date, schedule, seedMockBookings]);
  const bookings = mockBookings.filter((booking) => booking.status !== "CANCELLED" && booking.resourceId === resourceId && booking.date === date);
  // Preserve occupied time even when the manager changes interval boundaries.
  const isBooked = (start: number, end: number) => bookings.some((booking) => start < booking.endMinutes && end > booking.startMinutes);
  const slots = schedule?.slots.filter((slot) => slot.enabled || isBooked(slot.startMinutes, slot.endMinutes)) ?? [];
  const editHref = `/manager/onboarding/slots?mode=edit&resourceId=${encodeURIComponent(resourceId ?? "")}`;
  const dateLabel = `${date === today ? "Today, " : ""}${new Date(`${date}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`;

  return <div className="mx-auto min-h-dvh w-full max-w-md bg-neutral-50 font-sans text-neutral-900">
    <header className="border-b border-neutral-200 bg-white pt-[env(safe-area-inset-top)]">
      <div className="flex min-h-[68px] items-center justify-between gap-3 px-5">
        <h1 className="min-w-0 text-xl font-bold tracking-tight">Green Park Turf</h1>
        <Link href="/manager/onboarding/services" className="flex min-h-11 shrink-0 items-center rounded-full border border-neutral-300 px-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-neutral-900">Edit</Link>
      </div>
    </header>
    <main className="px-5 pt-5 pb-[calc(7rem+env(safe-area-inset-bottom))]">
      {!sport ? <section className="rounded-2xl border border-neutral-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Venue setup incomplete</h2>
        <p className="mt-2 mb-5 text-sm leading-6 text-neutral-500">Select your sports and playing areas to manage availability.</p>
        <Link href="/manager/onboarding/services" className={actionClass}>Continue Setup</Link>
      </section> : <>
        <div className="space-y-3">
          <Selector label="SPORT" kind="sport"><select id="dashboard-sport" className={selectClass} value={sport.id} onChange={(event) => {
            const sportId = event.target.value;
            setDashboardSelection((current) => ({ ...current, sportId, resourceId: playingAreas.find((area) => area.sportId === sportId)?.id ?? "" }));
          }}>{selectedSports.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></Selector>
          {resource && <>
            <Selector label={terminology[resource.resourceType ?? resourceTypes[sport.id] ?? "area"].label} kind="area"><select id="dashboard-area" className={selectClass} value={resource.id} onChange={(event) => setDashboardSelection((current) => ({ ...current, sportId: sport.id, resourceId: event.target.value }))}>{areas.map((area) => <option key={area.id} value={area.id}>{area.name}</option>)}</select></Selector>
            <Selector label="DATE" kind="date"><div className="relative min-h-8 rounded focus-within:outline-2 focus-within:outline-neutral-900">
              <span className="pointer-events-none flex min-h-8 items-center justify-between text-sm font-semibold" aria-hidden="true">{dateLabel}<span className="text-neutral-400">⌄</span></span>
              <input id="dashboard-date" type="date" min={today} value={date} aria-label={`Date: ${dateLabel}`} onClick={(event) => event.currentTarget.showPicker?.()} onChange={(event) => { if (event.target.value >= today) setDashboardSelection((current) => ({ ...current, date: event.target.value })); }} className="absolute inset-0 min-h-8 w-full min-w-0 cursor-pointer opacity-0" />
            </div></Selector>
          </>}
        </div>
        {!resource ? <section className="mt-6 space-y-4"><h2 className="font-semibold">No playing areas configured.</h2><Link href="/manager/onboarding/courts" className={actionClass}>Set Up Playing Areas</Link></section> : <section aria-labelledby="time-slots-title" className="mt-8">
          <div className="mb-5 flex items-center justify-between gap-3"><h2 id="time-slots-title" className="border-b-2 border-neutral-900 pb-1 text-base font-semibold">Time Slots</h2><p role="status" className="text-xs text-neutral-500">{slots.length} {slots.length === 1 ? "Slot" : "Slots"}</p></div>
          {slots.length === 0 ? <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5"><p className="text-sm leading-6 text-neutral-600">No time slots configured for this playing area.</p><Link href={editHref} className={actionClass}>Set Time Slots</Link></div> : <>
            <div className="space-y-3">{slots.map((slot) => {
              const booked = isBooked(slot.startMinutes, slot.endMinutes);
              return <button key={slot.id} type="button" aria-haspopup="dialog" onClick={() => setActiveSlot({ resourceId: resource.id, sportLabel: sport.label, resourceName: resource.name, resourceLabel: terminology[resource.resourceType].name, date, dateLabel, startMinutes: slot.startMinutes, endMinutes: slot.endMinutes })} className="flex w-full cursor-pointer text-left hover:border-neutral-400 hover:bg-neutral-50 active:bg-neutral-100 active:shadow-inner focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 min-h-[74px] items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-3 py-4 shadow-sm min-[375px]:gap-3 min-[375px]:px-4">
                <span aria-hidden="true" className={`h-9 w-1 shrink-0 rounded-full ${booked ? "bg-neutral-900" : "bg-neutral-300"}`} />
                <span className="min-w-0 flex-1"><span className="block text-[11px] font-semibold tabular-nums min-[375px]:text-[13px]">{formatTime(slot.startMinutes)} – {formatTime(slot.endMinutes)}</span>{slot.endMinutes >= DAY_MINUTES && <span className="mt-1 block text-[10px] text-neutral-500">{slot.startMinutes >= DAY_MINUTES ? "Next day" : "Ends next day"}</span>}</span>
                <span className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-semibold tracking-wide min-[375px]:px-3 min-[375px]:text-[10px] ${booked ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600"}`}>{booked ? "BOOKED" : "AVAILABLE"}</span>
              </button>;
            })}</div>
            <Link href={editHref} className="mt-3 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-neutral-300 bg-white text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"><Icon kind="edit" />Edit Time Slots</Link>
            <p className="mt-3 text-center text-[11px] text-neutral-500">Demo bookings</p>
          </>}
        </section>}
      </>}
    </main>
    {activeSlot && <SlotBookingDialog selection={activeSlot} onDismiss={() => setActiveSlot(null)} />}
    <ManagerBottomNav active="Home" />
  </div>;
}
