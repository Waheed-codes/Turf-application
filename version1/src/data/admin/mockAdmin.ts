// Platform-wide preview data. Deliberately independent of Manager venue state.
export const adminProfile = { name: "Admin User", role: "Super Admin", initials: "AU" };
export const adminStats = [
  { label: "TOTAL VENUES", value: "124", trend: "+6 new this month", icon: "venues" },
  { label: "TOTAL MANAGERS", value: "45", trend: "+3 onboarded", icon: "managers" },
  { label: "BOOKINGS TODAY", value: "88", trend: "+12% vs yesterday", icon: "bookings" },
  { label: "REVENUE THIS MONTH", value: "₹42,500", trend: "+8% vs last month", icon: "payments" },
] as const;
export type AdminRange = 7 | 30 | 90;
export type TrendPoint = { day: number; count: number };
const monthlyCounts = [42, 48, 55, 51, 61, 68, 59, 73, 70, 79, 82, 75, 89, 83, 91, 87, 95, 92, 100, 104, 98, 110, 106, 114, 111, 121, 125, 117, 129, 132];
export const bookingTrends: Record<AdminRange, TrendPoint[]> = {
  7: monthlyCounts.slice(-7).map((count, index) => ({ day: index + 1, count })),
  30: monthlyCounts.map((count, index) => ({ day: index + 1, count })),
  90: Array.from({ length: 90 }, (_, index) => ({ day: index + 1, count: index >= 60 ? monthlyCounts[index - 60] : Math.round(monthlyCounts[index % 30] * (index < 30 ? 0.65 : 0.82)) })),
};
export const sportBookings = [
  { name: "Cricket", percentage: 38, shade: "#171717" },
  { name: "Football", percentage: 27, shade: "#525252" },
  { name: "Tennis", percentage: 20, shade: "#a3a3a3" },
  { name: "Padel", percentage: 15, shade: "#d4d4d4" },
];
export const recentActivity = [
  { id: "manager-1", title: "New manager signup", venue: "Rahul's Turf", detail: "Just now · Verified", status: "Success", icon: "managers" },
  { id: "booking-1", title: "Booking cancelled", venue: "Cricket Ground A", detail: "14 min ago · Refunded", status: "Cancelled", icon: "close" },
  { id: "venue-1", title: "Venue pending approval", venue: "Green Park Turf", detail: "1 hr ago · 2 docs missing", status: "Warning", icon: "clock" },
  { id: "review-1", title: "New review received", venue: "Sky Padel Arena", detail: "2 hrs ago · 4.8 ★", status: "Info", icon: "info" },
] as const;
export const topVenues = [
  { name: "Rahul's Turf", revenue: 9200 },
  { name: "Sky Padel Arena", revenue: 7650 },
  { name: "Cricket Ground A", revenue: 6100 },
  { name: "AquaFit Pool", revenue: 4800 },
  { name: "Urban Tennis Club", revenue: 3950 },
];
export const formatRupees = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export const managerStatuses = ["ACTIVE", "PENDING", "SUSPENDED"] as const;
export type AdminManagerStatus = typeof managerStatuses[number];
export type AdminManager = {
  id: string;
  name: string;
  email: string;
  phone: string;
  venueName: string;
  area: string;
  status: AdminManagerStatus;
  dateJoined: string;
};
export const NEW_MANAGER_STATUS: AdminManagerStatus = "PENDING";
export const MANAGERS_PER_PAGE = 10;
// Demonstration only: no message is sent and this does not verify an identity.
export const DEVELOPMENT_MANAGER_OTP = "123456";

const managerNames = [
  "Rahul Sharma", "Meera Joshi", "David Wilson", "Kevin Peterson", "Sarah Chen",
  "Arjun Reddy", "Priya Rao", "Vikram Singh", "Ananya Patel", "Karan Mehta",
  "Neha Kapoor", "Rohan Das", "Ishita Shah", "Amit Verma", "Sneha Iyer",
  "Sanjay Kumar", "Kavya Nair", "Aditya Gupta", "Pooja Menon", "Nikhil Jain",
  "Divya Reddy", "Varun Rao", "Swati Desai", "Rakesh Bhat", "Ayesha Khan",
  "Suresh Nair", "Deepa Singh", "Manish Shah", "Ritu Sharma", "Akash Patel",
  "Nandini Rao", "Pranav Joshi", "Simran Kaur", "Harish Kumar", "Tara Mehta",
  "Vivek Iyer", "Maya Das", "Anil Kapoor", "Rekha Verma", "Dev Menon",
  "Sana Ali", "Raj Malhotra", "Anjali Jain", "Kiran Bhat", "Farah Khan",
];
const managerAreas = ["Gachibowli", "Hitech City", "Madhapur", "Kondapur", "Miyapur"];
const sampleVenueNames = ["Rahul's Turf", "Sky Padel Arena", "AquaFit Pool", "Kings Cricket Ground", "Urban Tennis Club"];
export const mockManagers: AdminManager[] = managerNames.map((name, index) => ({
  id: `admin-manager-${index + 1}`,
  name,
  email: `${name.toLowerCase().replaceAll(" ", ".")}@example.com`,
  phone: `+91 ${9000000000 + index + 1}`,
  venueName: sampleVenueNames[index] ?? `${name.split(" ")[0]}'s Sports Arena`,
  area: managerAreas[index % managerAreas.length],
  status: [2, 11, 20, 29, 38].includes(index) ? "PENDING" : "ACTIVE",
  dateJoined: `2026-${String(1 + Math.floor(index / 5)).padStart(2, "0")}-${String(1 + index % 27).padStart(2, "0")}`,
}));
