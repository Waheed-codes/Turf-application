import Link from "next/link";

const items = [
  { label: "Home", href: "/manager/dashboard", available: true, path: "M3 12 12 4l9 8M5 10v11h5v-7h4v7h5V10" },
  { label: "Bookings", href: "/manager/bookings", available: true, path: "M5 5h14v16H5V5Zm3-2v4m8-4v4m-9 8 3 3 6-6" },
  { label: "Analytics", href: "/manager/analytics", available: true, path: "M5 20V11m7 9V4m7 16V8" },
  { label: "Settings", href: "/manager/settings", available: true, path: "m9 3-1 3-3 1-2 3 2 2-1 4 3 2 2-1 3 4 3-2v-3l4-1 2-3-3-2V6l-4-1-2-2H9ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0" },
] as const;

export function ManagerBottomNav({ active }: { active: "Home" | "Bookings" | "Analytics" | "Settings" }) {
  return <nav aria-label="Manager navigation" className="fixed inset-x-0 bottom-0 z-10 mx-auto grid w-full max-w-md grid-cols-4 border-t border-neutral-200 bg-white px-2 pt-2 pb-[max(.5rem,env(safe-area-inset-bottom))]">
    {items.map((item) => {
      const content = <><svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={item.path} /></svg>{item.label}</>;
      const classes = `flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg text-[10px] focus-visible:outline-2 focus-visible:outline-neutral-900 ${active === item.label ? "font-semibold text-neutral-950" : "text-neutral-400"}`;
      return item.available ? <Link key={item.label} href={item.href} aria-current={active === item.label ? "page" : undefined} className={classes}>{content}</Link> : <button key={item.label} type="button" disabled aria-label={`${item.label} (coming soon)`} title="Coming soon" className={classes}>{content}</button>;
    })}
  </nav>;
}
