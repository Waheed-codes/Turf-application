"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLoginIdentifier } from "../login-identifier";

export default function LoginForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { identifier, setIdentifier } = useLoginIdentifier();
  const router = useRouter();
  const [error, setError] = useState("");
  const [phone, setPhone] = useState(() => {
    return identifier ? identifier.replace(/\D/g, "").slice(-10) : "";
  });

  function proceedToOtp(number: string) {
    setError("");
    setIdentifier(`+91 ${number}`);
    router.replace("/otp?source=login");
  }

  function cleanMobile(raw: string) {
    let digits = raw.replace(/\D/g, "");
    if (digits.startsWith("91") && digits.length === 12) {
      digits = digits.slice(2);
    } else if (digits.startsWith("0") && digits.length === 11) {
      digits = digits.slice(1);
    }
    return digits.slice(0, 10);
  }

  function handlePhoneChange(val: string) {
    const cleaned = cleanMobile(val);
    setPhone(cleaned);
    setError("");
  }

  useEffect(() => {
    inputRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (document.activeElement === inputRef.current) return;
      if (event.key.length === 1 && /[0-9]/.test(event.key)) {
        inputRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleNext() {
    if (phone.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      inputRef.current?.focus();
      return;
    }

    proceedToOtp(phone);
  }

  return (
    <form onSubmit={(event) => event.preventDefault()} noValidate className="mt-5">
      <label
        htmlFor="login-identifier"
        className="block text-xs font-semibold tracking-wide text-neutral-600 cursor-pointer"
        onClick={() => inputRef.current?.focus()}
      >
        MOBILE NUMBER
      </label>
      <div
        onClick={() => inputRef.current?.focus()}
        className={`mt-2 flex min-h-14 w-full min-w-0 items-center rounded-2xl border bg-white px-4 cursor-text transition-colors ${
          error ? "border-red-500" : "border-neutral-300 focus-within:border-neutral-950 focus-within:ring-1 focus-within:ring-neutral-950"
        }`}
      >
        <span
          aria-hidden="true"
          className="flex items-center text-base font-semibold text-neutral-950 pr-2 select-none"
        >
          +91
        </span>
        <input
          ref={inputRef}
          autoFocus
          id="login-identifier"
          name="identifier"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          pattern="[0-9]*"
          maxLength={10}
          required
          value={phone}
          onChange={(event) => handlePhoneChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              return;
            }
            if (
              event.key === "Backspace" ||
              event.key === "Delete" ||
              event.key === "ArrowLeft" ||
              event.key === "ArrowRight" ||
              event.key === "Tab" ||
              event.ctrlKey ||
              event.metaKey
            ) {
              return;
            }
            if (!/^[0-9]$/.test(event.key)) {
              event.preventDefault();
              return;
            }
            const target = event.currentTarget;
            const hasSelection =
              target.selectionStart !== null &&
              target.selectionEnd !== null &&
              target.selectionEnd > target.selectionStart;
            if (phone.length >= 10 && !hasSelection) {
              event.preventDefault();
            }
          }}
          onPaste={(event) => {
            event.preventDefault();
            const text = event.clipboardData.getData("text");
            handlePhoneChange(text);
          }}
          onFocus={() => setError("")}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "login-error" : undefined}
          placeholder="Enter 10-digit number"
          className="w-full min-w-0 bg-transparent py-4 text-base text-neutral-950 placeholder:text-neutral-400 focus:outline-none"
        />
      </div>
      {error && (
        <p
          id="login-error"
          role="alert"
          className="mt-2 text-sm text-red-500"
        >
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleNext}
        className="mt-6 flex min-h-14 w-full items-center justify-center rounded-full bg-black px-6 py-4 text-base font-semibold text-white hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
      >
        Next
      </button>
    </form>
  );
}
