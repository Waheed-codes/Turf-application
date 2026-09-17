"use client";

import { useSearchParams } from "next/navigation";

export function useSetupEdit() {
  const params = useSearchParams();
  const settingsEdit = params.get("mode") === "edit" && params.get("from") === "settings";
  return { settingsEdit, destination: (onboardingPath: string) => settingsEdit ? "/manager/settings" : onboardingPath };
}
