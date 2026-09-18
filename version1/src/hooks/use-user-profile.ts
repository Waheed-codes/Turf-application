"use client";

import { useSyncExternalStore } from "react";
import { mockUser } from "@/data/mockUser";

export type PersonalDetails = Pick<typeof mockUser, "name" | "email" | "dateOfBirth" | "gender" | "city">;
let user = mockUser;
const listeners = new Set<() => void>();
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
// In-memory frontend edits only: refreshing resets to the mock profile.
export function useUserProfile() {
  const profile = useSyncExternalStore(subscribe, () => user, () => mockUser);
  return {
    user: profile,
    saveDetails(details: PersonalDetails) {
      user = { ...user, name: details.name, email: details.email, dateOfBirth: details.dateOfBirth, gender: details.gender, city: details.city };
      listeners.forEach((listener) => listener());
    },
  };
}
