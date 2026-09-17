"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";

export interface SessionUser {
  _id: string;
  name: string;
  mobile: string;
  email?: string;
  role: "user" | "manager" | "admin";
  venueId?: string;
  whatsappUpdates: boolean;
  offers: boolean;
}

interface SessionContextType {
  user: SessionUser | null;
  signedIn: boolean;
  loading: boolean;
  refreshSession: () => Promise<SessionUser | null>;
  completeLogin: () => Promise<void>;
  // Kept as an alias for completeLogin for compatibility
  completePreviewLogin: () => void;
  logout: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | null>(null);

const AUTH_PAGES = ["/login", "/signup", "/otp"];
const PROTECTED_PAGES = ["/home"];

export function SessionNavigation({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const refreshSession = useCallback(async (): Promise<SessionUser | null> => {
    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (!response.ok) {
        setUser(null);
        return null;
      }

      const data = await response.json();
      if (data.success && data.user) {
        setUser(data.user);
        return data.user;
      }

      setUser(null);
      return null;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch session on initial mount
  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  // Route protection
  useEffect(() => {
    if (loading) return;

    const isAuthPage = AUTH_PAGES.includes(pathname);
    const isProtectedPage = PROTECTED_PAGES.some((prefix) =>
      pathname.startsWith(prefix),
    );

    // If authenticated and visiting an auth page (login/signup/otp), redirect to home
    if (user && isAuthPage) {
      router.replace("/home");
    }

    // If unauthenticated and visiting a protected page (e.g. /home), redirect to login
    if (!user && isProtectedPage) {
      router.replace("/login");
    }
  }, [user, loading, pathname, router]);

  async function completeLogin() {
    await refreshSession();
    router.replace("/home");
  }

  function completePreviewLogin() {
    void completeLogin();
  }

  async function logout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout request error:", error);
    } finally {
      setUser(null);
      router.replace("/");
    }
  }

  const isAuthPage = AUTH_PAGES.includes(pathname);
  const isProtectedPage = PROTECTED_PAGES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  // Avoid flash of content while checking initial session on protected or auth routes
  if (loading && (isAuthPage || isProtectedPage)) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-white font-sans text-sm text-neutral-500">
        Loading...
      </div>
    );
  }

  return (
    <SessionContext.Provider
      value={{
        user,
        signedIn: Boolean(user),
        loading,
        refreshSession,
        completeLogin,
        completePreviewLogin,
        logout,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionNavigation provider");
  }
  return context;
}

// Retained for backward compatibility with existing components
export function usePreviewSession() {
  return useSession();
}
