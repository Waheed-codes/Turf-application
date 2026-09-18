import { mockAdminVenues } from "./mockAdminVenues";
import { mockAdminSettings } from "./mockAdminSettings";

export type Settlement = {
  id: string; managerId: string; venueId: string; managerName: string; venueName: string;
  totalBookings: number; grossAmount: number; commissionPercentage: number;
  bankLast4: string; settlementDate: string; status: "PENDING" | "PAID";
  payoutDate: string | null; referenceId: string | null;
};
// Monetary calculations use integer paise. Percentages are settlement snapshots,
// initialized from the same mock default as Settings, rather than live preferences.
export function settlementAmounts(grossAmount: number, commissionPercentage: number) {
  const grossPaise = Math.round(grossAmount * 100);
  const commissionPaise = Math.round(grossPaise * commissionPercentage / 100);
  return { commissionAmount: commissionPaise / 100, netPayable: (grossPaise - commissionPaise) / 100 };
}
const defaultCommission = Number(mockAdminSettings.values.commission);
const amounts = [82000, 64500, 112000, 22500, 31000, 48750, 56200, 38750, 91000, 24500, 42000, 36750];
// Historical settlement snapshots are separate from the limited booking preview.
// Stable manager/venue IDs allow future replacement by aggregated booking records.
export const mockAdminSettlements: Settlement[] = mockAdminVenues.flatMap((venue, index) => [0, 1].map(period => ({
  id: `ST-${202600 + index * 2 + period}`, managerId: venue.manager.id, venueId: venue.id,
  managerName: venue.manager.name, venueName: venue.name,
  totalBookings: [124, 86, 210, 45, 62, 75, 94, 58, 142, 41, 68, 54][index] + period * 5,
  grossAmount: amounts[index] + period * 2500, commissionPercentage: index === 2 ? 12 : defaultCommission,
  // Only a synthetic fixture suffix is retained, never a full account number.
  bankLast4: venue.banking?.accountLast4 ?? "4820",
  settlementDate: `2026-09-${period ? "01" : String(10 + index % 7).padStart(2, "0")}`,
  status: period ? "PAID" : "PENDING",
  payoutDate: period ? "2026-09-03" : null,
  referenceId: period ? `DEMO-PAYOUT-${202600 + index * 2 + period}` : null,
})));
export function settlementSummary(settlements: Settlement[]) {
  return {
    revenue: settlements.reduce((sum, item) => sum + Math.round(item.grossAmount * 100), 0) / 100,
    commission: settlements.reduce((sum, item) => sum + Math.round(settlementAmounts(item.grossAmount, item.commissionPercentage).commissionAmount * 100), 0) / 100,
    pending: settlements.filter(item => item.status === "PENDING").reduce((sum, item) => sum + Math.round(settlementAmounts(item.grossAmount, item.commissionPercentage).netPayable * 100), 0) / 100,
    waiting: new Set(settlements.filter(item => item.status === "PENDING").map(item => item.managerId)).size,
  };
}
export function simulatePayout(item: Settlement, date: string): Settlement {
  return item.status === "PAID" ? item : { ...item, status: "PAID", payoutDate: date, referenceId: `DEMO-PAYOUT-${item.id}` };
}
export function settlementsCsv(settlements: Settlement[]) {
  const escape = (value: string | number) => { const text = String(value); return `"${(/^[=+@\-\t\r]/.test(text) ? "'" + text : text).replaceAll('"', '""')}"`; };
  return [["Settlement ID", "Manager", "Venue", "Bookings", "Gross (INR)", "Commission (%)", "Commission (INR)", "Net (INR)", "Bank Account", "Settlement Date", "Payout Date", "Reference", "Status"], ...settlements.map(item => {
    const amounts = settlementAmounts(item.grossAmount, item.commissionPercentage);
    return [item.id, item.managerName, item.venueName, item.totalBookings, item.grossAmount, item.commissionPercentage, amounts.commissionAmount, amounts.netPayable, `•••• ${item.bankLast4}`, item.settlementDate, item.payoutDate ?? "", item.referenceId ?? "", item.status];
  })].map(row => row.map(escape).join(",")).join("\r\n");
}
