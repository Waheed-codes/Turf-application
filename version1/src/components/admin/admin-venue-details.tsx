"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AdminIcon } from "./admin-icon";
import { AdminPageHeader } from "./admin-page-header";
import { AdminVenueStatusBadge } from "./admin-venue-status";
import { useAdminVenues } from "./admin-venues-provider";
import { formatDuration, formatVenueTime, type AdminVenue } from "@/data/admin/mockAdminVenues";
import type { Schedule } from "@/components/manager/manager-onboarding-provider";

const buttonClass = "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-800";
const primaryClass = "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-800";

function DetailSection({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  const headingId = useId();
  return <section aria-labelledby={headingId} className={`min-w-0 rounded-xl border border-neutral-200 bg-white p-5 shadow-xs sm:p-6 ${className}`}>
    <h2 id={headingId} className="mb-4 text-base font-semibold tracking-tight">{title}</h2>
    {children}
  </section>;
}

function DetailField({ label, children }: { label: string; children: ReactNode }) {
  return <div className="min-w-0"><dt className="text-xs text-neutral-500">{label}</dt><dd className="mt-1 text-sm leading-6 text-neutral-800">{children}</dd></div>;
}

function ScheduleTime({ minutes }: { minutes: number }) {
  const followingDays = Math.floor(minutes / 1440);
  return <span className="whitespace-nowrap">{formatVenueTime(minutes)}{followingDays > 0 && <span className="ml-1 text-[10px] font-medium text-neutral-500">(+{followingDays} day{followingDays > 1 ? "s" : ""})</span>}</span>;
}

function ResourceSchedule({ schedule }: { schedule?: Schedule }) {
  if (!schedule) return <p className="text-sm text-neutral-500">No timing configuration has been provided for this playing area.</p>;
  // Manager schedules store minutes from the opening day; midnight can also be 0.
  const midnightAdjusted = schedule.closingMinutes === 0 ? 1440 : schedule.closingMinutes;
  const closing = midnightAdjusted < schedule.openingMinutes ? midnightAdjusted + 1440 : midnightAdjusted;

  return <>
    <dl className="grid grid-cols-1 gap-4 rounded-lg bg-neutral-50 p-4 min-[450px]:grid-cols-3">
      <DetailField label="Opening"><ScheduleTime minutes={schedule.openingMinutes} /></DetailField>
      <DetailField label="Closing"><ScheduleTime minutes={closing} /></DetailField>
      <DetailField label="Slot duration">{formatDuration(schedule.durationMinutes)}</DetailField>
    </dl>
    <div className="mt-5 flex flex-wrap items-center justify-between gap-2"><h4 className="text-xs font-semibold tracking-wide text-neutral-600">CONFIGURED SLOTS</h4><p className="text-xs text-neutral-500">{schedule.slots.filter((slot) => slot.enabled).length} enabled · {schedule.slots.filter((slot) => !slot.enabled).length} disabled</p></div>
    {schedule.slots.length === 0 ? <p className="mt-3 text-sm text-neutral-500">No slots have been configured for this playing area.</p> : <ul className="mt-3 grid gap-2 xl:grid-cols-2">
      {schedule.slots.map((slot) => <li key={slot.id} className={`flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-lg border px-3 py-2.5 ${slot.enabled ? "border-neutral-200 bg-white" : "border-dashed border-neutral-300 bg-neutral-100"}`}>
        <span className={`text-xs tabular-nums ${slot.enabled ? "text-neutral-800" : "text-neutral-500"}`}><ScheduleTime minutes={slot.startMinutes} /> <span aria-hidden="true">–</span><span className="sr-only">to</span> <ScheduleTime minutes={slot.endMinutes} /></span>
        <span className={`text-[10px] font-medium ${slot.enabled ? "text-neutral-500" : "text-neutral-600"}`}>{slot.enabled ? "Enabled" : "Disabled by manager"}</span>
      </li>)}
    </ul>}
    {closing >= 1440 && <p className="mt-3 text-xs leading-5 text-neutral-500">+1 day indicates a time after midnight on the following day.</p>}
  </>;
}

function VenueSchedules({ venue }: { venue: AdminVenue }) {
  const [sportId, setSportId] = useState(venue.selectedSports[0]?.id ?? "");
  const sport = venue.selectedSports.find((item) => item.id === sportId) ?? venue.selectedSports[0];
  const playingAreas = venue.playingAreas.filter((area) => area.sportId === sport?.id);

  return <DetailSection title="Configured time slots">
    <p className="-mt-1 text-sm leading-6 text-neutral-500">Review each court or pitch’s operating schedule. These are the manager’s configured slots, not today’s booking availability.</p>
    {venue.selectedSports.length > 0 ? <>
      <div aria-label="Choose a sport for time slots" className="mt-5 flex flex-wrap gap-2">
        {venue.selectedSports.map((item) => <button key={item.id} type="button" aria-pressed={sport?.id === item.id} onClick={() => setSportId(item.id)} className={`min-h-10 rounded-lg border px-4 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 ${sport?.id === item.id ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"}`}>{item.label}</button>)}
      </div>
      <div key={sport?.id} className="mt-4 space-y-3">
        {playingAreas.length > 0 ? playingAreas.map((area, index) => <details key={area.id} open={index === 0} className="group overflow-hidden rounded-lg border border-neutral-200">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 bg-neutral-50 px-4 py-3 focus-visible:outline-2 focus-visible:outline-offset-[-2px] [&::-webkit-details-marker]:hidden"><span className="min-w-0 text-sm font-semibold">{sport?.label} <span className="px-1 text-neutral-400">/</span> {area.name}</span><AdminIcon name="chevron" className="size-4 text-neutral-500 transition-transform group-open:rotate-180" /></summary>
          <div className="border-t border-neutral-200 p-3 sm:p-4"><ResourceSchedule schedule={venue.schedulesByResource[area.id]} /></div>
        </details>) : <p className="rounded-lg bg-neutral-50 p-4 text-sm text-neutral-500">No courts or pitches have been configured for {sport?.label}.</p>}
      </div>
    </> : <p className="mt-4 text-sm text-neutral-500">No services or time slots have been configured yet.</p>}
  </DetailSection>;
}

function safeMapsUrl(value?: string) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : undefined;
  } catch { return undefined; }
}

