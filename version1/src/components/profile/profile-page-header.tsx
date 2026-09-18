import Link from "next/link";

export default function ProfilePageHeader({ title }: { title: string }) {
  return <header className="flex items-center gap-3"><Link href="/profile" aria-label="Back to Profile" className="flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-5"><path d="M19 12H5m7-7-7 7 7 7" /></svg></Link><h1 className="text-xl font-semibold tracking-tight">{title}</h1></header>;
}
