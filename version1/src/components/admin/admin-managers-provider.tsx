"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { mockManagers, NEW_MANAGER_STATUS, type AdminManager, type AdminManagerStatus } from "@/data/admin/mockAdmin";

type ManagerContext = {
  managers: AdminManager[];
  notice: string;
  dismissNotice: () => void;
  addManager: (phone: string, venueName: string) => boolean;
  setStatus: (id: string, status: AdminManagerStatus) => void;
};
const Context = createContext<ManagerContext | null>(null);
const digits = (phone: string) => phone.replace(/\D/g, "");

export function AdminManagersProvider({ children }: { children: ReactNode }) {
  const [managers, setManagers] = useState<AdminManager[]>(mockManagers);
  const [notice, setNotice] = useState("");

  function addManager(phone: string, venueName: string) {
    if (managers.some((manager) => digits(manager.phone) === digits(phone))) return false;
    // Credentials never enter this collection. Name/email are completed later.
    const manager: AdminManager = {
      id: crypto.randomUUID(), name: "New Manager", email: "", phone,
      venueName: venueName.trim(), area: "Not assigned", status: NEW_MANAGER_STATUS,
      dateJoined: new Date().toISOString().slice(0, 10),
    };
    setManagers((current) => [manager, ...current]);
    setNotice(`Manager for ${manager.venueName} created in this preview. Status: Pending. No real account or credentials were created.`);
    return true;
  }

  function setStatus(id: string, status: AdminManagerStatus) {
    setManagers((current) => current.map((manager) => manager.id === id ? { ...manager, status } : manager));
    setNotice(`Manager status changed to ${status.toLowerCase()} in this preview.`);
  }

  return <Context.Provider value={{ managers, notice, dismissNotice: () => setNotice(""), addManager, setStatus }}>{children}</Context.Provider>;
}

export function useAdminManagers() {
  const context = useContext(Context);
  if (!context) throw new Error("Admin Managers provider is missing.");
  return context;
}