export function AdminVenueDetails({ venueId }: { venueId: string }) {
  const { venues, reviewVenue } = useAdminVenues();
  const venue = venues.find((item) => item.id === venueId);
  const [review, setReview] = useState<"LIVE" | "REJECTED" | null>(null);
  const [feedback, setFeedback] = useState("");
  const confirmation = useRef<HTMLDialogElement>(null);
  const feedbackElement = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const dialog = confirmation.current;
    if (review && !dialog?.open) dialog?.showModal();
    if (!review && dialog?.open) dialog.close();
  }, [review]);

  if (!venue) return <div className="rounded-xl border border-neutral-200 bg-white p-6"><h1 className="text-xl font-semibold">Venue unavailable</h1><Link href="/admin/venues" className={`${buttonClass} mt-5`}>Back to Venues</Link></div>;

  const mapsUrl = safeMapsUrl(venue.location.mapsUrl);
  const banking = venue.banking;

  function confirmReview() {
    if (!venue || venue.status !== "PENDING_APPROVAL" || !review) return;
    reviewVenue(venue.id, review);
    setFeedback(review === "LIVE" ? `${venue.name} has been approved and is now Live.` : `${venue.name} has been rejected.`);
    setReview(null);
    requestAnimationFrame(() => feedbackElement.current?.focus());
  }

  return <>
    <Link href="/admin/venues" className="mb-5 inline-flex min-h-9 items-center gap-2 rounded-md text-sm font-medium text-neutral-500 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2"><AdminIcon name="back" />Back to Venues</Link>
    <AdminPageHeader title={venue.name} subtitle="Review the venue information submitted by the manager.">
      <AdminVenueStatusBadge status={venue.status} />
    </AdminPageHeader>

    {feedback && <p ref={feedbackElement} role="status" tabIndex={-1} className="mb-6 flex items-center gap-3 rounded-xl border border-neutral-300 bg-white px-5 py-4 text-sm font-medium outline-none"><AdminIcon name={venue.status === "LIVE" ? "check" : "info"} className="size-5" />{feedback}</p>}

    <div className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px] 2xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="min-w-0 space-y-6">
        <DetailSection title="Venue photos">
          {venue.photos.length > 0 ? <div className="grid gap-3 sm:grid-cols-2">
            {venue.photos.map((photo, index) => <figure key={photo.id} className={`min-w-0 ${index === 0 && venue.photos.length % 2 === 1 ? "sm:col-span-2" : ""}`}>
              <div className={`relative overflow-hidden rounded-lg bg-neutral-100 ${index === 0 && venue.photos.length % 2 === 1 ? "aspect-[2/1]" : "aspect-[3/2]"}`}><Image src={photo.previewUrl} alt={`${venue.name} — ${photo.name}`} fill sizes="(min-width: 1280px) 600px, (min-width: 640px) 50vw, 100vw" className="object-cover grayscale" unoptimized /></div>
              <figcaption className="mt-2 text-xs text-neutral-500">{photo.name}</figcaption>
            </figure>)}
          </div> : <p className="rounded-lg bg-neutral-50 p-6 text-center text-sm text-neutral-500">No venue photos have been provided.</p>}
        </DetailSection>

        <DetailSection title="Venue description"><p className="whitespace-pre-line text-sm leading-7 text-neutral-600">{venue.description || "No description has been provided."}</p></DetailSection>

        <DetailSection title="Services & courts">
          <p className="-mt-1 mb-5 text-sm text-neutral-500">Playing areas grouped by the manager’s selected sports.</p>
          {venue.selectedSports.length > 0 ? <div className="grid gap-4 sm:grid-cols-2">
            {venue.selectedSports.map((sport) => {
              const areas = venue.playingAreas.filter((area) => area.sportId === sport.id);
              return <section key={sport.id} className="min-w-0 rounded-lg border border-neutral-200 p-4"><h3 className="flex items-center gap-2 text-sm font-semibold"><AdminIcon name="sports" />{sport.label}</h3>
                {areas.length > 0 ? <ul className="mt-3 space-y-2 border-l border-neutral-200 pl-4">{areas.map((area) => <li key={area.id} className="text-sm text-neutral-600">{area.name}</li>)}</ul> : <p className="mt-3 text-xs text-neutral-500">No playing areas configured.</p>}
              </section>;
            })}
          </div> : <p className="text-sm text-neutral-500">No services selected.</p>}
        </DetailSection>

        <VenueSchedules venue={venue} />
      </div>

      <div className="min-w-0 space-y-6">
        {venue.status === "PENDING_APPROVAL" && <DetailSection title="Venue approval">
          <p className="text-sm leading-6 text-neutral-500">Review the submitted information before approving or rejecting this venue.</p>
          <div className="mt-5 space-y-2"><button type="button" onClick={() => setReview("LIVE")} className={`${primaryClass} w-full`}><AdminIcon name="check" />Approve Venue</button><button type="button" onClick={() => setReview("REJECTED")} className={`${buttonClass} w-full`}><AdminIcon name="close" />Reject Venue</button></div>
        </DetailSection>}

        <DetailSection title="Manager"><div className="flex items-start gap-3"><span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold text-neutral-600">{venue.manager.name.split(" ").slice(0, 2).map((part) => part[0]).join("")}</span><div className="min-w-0"><h3 className="text-sm font-semibold">{venue.manager.name}</h3><p className="mt-1 text-xs text-neutral-500">Venue manager</p></div></div><dl className="mt-5 space-y-4"><DetailField label="Phone number">{venue.manager.phone}</DetailField><DetailField label="Email"><span className="break-all">{venue.manager.email}</span></DetailField></dl></DetailSection>

        <DetailSection title="Location"><dl className="space-y-4"><DetailField label="Area">{venue.location.area}</DetailField><DetailField label="Venue address">{venue.location.address}</DetailField>{mapsUrl && <DetailField label="Maps URL"><a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="break-all underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-800 focus-visible:outline-2">{mapsUrl}<span className="sr-only"> (opens in a new tab)</span></a></DetailField>}</dl></DetailSection>

        <DetailSection title="Amenities">
          {venue.amenities.length > 0 ? <ul className="grid gap-3">{venue.amenities.map((amenity) => <li key={amenity.id} className="flex items-center gap-2.5 text-sm text-neutral-600"><span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-neutral-100"><AdminIcon name="check" className="size-3" /></span>{amenity.label}</li>)}</ul> : <p className="text-sm text-neutral-500">No amenities selected.</p>}
        </DetailSection>

        <DetailSection title="Banking details">
          {banking ? <dl className="space-y-4"><DetailField label="Account holder">{banking.accountHolderName}</DetailField><DetailField label="Bank">{banking.bank}</DetailField><DetailField label="IFSC"><span className="font-mono text-xs">{banking.ifscCode}</span></DetailField><DetailField label="Account number"><span className="font-mono tracking-wide">••••••••{banking.accountLast4.slice(-4)}</span></DetailField>{banking.upiId && <DetailField label="UPI ID"><span className="break-all">{banking.upiId}</span></DetailField>}</dl> : <p className="text-sm text-neutral-500">Banking details have not been provided.</p>}
        </DetailSection>
      </div>
    </div>

    <dialog ref={confirmation} aria-labelledby="venue-review-title" aria-describedby="venue-review-description" onCancel={() => setReview(null)} onClose={() => setReview(null)} className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-900 shadow-xl backdrop:bg-black/45">
      <span className="mb-4 flex size-11 items-center justify-center rounded-full bg-neutral-100"><AdminIcon name={review === "LIVE" ? "check" : "close"} className="size-5" /></span>
      <h2 id="venue-review-title" className="text-xl font-semibold">{review === "LIVE" ? "Approve venue?" : "Reject venue?"}</h2>
      <p id="venue-review-description" className="mt-3 text-sm leading-6 text-neutral-600">{review === "LIVE" ? `Approve ${venue.name} and mark it as Live?` : `Reject ${venue.name} and mark it as Rejected?`} This updates the frontend preview only.</p>
      <div className="mt-6 flex flex-wrap justify-end gap-2"><button type="button" autoFocus onClick={() => setReview(null)} className={buttonClass}>Cancel</button><button type="button" onClick={confirmReview} className={primaryClass}>{review === "LIVE" ? "Confirm Approval" : "Confirm Rejection"}</button></div>
    </dialog>
  </>;
}
