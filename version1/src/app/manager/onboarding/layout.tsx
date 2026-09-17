import { Suspense, type ReactNode } from "react";

export default function ManagerOnboardingLayout({ children }: { children: ReactNode }) {
  return <Suspense fallback={<p className="p-6">Loading venue setup…</p>}>{children}</Suspense>;
}
