"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

// UI-preview session only. This is not an authentication credential.
const storageKey = "sports-booking-preview-session";
const listeners = new Set<() => void>();
let memorySession = false;
function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}
function getSession() {
  try {
    return localStorage.getItem(storageKey) === "signed-in";
  } catch {
    return memorySession;
  }
}
function writeSession(signedIn: boolean) {
  memorySession = signedIn;
  try {
    if (signedIn) localStorage.setItem(storageKey, "signed-in");
    else localStorage.removeItem(storageKey);
  } catch {
    /* Browser storage may be unavailable; retain this tab's session. */
  }
  listeners.forEach((listener) => listener());
}
const SessionContext = createContext<{
  signedIn: boolean | null;
  completePreviewLogin: () => void;
  logout: () => void;
} | null>(null);

export function SessionNavigation({ children }: { children: ReactNode }) {
  const signedIn = useSyncExternalStore(subscribe, getSession, () => false);
  const router = useRouter();

  function completePreviewLogin() {
    writeSession(true);
    router.replace("/home");
  }

  function logout() {
    writeSession(false);
    router.replace("/");
  }

  return (
    <SessionContext.Provider value={{ signedIn, completePreviewLogin, logout }}>
      {children}
    </SessionContext.Provider>
  );
}

export function usePreviewSession() {
  const session = useContext(SessionContext);
  if (!session) throw new Error("Session navigation provider is missing");
  return session;
}
