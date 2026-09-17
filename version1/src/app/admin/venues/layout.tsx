import type { ReactNode } from "react";
import { AdminVenuesProvider } from "@/components/admin/admin-venues-provider";

export default function VenuesLayout({ children }: { children: ReactNode }) {
  return <AdminVenuesProvider>{children}</AdminVenuesProvider>;
}
