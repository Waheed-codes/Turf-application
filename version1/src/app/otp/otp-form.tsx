"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { usePreviewSession } from "../session-navigation";
import { useLoginIdentifier } from "../login-identifier";

export default function OtpForm() {
  const { identifier } = useLoginIdentifier();
  const { completePreviewLogin } = usePreviewSession();
  const [digits, setDigits] = useState<string[]>(Array(4).fill(""));
  const [message, setMessage] = useState("");
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const complete = digits.every((digit) => /^[0-9]$/.test(digit));

  useEffect(() => {
    if (complete) {
      completePreviewLogin();
    }
  }, [complete, completePreviewLogin]);

  function fillCode(code: string) {
    if (!/^[0-9]{4}$/.test(code)) return;
    setDigits(code.split(""));
    setMessage("");
    inputs.current[3]?.focus();
  }

  return (
    <>
      <div className="mt-2 text-center text-sm leading-6 text-neutral-500">
        <p>We&apos;ve sent a 4-digit OTP to</p>
        <p className="font-semibold text-neutral-950 [overflow-wrap:anywhere]">
          {identifier || "No email or mobile number entered"}
        </p>
        <p className="mt-1 text-xs">UI preview only — no code has been sent.</p>
        {!identifier && (
          <Link
            href="/login"
            replace
            className="inline-block py-2 text-neutral-950 underline focus-visible:outline-2"
          >
            Enter your email or mobile number
          </Link>
        )}
      </div>
      <form
        className="mt-6"
        onSubmit={(event) => {
          event.preventDefault();
          if (complete) completePreviewLogin();
        }}
      >
        <fieldset>
          <legend className="mb-5 w-full">
            <span className="flex items-center gap-4 text-xs font-semibold tracking-[0.2em] text-neutral-500">
              <span aria-hidden="true" className="h-px flex-1 bg-neutral-200" />
              ENTER OTP
              <span aria-hidden="true" className="h-px flex-1 bg-neutral-200" />
            </span>
          </legend>
          <div className="flex justify-center gap-6 sm:gap-8">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  inputs.current[index] = element;
                }}
                autoFocus={index === 0}
                aria-label={`OTP digit ${index + 1} of 4`}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                pattern="[0-9]"
                maxLength={1}
                value={digit}
                onFocus={(event) => event.currentTarget.select()}
                onChange={(event) => {
                  const value = event.target.value;
                  if (/^[0-9]{4}$/.test(value)) {
                    fillCode(value);
                    return;
                  }
                  if (!/^[0-9]?$/.test(value)) return;
                  setDigits((previous) =>
                    previous.map((entry, i) => (i === index ? value : entry)),
                  );
                  setMessage("");
                  if (value && index < 3) inputs.current[index + 1]?.focus();
                }}
                onKeyDown={(event) => {
                  if (event.key === "Backspace" && !digit && index > 0) {
                    event.preventDefault();
                    inputs.current[index - 1]?.focus();
                  }
                  if (event.key === "ArrowLeft" && index > 0) {
                    event.preventDefault();
                    inputs.current[index - 1]?.focus();
                  }
                  if (event.key === "ArrowRight" && index < 3) {
                    event.preventDefault();
                    inputs.current[index + 1]?.focus();
                  }
                }}
                onPaste={(event) => {
                  event.preventDefault();
                  fillCode(event.clipboardData.getData("text").trim());
                }}
                className="w-15 h-15 min-w-0 rounded-full bg-white border border-neutral-200 text-center text-xl text-neutral-950 focus:outline-none focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 transition-colors"
              />
            ))}
          </div>
        </fieldset>
        <p className="mt-5 text-center text-sm text-neutral-500">
          Didn&apos;t receive the code?{" "}
          <button
            type="button"
            onClick={() =>
              setMessage(
                "OTP resend will be available when authentication is connected.",
              )
            }
            className="min-h-11 font-semibold text-neutral-950 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            Resend
          </button>
        </p>
        <button
          type="submit"
          disabled={!complete}
          className="mt-5 flex min-h-11 w-auto mx-auto items-center justify-center rounded-full bg-black px-8 py-2.5 text-base font-semibold text-white enabled:hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
        >
          Verify
        </button>
        <p
          role="status"
          className="mt-4 text-center text-sm leading-6 text-neutral-600"
        >
          {message}
        </p>
      </form>
    </>
  );
}
