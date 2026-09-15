"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { usePreviewSession } from "../session-navigation";
import { useLoginIdentifier } from "../login-identifier";

export default function OtpForm() {
  const { identifier } = useLoginIdentifier();
  const { completePreviewLogin } = usePreviewSession();
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [message, setMessage] = useState("");
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const complete = digits.every((digit) => /^[0-9]$/.test(digit));

  function fillCode(code: string) {
    if (!/^[0-9]{6}$/.test(code)) return;
    setDigits(code.split(""));
    setMessage("");
    inputs.current[5]?.focus();
  }

  return (
    <>
      <div className="mt-4 text-center text-sm leading-6 text-neutral-500">
        <p>We&apos;ve sent a 6-digit OTP to</p>
        <p className="font-semibold text-neutral-950 [overflow-wrap:anywhere]">{identifier || "No email or mobile number entered"}</p>
        <p className="mt-2 text-xs">UI preview only — no code has been sent.</p>
        {!identifier && <Link href="/login" replace className="inline-block py-2 text-neutral-950 underline focus-visible:outline-2">Enter your email or mobile number</Link>}
      </div>
      <form className="mt-10" onSubmit={(event) => {
        event.preventDefault();
        if (complete) completePreviewLogin();
      }}>
        <fieldset>
          <legend className="mb-7 w-full">
            <span className="flex items-center gap-4 text-xs font-semibold tracking-[0.2em] text-neutral-500">
              <span aria-hidden="true" className="h-px flex-1 bg-neutral-200" />
              ENTER OTP
              <span aria-hidden="true" className="h-px flex-1 bg-neutral-200" />
            </span>
          </legend>
          <div className="grid grid-cols-6 gap-2 sm:gap-3">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(element) => { inputs.current[index] = element; }}
                aria-label={`OTP digit ${index + 1} of 6`}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                pattern="[0-9]"
                maxLength={1}
                value={digit}
                onFocus={(event) => event.currentTarget.select()}
                onChange={(event) => {
                  const value = event.target.value;
                  if (/^[0-9]{6}$/.test(value)) { fillCode(value); return; }
                  if (!/^[0-9]?$/.test(value)) return;
                  setDigits((previous) => previous.map((entry, i) => i === index ? value : entry));
                  setMessage("");
                  if (value && index < 5) inputs.current[index + 1]?.focus();
                }}
                onKeyDown={(event) => {
                  if (event.key === "Backspace" && !digit && index > 0) {
                    event.preventDefault();
                    inputs.current[index - 1]?.focus();
                  }
                  if (event.key === "ArrowLeft" && index > 0) { event.preventDefault(); inputs.current[index - 1]?.focus(); }
                  if (event.key === "ArrowRight" && index < 5) { event.preventDefault(); inputs.current[index + 1]?.focus(); }
                }}
                onPaste={(event) => {
                  event.preventDefault();
                  fillCode(event.clipboardData.getData("text").trim());
                }}
                className="aspect-square w-full min-w-0 rounded-xl border border-neutral-300 bg-white text-center text-xl text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              />
            ))}
          </div>
        </fieldset>
        <p className="mt-7 text-center text-sm text-neutral-500">
          Didn&apos;t receive the code?{" "}
          <button type="button" onClick={() => setMessage("OTP resend will be available when authentication is connected.")} className="min-h-11 font-semibold text-neutral-950 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">Resend</button>
        </p>
        <button type="submit" disabled={!complete} className="mt-7 flex min-h-14 w-full items-center justify-center rounded-full bg-black px-6 py-4 text-base font-semibold text-white enabled:hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black">Verify</button>
        <p role="status" className="mt-4 text-center text-sm leading-6 text-neutral-600">{message}</p>
      </form>
    </>
  );
}
