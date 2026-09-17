"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminIcon } from "@/components/admin/admin-icon";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const navigation = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => { if (query.matches) navigation.current?.close(); };
    query.addEventListener("change", closeOnDesktop);
    return () => query.removeEventListener("change", closeOnDesktop);
  }, []);
  return <div className="min-h-dvh bg-neutral-100/80 font-sans text-neutral-900">
    <a href="#admin-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-white focus:p-3 focus:text-black">Skip to content</a>
    <div className="fixed inset-y-0 left-0 z-30 hidden lg:block"><AdminSidebar /></div>
    <dialog ref={navigation} aria-label="Admin navigation drawer" className="fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-[260px] max-w-[85vw] border-0 bg-neutral-950 p-0 text-white backdrop:bg-black/40"><button type="button" aria-label="Close Admin navigation" onClick={() => navigation.current?.close()} className="absolute top-5 right-3 z-10 flex size-8 items-center justify-center rounded-md bg-neutral-950 focus-visible:outline-2"><AdminIcon name="close" /></button><AdminSidebar onNavigate={() => navigation.current?.close()} /></dialog>
    <div className="min-w-0 lg:pl-[260px]"><AdminHeader onOpenNavigation={() => navigation.current?.showModal()} /><main id="admin-content" tabIndex={-1} className="mx-auto max-w-[1800px] px-4 pt-8 pb-24 sm:px-8">{children}</main></div>
  </div>;
}
