"use client";

import Link from "next/link";
import HomeIcon from "@/app/home/home-icon";

const items = [
  { label: "Home", icon: "home", href: "/home" },
  { label: "Search", icon: "search", href: "/search" },
  { label: "Favorites", icon: "heart", href: "/favorites" },
  { label: "Recent Bookings", icon: "bookings", href: "/bookings" },
] as const;

export default function CustomerNavigation({ active }: {
  active: "/home" | "/search" | "/favorites" | "/bookings";
  onUnavailable: (message: string) => void;
}) {
  return (
    <nav aria-label="Customer navigation" className="fixed inset-x-6 bottom-[calc(1rem+env(safe-area-inset-bottom))] mx-auto flex max-w-sm items-center justify-between rounded-full border border-neutral-100 bg-white p-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
      {items.map((item) => {
        const selected = item.href === active;
        const className = `flex min-h-11 w-14 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black ${selected ? "bg-neutral-950 text-white" : "text-neutral-500 hover:bg-neutral-100"}`;
        return (
          <Link key={item.label} href={item.href} aria-label={item.label} title={item.label} aria-current={selected ? "page" : undefined} className={className}><HomeIcon name={item.icon} /></Link>
        );
      })}
    </nav>
  );
}
