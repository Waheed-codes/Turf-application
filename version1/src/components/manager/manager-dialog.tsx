"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function ManagerDialog({ title, onDismiss, children }: { title: string; onDismiss: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { dialog?.close(); document.body.style.overflow = previous; };
  }, []);
  return <dialog ref={ref} onClose={(event) => { if (!event.currentTarget.open) onDismiss(); }} aria-labelledby="manager-dialog-title" className="fixed inset-x-0 top-auto bottom-0 m-0 mx-auto max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-neutral-200 bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-neutral-900 shadow-xl backdrop:bg-black/40 sm:inset-y-0 sm:m-auto sm:rounded-3xl">
    <div className="flex items-center justify-between gap-3"><h2 id="manager-dialog-title" className="text-xl font-bold">{title}</h2><button type="button" aria-label="Close dialog" onClick={() => ref.current?.close()} className="flex size-11 shrink-0 items-center justify-center rounded-full text-xl hover:bg-neutral-100 focus-visible:outline-2">×</button></div>
    {children}
  </dialog>;
}
