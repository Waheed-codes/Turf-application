import { venueStatusLabels, type AdminVenueStatus } from "@/data/admin/mockAdminVenues";

const styles: Record<AdminVenueStatus, string> = {
  LIVE: "border-neutral-900 bg-neutral-900 text-white",
  PENDING_APPROVAL: "border-neutral-300 bg-neutral-100 text-neutral-800",
  REJECTED: "border-neutral-700 bg-white text-neutral-800",
};
export function AdminVenueStatusBadge({ status }: { status: AdminVenueStatus }) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${styles[status]}`}>{venueStatusLabels[status]}</span>;
}
