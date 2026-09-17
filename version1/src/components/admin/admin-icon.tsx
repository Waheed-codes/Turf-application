const paths = {
  back: "M20 12H4m6-6-6 6 6 6",
  check: "m5 12 4 4L19 6",
  refresh: "M20 7V3m0 4h-4M4 17v4m0-4h4M5 8a8 8 0 0 1 14-3l1 2M4 17l1 2a8 8 0 0 0 14-3",
  more: "M12 4v.01M12 12v.01M12 20v.01",
  copy: "M9 8h11v13H9V8Zm7-3V2H4v14h2",
  spark: "m12 3 2 6 6 3-6 2-2 7-2-7-7-2 7-3 2-6ZM20 2v4m-2-2h4",
  dashboard: "M3 3h7v7H3V3Zm11 0h7v7h-7V3ZM3 14h7v7H3v-7Zm11 0h7v7h-7v-7Z",
  managers: "M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM5 21v-3a7 7 0 0 1 14 0v3M9 16v5m6-5v5",
  venues: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-2 0c-4 6 8 12 4 18M4 8l16 8M4 16l16-8",
  bookings: "M5 5h14v16H5V5Zm3-2v4m8-4v4M5 10h14m-11 5 3 3 5-5",
  areas: "M4 4h4v4H4V4Zm12 0h4v4h-4V4ZM4 16h4v4H4v-4Zm12 0h4v4h-4v-4ZM8 6h8M6 8v8m12-8v8M8 18h8",
  sports: "M3 18q3-3 6 0t6 0 6 0M3 22q3-3 6 0t6 0 6 0M7 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm2 10 5-5 6 4m-6-4 3-5h4",
  payments: "M3 5h18v14H3V5Zm0 5h18M6 15h4",
  users: "M9 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM3 21v-4a6 6 0 0 1 12 0v4M17 4a3 3 0 0 1 0 6m1 3a5 5 0 0 1 3 5v3",
  settings: "m9 3-1 3-3 1-2 3 2 2-1 4 3 2 2-1 3 4 3-2v-3l4-1 2-3-3-2V6l-4-1-2-2H9ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  search: "M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm5 12 6 6",
  bell: "M5 17h14l-2-3V9a5 5 0 0 0-10 0v5l-2 3Zm5 3h4",
  chevron: "m7 10 5 5 5-5",
  export: "M12 3v12m-4-4 4 4 4-4M4 16v5h16v-5",
  plus: "M12 5v14M5 12h14",
  menu: "M3 6h18M3 12h18M3 18h18",
  close: "m6 6 12 12M6 18 18 6",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4v5l3 2",
  info: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 7v7m0-10v.1",
  arrow: "M12 19V5m-5 5 5-5 5 5",
} as const;
export type AdminIconName = keyof typeof paths;
export function AdminIcon({ name, className = "size-4" }: { name: AdminIconName; className?: string }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={`${className} shrink-0`}><path d={paths[name]} /></svg>;
}
