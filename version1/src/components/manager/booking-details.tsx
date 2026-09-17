import type { MockBooking } from "./manager-onboarding-provider";
import { bookingAmount, bookingStatus, bookingTimeRange } from "./booking-utils";

export function BookingDetails({ booking, now }: { booking: MockBooking; now: number }) {
  const rows = [
    ...(booking.customerName ? [["Customer", booking.customerName]] : []),
    ["Sport", booking.sportName],
    ["Playing Area", booking.playingAreaName],
    ["Date", new Date(`${booking.date}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })],
    ["Time", bookingTimeRange(booking.startMinutes, booking.endMinutes)],
    ["Booking Source", `${booking.bookingType} BOOKING`],
    ["Status", bookingStatus(booking, now)],
    ...(booking.amount !== null ? [["Amount", bookingAmount(booking.amount)]] : []),
    ...(booking.phoneNumber ? [["Phone", booking.phoneNumber]] : []),
  ];
  return <dl className="mt-4 space-y-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm [overflow-wrap:anywhere]">
    {rows.map(([label, value]) => <div key={label}><dt className="text-neutral-500">{label}</dt><dd className="mt-1 font-semibold">{value}</dd></div>)}
  </dl>;
}
