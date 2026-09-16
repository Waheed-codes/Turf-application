import type { ReactNode } from "react";
import { ManagerOnboardingProvider } from "@/components/manager/manager-onboarding-provider";

export default function ManagerOnboardingLayout({ children }: { children: ReactNode }) {
  return <ManagerOnboardingProvider>{children}</ManagerOnboardingProvider>;
}
