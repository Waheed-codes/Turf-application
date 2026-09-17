"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { mockAdminVenues, type AdminVenue } from "@/data/admin/mockAdminVenues";

type AdminVenuesContextValue = {
  venues: AdminVenue[];
  reviewVenue: (id: string, status: "LIVE" | "REJECTED") => void;
};

const AdminVenuesContext = createContext<AdminVenuesContextValue | null>(null);

export function AdminVenuesProvider({ children }: { children: ReactNode }) {
  const [venues, setVenues] = useState<AdminVenue[]>(mockAdminVenues);

  function reviewVenue(id: string, status: "LIVE" | "REJECTED") {
    setVenues((current) => current.map((venue) => (
      venue.id === id && venue.status === "PENDING_APPROVAL" ? { ...venue, status } : venue
    )));
  }

  // The shared route layout preserves reviews while moving between the list
  // and detail pages. Refreshing starts a new preview; no records are stored.
  return <AdminVenuesContext.Provider value={{ venues, reviewVenue }}>{children}</AdminVenuesContext.Provider>;
}

export function useAdminVenues() {
  const context = useContext(AdminVenuesContext);
  if (!context) throw new Error("Admin Venues provider is missing.");
  return context;
}
