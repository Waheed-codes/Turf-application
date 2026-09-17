"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminIcon, type AdminIconName } from "./admin-icon";

const items: { label: string; slug: string; icon: AdminIconName }[] = [
  { label: "Dashboard", slug: "dashboard", icon: "dashboard" },
  { label: "Managers", slug: "managers", icon: "managers" },
  { label: "Venues", slug: "venues", icon: "venues" },
  { label: "Bookings", slug: "bookings", icon: "bookings" },
  { label: "Areas", slug: "areas", icon: "areas" },
  { label: "Sports/Services", slug: "sports", icon: "sports" },
  { label: "Payments", slug: "payments", icon: "payments" },
  { label: "Users", slug: "users", icon: "users" },
  { label: "Settings", slug: "settings", icon: "settings" },
];

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return <aside className="flex h-full w-[260px] flex-col bg-neutral-950 text-white">
    <Link href="/admin/dashboard" onClick={onNavigate} aria-label="ArenaX Admin dashboard" className="flex h-[72px] shrink-0 items-center gap-3 border-b border-white/10 px-6 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"><span aria-hidden="true" className="flex size-8 items-center justify-center rounded-lg bg-white text-lg font-black text-neutral-950">A</span><span className="text-xl font-bold tracking-tight">Arena<span className="text-neutral-400">X</span></span></Link>
    <nav aria-label="Admin navigation" className="overflow-y-auto px-3 py-5"><p className="mb-2 px-3 text-[10px] font-medium tracking-widest text-neutral-500">MENU</p><ul className="space-y-1">{items.map(({ label, slug, icon }) => {
      const href = `/admin/${slug}`;
      const active = pathname === href || pathname.startsWith(`${href}/`);
      return <li key={slug}><Link href={href} onClick={onNavigate} aria-current={active ? "page" : undefined} className={`flex min-h-10 items-center gap-4 rounded-lg border px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-white ${active ? "border-neutral-700 bg-neutral-800 font-medium text-white" : "border-transparent text-neutral-400 hover:bg-neutral-900 hover:text-white"}`}><AdminIcon name={icon} />{label}</Link></li>;
    })}</ul></nav>
  </aside>;
}
