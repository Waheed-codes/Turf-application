export const adminRoles = ["SUPER_ADMIN", "FINANCE", "SUPPORT"] as const;
export type AdminRole = typeof adminRoles[number];
export const roleLabels: Record<AdminRole, string> = { SUPER_ADMIN: "Super Admin", FINANCE: "Finance", SUPPORT: "Support" };
export type SettingsAdmin = { id: string; name: string; email: string; role: AdminRole; lastLogin: string | null; status: "ACTIVE" | "INVITED" };
export const permissions = [
  { id: "dashboard.view", label: "View Dashboard", roles: ["SUPER_ADMIN", "FINANCE", "SUPPORT"] },
  { id: "managers.manage", label: "Manage Managers", roles: ["SUPER_ADMIN", "SUPPORT"] },
  { id: "venues.approve", label: "Approve Venues", roles: ["SUPER_ADMIN"] },
  { id: "bookings.manage", label: "Manage Bookings", roles: ["SUPER_ADMIN", "FINANCE", "SUPPORT"] },
  { id: "payouts.process", label: "Process Payouts", roles: ["SUPER_ADMIN", "FINANCE"] },
  { id: "users.manage", label: "Manage Users", roles: ["SUPER_ADMIN", "SUPPORT"] },
  { id: "areas.manage", label: "Manage Areas", roles: ["SUPER_ADMIN"] },
  { id: "sports.manage", label: "Manage Sports/Services", roles: ["SUPER_ADMIN"] },
  { id: "settings.manage", label: "Manage Settings", roles: ["SUPER_ADMIN"] },
] satisfies { id: string; label: string; roles: AdminRole[] }[];
export const settingsTabs = ["General", "Commission & Fees", "Notifications", "Admin Roles & Permissions", "Payment Gateway", "Security"] as const;
export type SettingsTab = typeof settingsTabs[number];
export const settingsFields = {
  "General": [
    { key: "platformName", label: "Platform Name", type: "text" },
    { key: "defaultCity", label: "Default City", options: ["Hyderabad", "Bengaluru", "Mumbai", "Delhi"] },
    { key: "supportEmail", label: "Support Email", type: "email" },
    { key: "supportPhone", label: "Support Phone Number", type: "tel" },
    { key: "currency", label: "Currency", options: ["INR (₹)"] },
    { key: "timeZone", label: "Timezone", options: ["GMT+5:30 India Standard Time", "UTC", "GMT+4 Gulf Standard Time"] },
  ],
  "Commission & Fees": [
    { key: "commission", label: "Platform Commission %", type: "number", min: 0, max: 100 },
    { key: "convenienceFee", label: "Convenience Fee (₹)", type: "number", min: 0, max: 10000 },
    { key: "gst", label: "Tax/GST %", type: "number", min: 0, max: 100 },
  ],
  "Payment Gateway": [
    { key: "paymentProvider", label: "Payment Provider", options: ["Razorpay", "Stripe", "PayU"] },
    { key: "paymentMode", label: "Payment Mode", options: ["Test", "Live"] },
  ],
  "Security": [
    { key: "sessionMinutes", label: "Session timeout (minutes)", type: "number", min: 5, max: 1440 },
  ],
} satisfies Record<string, { key: string; label: string; type?: string; options?: string[]; min?: number; max?: number }[]>;
export type SettingsField = { key: string; label: string; type?: string; options?: string[]; min?: number; max?: number };
export const notificationChannels = ["Email", "SMS", "Push"] as const;
export type NotificationChannel = typeof notificationChannels[number];
export const notificationEvents = [
  { id: "newBooking", group: "Manager Notifications", label: "New Booking Alert", description: "Sent to manager when a user books a slot" },
  { id: "payout", group: "Manager Notifications", label: "Payout Processed", description: "Confirmation of a revenue transfer" },
  { id: "approval", group: "Manager Notifications", label: "Venue Approval Status", description: "Updates on venue verification and activation" },
  { id: "confirmation", group: "User Notifications", label: "Booking Confirmation", description: "Sent after a successful payment" },
  { id: "reminder", group: "User Notifications", label: "Booking Reminder", description: "Sent 2 hours before the scheduled slot" },
  { id: "cancellation", group: "User Notifications", label: "Cancellation Alert", description: "Sent when a booking is cancelled by manager or admin" },
] as const;
export type NotificationEvent = typeof notificationEvents[number]["id"];
export const passwordPolicies = { minimumEight: "Minimum 8 characters", uppercase: "Require uppercase letter", number: "Require number", special: "Require special character" };
export const paymentMethods = ["UPI", "Cards", "Net Banking", "Wallets"] as const;
export const gateways = [
  { name: "Razorpay", description: "Indian payments, UPI and payouts." },
  { name: "Stripe", description: "International card payments." },
  { name: "PayU", description: "Online payments for businesses." },
] as const;
export const mockLoginActivity = [
  { id: "login-1", admin: "Ananya Rao", device: "Chrome (macOS)", ip: "192.0.2.45", location: "Hyderabad, IN", timestamp: "17 Sep 2026, 10:00 AM IST" },
  { id: "login-2", admin: "Vikram Shah", device: "Safari (iPhone)", ip: "198.51.100.11", location: "Mumbai, IN", timestamp: "16 Sep 2026, 4:20 PM IST" },
];
export type AdminSettings = {
  values: Record<string, string>;
  logo: string | null;
  maintenance: boolean;
  twoFactor: boolean;
  managerOtp: boolean;
  passwordPolicy: Record<keyof typeof passwordPolicies, boolean>;
  paymentMethods: Record<typeof paymentMethods[number], boolean>;
  notifications: Record<NotificationEvent, Record<NotificationChannel, boolean>>;
  admins: SettingsAdmin[];
};
export const mockAdminSettings: AdminSettings = {
  values: { platformName: "ArenaX", supportEmail: "support@arenax.example", supportPhone: "+91 90000 00000", currency: "INR (₹)", timeZone: "GMT+5:30 India Standard Time", defaultCity: "Hyderabad", commission: "10", convenienceFee: "20", gst: "18", paymentProvider: "Razorpay", paymentMode: "Test", sessionMinutes: "30" },
  logo: null, maintenance: false, twoFactor: true, managerOtp: false,
  passwordPolicy: { minimumEight: true, uppercase: true, number: true, special: false },
  paymentMethods: { UPI: true, Cards: true, "Net Banking": true, Wallets: false },
  notifications: {
    newBooking: { Email: true, SMS: true, Push: true },
    payout: { Email: true, SMS: false, Push: false },
    approval: { Email: true, SMS: false, Push: true },
    confirmation: { Email: true, SMS: true, Push: true },
    reminder: { Email: true, SMS: false, Push: true },
    cancellation: { Email: true, SMS: true, Push: true },
  },
  admins: [
    { id: "admin-1", name: "Ananya Rao", email: "ananya@arenax.example", role: "SUPER_ADMIN", lastLogin: "2026-09-17T10:00:00+05:30", status: "ACTIVE" },
    { id: "admin-2", name: "Vikram Shah", email: "vikram@arenax.example", role: "FINANCE", lastLogin: "2026-09-16T16:20:00+05:30", status: "ACTIVE" },
    { id: "admin-3", name: "Meera Reddy", email: "meera@arenax.example", role: "SUPPORT", lastLogin: null, status: "INVITED" },
  ],
};
export function validateSettings(settings: AdminSettings): { tab: SettingsTab; message: string } | null {
  for (const [tab, fields] of Object.entries(settingsFields)) for (const field of fields as SettingsField[]) {
    const value = settings.values[field.key]?.trim() ?? "";
    const invalid = !value || (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      || (field.type === "tel" && (!/^[+\d\s()-]+$/.test(value) || value.replace(/\D/g, "").length < 10 || value.replace(/\D/g, "").length > 15))
      || (field.type === "number" && (!Number.isFinite(Number(value)) || Number(value) < (field.min ?? 0) || Number(value) > (field.max ?? Infinity) || (tab === "Security" && !Number.isInteger(Number(value)))))
      || (field.options && !field.options.includes(value));
    if (invalid) return { tab: tab as SettingsTab, message: `Enter a valid ${field.label.toLowerCase()}${field.type === "number" ? ` (${field.min}–${field.max})` : ""}.` };
  }
  return null;
}
