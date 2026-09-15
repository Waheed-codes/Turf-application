"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";

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
  const signedIn = useSyncExternalStore(subscribe, getSession, () => null);
  const pathname = usePathname();
  const router = useRouter();
  const continueAfterLogin = useRef(false);
  const authPage = ["/login", "/signup", "/otp"].includes(pathname);

  useEffect(() => {
    if (signedIn && pathname === "/" && continueAfterLogin.current) {
      continueAfterLogin.current = false;
      router.push("/home");
    } else if (signedIn && authPage) {
      router.replace("/");
    }
  }, [signedIn, pathname, authPage, router]);

  function completePreviewLogin() {
    continueAfterLogin.current = true;
    writeSession(true);
    // All auth steps replace the same entry. Restore it to the landing before
    // pushing Home, giving Back a safe destination even for direct OTP visits.
    router.replace("/");
  }

  function logout() {
    continueAfterLogin.current = false;
    writeSession(false);
    router.replace("/");
  }

  return (
    <SessionContext.Provider value={{ signedIn, completePreviewLogin, logout }}>
      {signedIn === null || (signedIn && authPage) ? null : children}
    </SessionContext.Provider>
  );
}

export function usePreviewSession() {
  const session = useContext(SessionContext);
  if (!session) throw new Error("Session navigation provider is missing");
  return session;
}
