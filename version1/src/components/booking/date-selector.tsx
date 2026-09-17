"use client";

import type { HomeDate } from "@/data/mockHome";

export default function DateSelector({ dates, date, onChange }: { dates: HomeDate[]; date: string; onChange: (date: string) => void }) {
  return (
          <fieldset className="mt-9 min-w-0">
            <legend className="text-base font-semibold tracking-tight">
              Select date
            </legend>
            <div className="mt-5 flex gap-5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {dates.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-label={option.label}
                  aria-pressed={date === option.id}
                  onClick={() => onChange(option.id)}
                  className={`relative flex h-[85px] w-[50px] shrink-0 flex-col items-center justify-center rounded-full ${date === option.id ? "bg-neutral-950 text-white" : "text-neutral-800"}`}
                >
                  <span
                    className={`text-[0.615rem] font-medium ${date === option.id ? "text-neutral-300" : "text-neutral-500"}`}
                  >
                    {option.weekday}
                  </span>
                  <span className=" text-[1.40rem] leading-[1.1] font-medium">
                    {option.day}
                  </span>
                  <span
                    className={`text-[0.825rem] font-medium ${date === option.id ? "text-neutral-300" : "text-neutral-500"}`}
                  >
                    {option.month}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-[6px] size-1 rounded-full ${date === option.id ? "bg-white" : "bg-transparent"}`}
                  />
                </button>
              ))}
            </div>
          </fieldset>
  );
}
