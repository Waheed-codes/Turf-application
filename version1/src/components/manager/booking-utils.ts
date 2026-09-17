import type { BookingStatus, MockBooking } from "./manager-onboarding-provider";

export function bookingStatus(booking: MockBooking, now: number): BookingStatus {
  if (booking.status !== "CONFIRMED") return booking.status;
  const end = new Date(`${booking.date}T00:00:00`);
  // setMinutes also handles intervals extending into the next local day.
  end.setMinutes(booking.endMinutes);
  return end.getTime() <= now ? "COMPLETED" : "CONFIRMED";
}

export function bookingDateLabel(date: string, now: number) {
  const day = new Date(`${date}T00:00:00`);
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (day.getTime() === today.getTime()) return "Today";
  if (day.getTime() === tomorrow.getTime()) return "Tomorrow";
  return day.toLocaleDateString("en-GB", { day: "numeric", month: "short", ...(day.getFullYear() !== today.getFullYear() ? { year: "numeric" } : {}) });
}

export function bookingTimeRange(start: number, end: number) {
  const format = (minutes: number) => {
    const time = minutes % 1440;
    const hour = Math.floor(time / 60);
    return `${String(hour % 12 || 12).padStart(2, "0")}:${String(time % 60).padStart(2, "0")} ${hour < 12 ? "AM" : "PM"}`;
  };
  return `${format(start)} – ${format(end)}${end >= 1440 ? (start >= 1440 ? " (next day)" : " (ends next day)") : ""}`;
}

export function bookingAmount(amount: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(amount);
}
