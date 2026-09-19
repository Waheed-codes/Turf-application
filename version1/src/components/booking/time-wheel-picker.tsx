"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import HomeIcon from "@/app/home/home-icon";
import styles from "./time-wheel-picker.module.css";

const rowHeight = 48;
export function validHours(date: string, after: string | undefined, kind: "start" | "end", now = new Date()) {
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  if (!date || date < today) return [];
  const earliest = date === today ? now.getHours() + (now.getMinutes() || now.getSeconds() || now.getMilliseconds() ? 1 : 0) : 0;
  return Array.from({ length: 24 }, (_, hour) => `${String(hour).padStart(2, "0")}:00`).filter((time) => Number(time.slice(0, 2)) >= earliest && (kind !== "start" || time < "23:00") && (!after || time > after));
}
function label(value: string) {
  const hour = Number(value.slice(0, 2));
  return `${String(hour % 12 || 12).padStart(2, "0")}:00 ${hour >= 12 ? "PM" : "AM"}`;
}
type Props = { value: string; date: string; kind: "start" | "end"; after?: string; onChange: (value: string) => void };
type OpenWheel = { top: number; left: number; width: number; options: string[]; initial: number };

export default function TimeWheelPicker(props: Props) {
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState<OpenWheel | null>(null);
  const id = useId();
  const title = props.kind === "start" ? "Start time" : "End time";
  return <div className="relative min-w-0 flex-1">
    <button ref={trigger} type="button" aria-label={title} aria-haspopup="listbox" aria-expanded={!!open} aria-controls={open ? id : undefined} onClick={() => {
      const options = validHours(props.date, props.after, props.kind);
      const element = trigger.current!;
      const before = element.getBoundingClientRect();
      if (before.top < 120 || before.bottom > window.innerHeight - 120) element.scrollIntoView({ block: "center", behavior: "instant" });
      const rect = element.getBoundingClientRect();
      const initial = Math.max(0, options.indexOf(props.value));
      setOpen({ top: rect.top + rect.height / 2 - 120, left: rect.left, width: rect.width, options, initial });
    }} className={`min-h-12 w-full rounded-full border ${props.value ? "border-neutral-950" : "border-neutral-300"} bg-white py-2.5 pl-4 pr-8 text-left text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black`}>
      {props.value ? label(props.value) : "0:00"}
      <HomeIcon name="chevron" className="pointer-events-none absolute top-1/2 right-3 size-3 -translate-y-1/2 rotate-90 text-neutral-400" />
    </button>
    {open && createPortal(<Wheel {...props} geometry={open} title={title} id={id} onClose={() => { setOpen(null); trigger.current?.focus({ preventScroll: true }); }} />, document.body)}
  </div>;
}

function Wheel({ geometry, title, id, onClose, ...props }: Props & { geometry: OpenWheel; title: string; id: string; onClose: () => void }) {
  const list = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(geometry.initial);
  const [closing, setClosing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selected = useRef(geometry.initial);
  const active = Math.round(position);
  useLayoutEffect(() => {
    if (list.current) { list.current.scrollTop = geometry.initial * rowHeight; list.current.focus({ preventScroll: true }); }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [geometry.initial]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); if (closeTimer.current) clearTimeout(closeTimer.current); }, []);
  function commit(index: number) {
    const value = geometry.options[index];
    if (value && validHours(props.date, props.after, props.kind).includes(value)) props.onChange(value);
  }
  function close() {
    if (closing) return;
    if (timer.current) clearTimeout(timer.current);
    commit(selected.current);
    setClosing(true);
    closeTimer.current = setTimeout(onClose, 300);
  }
  function scrollTo(index: number) {
    const next = Math.max(0, Math.min(geometry.options.length - 1, index));
    list.current?.scrollTo({ top: next * rowHeight, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  return <div className="fixed inset-0 z-[100] font-sans text-neutral-950" onKeyDown={(event) => {
    if (event.key === "Escape" || event.key === "Tab") { event.preventDefault(); close(); }
  }}>
    <div className="absolute inset-0 touch-none" onPointerDown={close} onWheel={(event) => event.preventDefault()} />
    <div className={`absolute h-60 overflow-hidden rounded-3xl ${styles.surface} ${closing ? styles.closing : styles.wheel}`} style={{ top: geometry.top, left: geometry.left, width: geometry.width }}>
      <div aria-hidden="true" className={`pointer-events-none absolute inset-x-1 top-24 h-12 rounded-full ${styles.selection}`} />
      {geometry.options.length ? <div ref={list} id={id} role="listbox" aria-label={title} aria-activedescendant={`${id}-${active}`} tabIndex={0} className="relative h-full touch-pan-y snap-y snap-mandatory overflow-y-auto overscroll-contain py-24 outline-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden" onKeyDown={(event) => {
        if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) { event.preventDefault(); scrollTo(event.key === "Home" ? 0 : event.key === "End" ? geometry.options.length - 1 : selected.current + (event.key === "ArrowDown" ? 1 : -1)); }
        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); close(); }
      }} onScroll={(event) => {
        const next = event.currentTarget.scrollTop / rowHeight;
        setPosition(next);
        selected.current = Math.max(0, Math.min(geometry.options.length - 1, Math.round(next)));
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          commit(selected.current);
          if (list.current && Math.abs(list.current.scrollTop - selected.current * rowHeight) > 0.5) scrollTo(selected.current);
        }, 140);
      }}>
        {geometry.options.map((value, index) => {
          const distance = Math.abs(index - position);
          return <div id={`${id}-${index}`} key={value} role="option" aria-selected={index === active} onClick={() => { if (index === selected.current) close(); else scrollTo(index); }} className="flex h-12 shrink-0 snap-center cursor-pointer items-center justify-center whitespace-nowrap text-sm font-semibold" style={{ opacity: Math.max(0.08, 1 - distance * 0.35), transform: `scale(${Math.max(0.8, 1 - distance * 0.08)})` }}>{label(value)}</div>;
        })}
      </div> : <div role="status" className="relative flex h-full items-center px-3 text-center text-xs leading-5 text-neutral-500">No hours available. Choose a later date.<button autoFocus type="button" onClick={close} className="absolute bottom-3 inset-x-2 min-h-11 rounded-full border border-neutral-200">Close</button></div>}
    </div>
  </div>;
}
