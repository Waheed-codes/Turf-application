"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { dateLabel, timeLabel } from "@/lib/booking-context";
import type { GamePassReceipt } from "@/types/game-pass";
import styles from "./game-pass.module.css";

const focus = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black";
export default function GamePass({ receipt }: { receipt: GamePassReceipt }) {
  type Phase = "printing" | "attached" | "dragging" | "tearing" | "detached";
  const [phase, setPhase] = useState<Phase>("printing");
  const [pull, setPull] = useState(0);
  const [notice, setNotice] = useState("");
  const start = useRef<number | null>(null);
  const tearing = useRef(false);
  const details = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = setTimeout(() => setPhase("attached"), reduced ? 0 : 2900);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (phase !== "tearing") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = setTimeout(() => setPhase("detached"), reduced ? 0 : 420);
    return () => clearTimeout(timer);
  }, [phase]);
  function collect() {
    if (tearing.current || (phase !== "attached" && phase !== "dragging")) return;
    tearing.current = true;
    start.current = null;
    setPhase("tearing");
  }
  function release() {
    start.current = null;
    if (!tearing.current && phase === "dragging") { setPull(0); setPhase("attached"); }
  }
  async function share() {
    const text = [`ArenaX Game Pass${receipt.mock ? " (demo)" : ""}`, receipt.venue.name, `${receipt.context.sport} · ${receipt.areaName}`, dateLabel(receipt.context.date), ...receipt.slots.map((slot) => `${timeLabel(slot.start)} – ${timeLabel(slot.end)}`), receipt.id].join("\n");
    try {
      if (navigator.share) { await navigator.share({ title: "ArenaX Game Pass", text }); return; }
      if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(text); setNotice("Pass details copied."); return; }
    } catch (error) { if (error instanceof Error && error.name === "AbortError") return; }
    setNotice("Sharing is unavailable in this browser. Your pass details are shown on the ticket.");
  }
  const separated = phase === "tearing" || phase === "detached";
  const amount = receipt.amountPaid.toLocaleString("en-IN");
  return <main className="min-h-svh bg-neutral-50 px-6 pt-8 pb-[calc(3rem+env(safe-area-inset-bottom))] font-sans text-neutral-950">
    <div className="mx-auto w-full max-w-sm">
      <h1 className="sr-only">ArenaX Game Pass</h1>
      <div aria-label="Ticket printer" className={`relative z-10 rounded-t-3xl rounded-b-xl border border-neutral-800 bg-neutral-950 px-6 pt-6 pb-4 text-white shadow-lg ${styles.machine} ${separated ? styles.quiet : ""}`}>
        <p className="text-center text-[0.625rem] font-semibold tracking-[.3em] text-neutral-400">ARENA X</p>
        <div className="mt-4 rounded-xl border border-neutral-600 bg-neutral-900 p-4 text-center"><p className="text-[0.625rem] font-semibold tracking-widest text-neutral-300">PAYMENT RECEIVED</p><p className="mt-2 text-2xl font-bold">₹{amount}</p><span aria-hidden="true" className="mt-1 block text-xl">✓</span></div>
        <div aria-hidden="true" className="mt-5 h-3 rounded-full border border-neutral-700 bg-black shadow-inner" />
      </div>
      <div className={`relative px-3 pt-2 ${phase === "printing" ? "overflow-hidden" : "overflow-visible"}`} style={{ paddingBottom: separated ? 56 : 16 }}>
        <div aria-hidden="true" className={`absolute inset-x-3 top-0 border-x border-neutral-200 bg-white ${styles.connection} ${separated ? styles.broken : ""}`} style={{ height: 10 + pull, transition: phase === "dragging" ? "none" : "height 240ms ease-out" }} />
        <div className={phase === "printing" ? styles.paper : undefined}>
          <article aria-label="Game Pass ticket" data-phase={phase}
            onPointerDown={(event) => {
              if (phase !== "attached" || (event.target as HTMLElement).closest("button")) return;
              start.current = event.clientY;
              setPhase("dragging");
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => {
              if (start.current === null || tearing.current) return;
              const distance = Math.max(0, event.clientY - start.current);
              setPull(Math.min(64, distance * 0.55));
              if (distance >= 96) collect();
            }}
            onPointerUp={release} onPointerCancel={release}
            className={`relative rounded-b-xl border border-neutral-200 bg-white px-5 pt-6 pb-5 shadow-md ${styles.ticket} ${phase === "attached" || phase === "dragging" ? "touch-none select-none cursor-grab active:cursor-grabbing" : ""} ${phase === "tearing" ? styles.tearing : ""}`}
            style={{ "--tear-from": `${pull}px`, transform: `translateY(${separated ? 40 : pull}px)`, transition: phase === "dragging" || phase === "tearing" ? "none" : "transform 260ms cubic-bezier(.2,.8,.2,1)" } as CSSProperties}>
            <div aria-hidden="true" className={`absolute inset-x-0 top-0 border-t-2 border-dashed border-neutral-400 ${separated ? styles.tornEdge : ""}`} />
            <div className="border-b border-dashed border-neutral-300 pb-4"><p className="text-[0.625rem] font-semibold tracking-[.25em] text-neutral-500">ARENA X · GAME PASS</p><p className="mt-4 text-xs font-bold tracking-wider uppercase">{receipt.context.sport}</p><h2 className="mt-2 text-xl font-bold leading-7 [overflow-wrap:anywhere]">{receipt.venue.name}</h2><p className="mt-1 text-xs leading-5 text-neutral-500">{receipt.venue.area}, {receipt.venue.city}</p></div>
            <p className="mt-4 text-sm font-semibold">{dateLabel(receipt.context.date)}</p>
            <ul className="mt-2 space-y-1 text-sm">{receipt.slots.map((slot) => <li key={slot.id}>{timeLabel(slot.start)} – {timeLabel(slot.end)}</li>)}</ul>
            <p className="mt-3 text-xs font-semibold uppercase">{receipt.areaName}</p>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-neutral-300 pt-4"><span className="rounded border border-neutral-400 px-2 py-1 text-[0.5625rem] font-bold tracking-wide">BOOKING CONFIRMED</span><p className="text-lg font-bold">₹{amount} <span className="text-[0.625rem]">PAID</span></p></div>
            <p className="mt-4 break-all font-mono text-[0.5625rem] leading-4 text-neutral-500">{receipt.id}</p>
            {(phase === "attached" || phase === "dragging") && <div className="mt-5 text-center"><p className="text-[0.625rem] font-semibold tracking-widest">PULL TO COLLECT</p><button type="button" onClick={collect} className={`mt-1 min-h-11 rounded-md px-4 text-xs text-neutral-500 underline ${focus}`}>Collect pass</button></div>}
          </article>
        </div>
      </div>
      <p role="status" className="sr-only">{phase === "printing" ? "Payment received. Printing your Game Pass." : phase === "attached" || phase === "dragging" ? "Pull down on your ticket to collect it, or use Collect pass." : phase === "tearing" ? "Ticket separating." : "Game Pass collected."}</p>
      {phase === "detached" && <div className="mt-4 space-y-3"><button type="button" onClick={() => details.current?.showModal()} className={`min-h-12 w-full rounded-full bg-black px-5 text-sm font-semibold text-white ${focus}`}>VIEW BOOKING</button><button type="button" onClick={share} className={`min-h-11 w-full rounded-full text-sm font-semibold ${focus}`}>Share Pass</button><Link href="/home" className={`flex min-h-11 items-center justify-center rounded-full text-sm font-semibold ${focus}`}>Back to Home</Link><p role="status" className="text-center text-xs text-neutral-500">{notice}</p></div>}
    </div>
    <dialog ref={details} aria-labelledby="booking-details-title" className="fixed inset-0 m-auto w-[calc(100%-3rem)] max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-950 shadow-xl backdrop:bg-black/30"><h2 id="booking-details-title" className="text-lg font-semibold">Booking details</h2><p className="mt-3 text-sm leading-6 text-neutral-500">Your booking details view will be available here soon. Your Game Pass has the selected venue, court and times.</p><form method="dialog"><button className={`mt-5 min-h-11 w-full rounded-full border border-neutral-300 text-sm font-semibold ${focus}`}>GOT IT</button></form></dialog>
  </main>;
}
