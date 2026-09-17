"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "../session-navigation";
import { useLoginIdentifier } from "../login-identifier";

export default function OtpForm() {
  const { identifier } = useLoginIdentifier();
  const { completeLogin } = useSession();
  const searchParams = useSearchParams();
  const source = searchParams.get("source");
  const purpose = source === "signup" ? "signup" : "login";

  const [digits, setDigits] = useState<string[]>(Array(4).fill(""));
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const complete = digits.every((digit) => /^[0-9]$/.test(digit));

  function fillCode(code: string) {
    if (!/^[0-9]{4}$/.test(code)) return;
    setDigits(code.split(""));
    setErrorMessage("");
    inputs.current[3]?.focus();
  }

  async function handleVerify(event?: React.FormEvent) {
    if (event) event.preventDefault();
    if (!complete || isVerifying) return;

    if (!identifier) {
      setErrorMessage("No mobile number found. Please start again.");
      return;
    }

    setErrorMessage("");
    setStatusMessage("");
    setIsVerifying(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: identifier,
          otp: digits.join(""),
          purpose,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.message || "Failed to verify OTP.");
        setIsVerifying(false);
        return;
      }

      await completeLogin();
    } catch {
      setErrorMessage(
        "Network error. Please check your connection and try again.",
      );
      setIsVerifying(false);
    }
  }

  async function handleResend() {
    if (isResending || isVerifying) return;

    if (!identifier) {
      setErrorMessage("No mobile number found. Please start again.");
      return;
    }

    setIsResending(true);
    setErrorMessage("");
    setStatusMessage("Sending a new OTP...");

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: identifier,
          purpose,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.message || "Failed to resend OTP.");
        setStatusMessage("");
      } else {
        setStatusMessage("A new 4-digit OTP has been sent.");
        setDigits(Array(4).fill(""));
        inputs.current[0]?.focus();
      }
    } catch {
      setErrorMessage("Network error while resending OTP.");
      setStatusMessage("");
    } finally {
      setIsResending(false);
    }
  }

  return (
    <>
      <div className="mt-4 text-center text-sm leading-6 text-neutral-500">
        <p>We&apos;ve sent a 4-digit OTP to</p>
        <p className="font-semibold text-neutral-950 [overflow-wrap:anywhere]">
          {identifier || "No mobile number entered"}
        </p>
        {!identifier && (
          <Link
            href="/login"
            replace
            className="inline-block py-2 text-neutral-950 underline focus-visible:outline-2"
          >
            Enter your mobile number
          </Link>
        )}
      </div>

      <form className="mt-10" onSubmit={handleVerify}>
        <fieldset>
          <legend className="mb-7 w-full">
            <span className="flex items-center gap-4 text-xs font-semibold tracking-[0.2em] text-neutral-500">
              <span aria-hidden="true" className="h-px flex-1 bg-neutral-200" />
              ENTER OTP
              <span aria-hidden="true" className="h-px flex-1 bg-neutral-200" />
            </span>
          </legend>

          <div className="mx-auto grid max-w-xs grid-cols-4 gap-3 sm:gap-4">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  inputs.current[index] = element;
                }}
                aria-label={`OTP digit ${index + 1} of 4`}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                pattern="[0-9]"
                maxLength={1}
                disabled={isVerifying}
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
                  setErrorMessage("");
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
                className="aspect-square w-full min-w-0 rounded-xl border border-neutral-300 bg-white text-center text-2xl font-semibold text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:bg-neutral-50"
              />
            ))}
          </div>
        </fieldset>

        <p className="mt-7 text-center text-sm text-neutral-500">
          Didn&apos;t receive the code?{" "}
          <button
            type="button"
            disabled={isResending || isVerifying}
            onClick={handleResend}
            className="min-h-11 font-semibold text-neutral-950 underline underline-offset-4 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            {isResending ? "Resending..." : "Resend"}
          </button>
        </p>

        {errorMessage && (
          <p
            id="otp-error"
            role="alert"
            className="mt-4 rounded-xl bg-red-50 p-3 text-center text-sm font-medium text-red-700"
          >
            {errorMessage}
          </p>
        )}

        {statusMessage && !errorMessage && (
          <p
            id="otp-status"
            role="status"
            className="mt-4 text-center text-sm font-medium text-emerald-700"
          >
            {statusMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={!complete || isVerifying}
          className="mt-7 flex min-h-14 w-full items-center justify-center rounded-full bg-black px-6 py-4 text-base font-semibold text-white enabled:hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
        >
          {isVerifying ? "Verifying..." : "Verify"}
        </button>
      </form>
    </>
  );
}
