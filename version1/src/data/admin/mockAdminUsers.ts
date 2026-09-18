import { BOOKINGS_TODAY, bookingContext, mockAdminBookings } from "./mockAdminBookings";

export type AdminUser = {
  id: string; name: string; phone: string; email: string; avatar: string;
  signupDate: string; lastActive: string; status: "ACTIVE" | "BLOCKED";
};
export const USERS_TODAY = BOOKINGS_TODAY;
export const USERS_MONTH = USERS_TODAY.slice(0, 7);
const identities = Array.from(new Map(mockAdminBookings.map(booking => [booking.userId, {
  id: booking.userId, name: booking.customerName, phone: booking.phoneNumber, email: booking.email,
}])).values());
const additionalUsers = [
  { id: "user-9", name: "Aditya Iyer", phone: "+91 90000 10008", email: "aditya.iyer@example.com" },
  { id: "user-10", name: "Neha Singh", phone: "+91 90000 10009", email: "neha.singh@example.com" },
  { id: "user-11", name: "Vikram Nair", phone: "+91 90000 10010", email: "vikram.nair@example.com" },
  { id: "user-12", name: "Pooja Menon", phone: "+91 90000 10011", email: "pooja.menon@example.com" },
];
export const mockAdminUsers: AdminUser[] = [...identities, ...additionalUsers].map((user, index) => ({
  ...user, avatar: user.name.split(" ").map(part => part[0]).join(""),
  signupDate: index % 3 === 0 ? `2026-09-${String(1 + index).padStart(2, "0")}` : `2026-06-${String(1 + index).padStart(2, "0")}`,
  lastActive: `${index % 4 === 3 ? "2026-08-20" : index % 2 ? "2026-09-16" : USERS_TODAY}T10:45:00+05:30`,
  status: index === 6 || index === 10 ? "BLOCKED" : "ACTIVE",
}));
export function userBookings(userId: string) { return mockAdminBookings.filter(booking => booking.userId === userId); }
export function userTotals(userId: string) {
  const bookings = userBookings(userId);
  return { totalBookings: bookings.length, totalSpend: bookings.filter(booking => booking.paymentStatus === "PAID").reduce((sum, booking) => sum + booking.amount, 0) };
}
export function userFavoriteSport(userId: string) {
  const counts = new Map<string, { name: string; count: number }>();
  for (const booking of userBookings(userId)) {
    const current = counts.get(booking.sportId);
    counts.set(booking.sportId, { name: bookingContext(booking).resource.sportLabel, count: (current?.count ?? 0) + 1 });
  }
  return [...counts.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))[0]?.name ?? "No bookings";
}
export function userLastActive(value: string) {
  const date = new Date(value);
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
  const time = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: true }).format(date).toUpperCase();
  return day === USERS_TODAY ? `Today, ${time}` : `${new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric" }).format(date)}, ${time}`;
}
export function usersCsv(users: AdminUser[]) {
  const escape = (value: string | number) => { const text = String(value); return `"${(/^[=+@\-\t\r]/.test(text) ? "'" + text : text).replaceAll('"', '""')}"`; };
  return [["User ID", "Name", "Phone", "Email", "Signup Date", "Last Active", "Status", "Total Bookings", "Total Spend (INR)"], ...users.map(user => {
    const totals = userTotals(user.id);
    return [user.id, user.name, user.phone, user.email, user.signupDate, user.lastActive, user.status, totals.totalBookings, totals.totalSpend];
  })].map(row => row.map(escape).join(",")).join("\r\n");
}
