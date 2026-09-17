"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useLoginIdentifier } from "../login-identifier";

export default function LoginForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { identifier, setIdentifier } = useLoginIdentifier();
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const digits = identifier.replace(/\D/g, "");
    if (!digits) {
      setError("Enter your mobile number.");
      inputRef.current?.focus();
      return;
    }

    if (digits.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      inputRef.current?.focus();
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: `+91 ${digits}`,
          purpose: "login",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Failed to send OTP. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setIdentifier(`+91 ${digits}`);
      router.replace("/otp?source=login");
    } catch {
      setError("Network error. Please check your connection and try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-8">
      <label
        htmlFor="login-identifier"
        className="block text-xs font-semibold tracking-wide text-neutral-600"
      >
        MOBILE NUMBER
      </label>
      <div className="mt-3 flex min-h-14 items-center rounded-2xl border border-neutral-300 bg-white px-4 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-black">
        <span
          id="login-country-code"
          className="shrink-0 pr-4 text-sm font-semibold text-neutral-900"
        >
          +91
        </span>
        <input
          ref={inputRef}
          id="login-identifier"
          name="identifier"
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={10}
          autoComplete="tel-national"
          autoCapitalize="none"
          spellCheck={false}
          required
          disabled={isSubmitting}
          value={identifier}
          onChange={(event) => {
            const digits = event.target.value.replace(/\D/g, "").slice(0, 10);
            setIdentifier(digits);
            setError("");
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "login-error" : undefined}
          placeholder="98765 43210"
          className="min-h-14 w-full min-w-0 bg-transparent py-4 text-base text-neutral-950 placeholder:text-neutral-400 focus:outline-none disabled:bg-neutral-50"
        />
      </div>
      <p
        id="login-error"
        role="alert"
        className="mt-2 text-sm text-neutral-700"
      >
        {error}
      </p>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 flex min-h-14 w-full items-center justify-center rounded-full bg-black px-6 py-4 text-base font-semibold text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
      >
        {isSubmitting ? "Sending OTP..." : "Next"}
      </button>
    </form>
  );
}
