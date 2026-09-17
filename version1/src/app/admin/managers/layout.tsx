import type { ReactNode } from "react";
import { AdminManagersProvider } from "@/components/admin/admin-managers-provider";

export default function ManagersLayout({ children }: { children: ReactNode }) {
  return <AdminManagersProvider>{children}</AdminManagersProvider>;
}
