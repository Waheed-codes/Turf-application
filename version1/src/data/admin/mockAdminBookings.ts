import type { BookingSource, MockBooking } from "@/components/manager/manager-onboarding-provider";
import { mockAdminVenues, formatVenueTime } from "./mockAdminVenues";

export type BookingStatus = MockBooking["status"] | "PENDING_PAYMENT";
export type PaymentStatus = "PAID" | "UNPAID" | "FAILED" | "REFUNDED";
export type AdminBooking = Pick<MockBooking, "id" | "resourceId" | "sportId" | "date" | "startMinutes" | "endMinutes"> & {
  venueId: string;
  userId: string;
  customerName: string;
  phoneNumber: string;
  email: string;
  paymentMethod?: "UPI" | "Card" | "Cash";
  transactionId?: string;
  timeline: { title: string; description: string; at: string }[];
  amount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  source: BookingSource;
};

// A fixed preview date keeps the demonstration consistent across devices.
export const BOOKINGS_TODAY = "2026-09-17";
const customers = ["Rahul Sharma", "Priya Verma", "Arun Kumar", "Sneha Reddy", "Rohan Das", "Ananya Rao", "Kiran Patel", "Meera Reddy"];
const statuses: BookingStatus[] = ["CONFIRMED", "COMPLETED", "CANCELLED", "PENDING_PAYMENT"];
const resources = mockAdminVenues.flatMap(venue => venue.playingAreas.flatMap(resource => {
  const slots = venue.schedulesByResource[resource.id]?.slots.filter(slot => slot.enabled) ?? [];
  return slots.length ? [{ venue, resource, slots }] : [];
}));

// References existing venue schedules and playing areas rather than duplicating
// their names. The core resource/date/time fields match Manager mock bookings.
export const mockAdminBookings: AdminBooking[] = Array.from({ length: 40 }, (_, index) => {
  const { venue, resource, slots } = resources[index % resources.length];
  const slot = slots[(index * 3) % slots.length];
  const status = statuses[index % statuses.length];
  const day = status === "COMPLETED" ? 17 - (index % 3) : 17 + (index % 6);
  const source: BookingSource = index % 5 === 0 ? "OFFLINE" : "ONLINE";
  const paymentStatus: PaymentStatus = status === "PENDING_PAYMENT" ? "UNPAID" : status === "CANCELLED" ? (index % 8 === 2 ? "REFUNDED" : "FAILED") : "PAID";
  const paymentMethod = paymentStatus === "UNPAID" ? undefined : source === "OFFLINE" ? "Cash" as const : index % 2 ? "Card" as const : "UPI" as const;
  const transactionId = paymentMethod && paymentMethod !== "Cash" ? `TXN_DEMO_${88219 - index}` : undefined;
  const at = (minute: number) => `2026-09-${day - 1}T10:${String(minute).padStart(2, "0")}:00+05:30`;
  const timeline = [{ title: source === "OFFLINE" ? "Offline Booking Created" : "Booking Created", description: source === "OFFLINE" ? `Created by Manager · ${venue.manager.name}` : "Created by customer", at: at(0) }];
  if (paymentStatus === "PAID" || paymentStatus === "REFUNDED") timeline.push({ title: paymentMethod === "Cash" ? "Cash Payment Recorded" : "Payment Confirmed", description: transactionId ? `Mock transaction ${transactionId}` : "Mock cash payment recorded by manager", at: at(1) });
  if (paymentStatus === "FAILED") timeline.push({ title: "Payment Failed", description: "Mock payment attempt failed", at: at(1) });
  if (source === "ONLINE" && paymentStatus === "PAID") timeline.push({ title: "Manager Notified", description: "Mock booking notification sent to manager", at: at(2) });
  if (status === "CANCELLED") timeline.push({ title: "Booking Cancelled", description: "Mock booking cancelled", at: at(3) });
  if (paymentStatus === "REFUNDED") timeline.push({ title: "Payment Refunded", description: "Mock payment returned to original method", at: at(4) });
  if (status === "COMPLETED") timeline.push({ title: "Booking Completed", description: "Mock session completed", at: new Date(Date.parse(`2026-09-${day}T00:00:00+05:30`) + slot.endMinutes * 60000).toISOString() });
  return {
    id: `BK-${88219 - index}`, venueId: venue.id, resourceId: resource.id, sportId: resource.sportId,
    userId: `user-${index % customers.length + 1}`, customerName: customers[index % customers.length],
    phoneNumber: `+91 90000 ${String(10000 + index % customers.length)}`,
    date: `2026-09-${day}`, startMinutes: slot.startMinutes, endMinutes: slot.endMinutes,
    amount: [1200, 800, 1500, 600][index % 4], status,
    paymentStatus, source, paymentMethod, transactionId, timeline,
    email: `${customers[index % customers.length].toLowerCase().replaceAll(" ", ".")}@example.com`,
  };
});

export function bookingContext(booking: AdminBooking) {
  const venue = mockAdminVenues.find(item => item.id === booking.venueId)!;
  const resource = venue.playingAreas.find(item => item.id === booking.resourceId)!;
  return { venue, resource };
}
export function bookingDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}
export function bookingTime(booking: AdminBooking) {
  const label = (minutes: number) => `${formatVenueTime(minutes)}${minutes >= 1440 ? " (+1 day)" : ""}`;
  return `${label(booking.startMinutes)} – ${label(booking.endMinutes)}`;
}
export function statusLabel(value: string) { return value.replaceAll("_", " "); }

export function bookingsCsv(bookings: AdminBooking[]) {
  const rows = bookings.map(booking => {
    const { venue, resource } = bookingContext(booking);
    return [booking.id, booking.customerName, booking.phoneNumber, venue.name, resource.name, resource.sportLabel,
      booking.date, bookingTime(booking), booking.amount, booking.paymentStatus, booking.status, booking.source];
  });
  const escape = (value: string | number) => {
    const text = String(value);
    return `"${(/^[=+@\-\t\r]/.test(text) ? "'" + text : text).replaceAll('"', '""')}"`;
  };
  return [["Booking ID", "Customer", "Phone", "Venue", "Court / Pitch", "Sport", "Date", "Time", "Amount (INR)", "Payment", "Status", "Source"], ...rows].map(row => row.map(escape).join(",")).join("\r\n");
}

export type BookingAction = "cancel" | "refund";
export function canCancelBooking(booking: AdminBooking) {
  return booking.status === "CONFIRMED" || booking.status === "PENDING_PAYMENT";
}
export function canRefundBooking(booking: AdminBooking) {
  return booking.status === "CANCELLED" && booking.paymentStatus === "PAID";
}
export function simulateBookingAction(booking: AdminBooking, action: BookingAction): AdminBooking {
  if (action === "cancel" ? !canCancelBooking(booking) : !canRefundBooking(booking)) return booking;
  return {
    ...booking,
    status: action === "cancel" ? "CANCELLED" : booking.status,
    paymentStatus: action === "refund" ? "REFUNDED" : booking.paymentStatus,
    timeline: [...booking.timeline, {
      title: action === "cancel" ? "Booking Cancelled" : "Payment Refunded",
      description: action === "cancel" ? "Simulated by Admin. Payment status unchanged." : "Simulated by Admin. No real money was moved.",
      at: new Date(Math.max(Date.now(), ...booking.timeline.map(event => Date.parse(event.at)))).toISOString(),
    }],
  };
}
