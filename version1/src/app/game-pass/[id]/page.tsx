"use client";

import Link from "next/link";
import { use, useMemo, useSyncExternalStore } from "react";
import GamePass from "@/components/booking/game-pass";
import { readDemoPass } from "@/lib/mock-payment";
import type { GamePassReceipt } from "@/types/game-pass";

const subscribe = () => () => {};
export default function GamePassPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const data = useSyncExternalStore(subscribe, () => readDemoPass(id), () => null);
  const receipt = useMemo(() => {
    try {
      const value = data ? JSON.parse(data) as GamePassReceipt : null;
      return value?.id === id && value.mock && value.context && value.venue && Array.isArray(value.slots) && value.slots.length && Number.isFinite(value.amountPaid) ? value : null;
    } catch { return null; }
  }, [data, id]);
  if (!receipt) return <main className="min-h-svh bg-neutral-50 px-6 py-12 font-sans text-neutral-950"><div className="mx-auto max-w-sm"><h1 className="text-2xl font-semibold">Game Pass unavailable</h1><p className="mt-3 text-sm text-neutral-500">Open your Game Pass from the booking confirmation in this browser session.</p><Link href="/home" className="mt-6 inline-flex min-h-11 items-center font-semibold underline">Back to Home</Link></div></main>;
  return <GamePass key={receipt.id} receipt={receipt} />;
}
