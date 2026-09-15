"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

const IdentifierContext = createContext<{
  identifier: string;
  setIdentifier: (value: string) => void;
} | null>(null);

export function LoginIdentifierProvider({ children }: { children: ReactNode }) {
  const [identifier, setIdentifier] = useState("");
  return <IdentifierContext.Provider value={{ identifier, setIdentifier }}>{children}</IdentifierContext.Provider>;
}

export function useLoginIdentifier() {
  const context = useContext(IdentifierContext);
  if (!context) throw new Error("Login identifier provider is missing");
  return context;
}
