import { notFound } from "next/navigation";
import { AdminVenueDetails } from "@/components/admin/admin-venue-details";
import { mockAdminVenues } from "@/data/admin/mockAdminVenues";

export default async function AdminVenuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!mockAdminVenues.some((venue) => venue.id === id)) notFound();

  return <AdminVenueDetails key={id} venueId={id} />;
}
