

import { useRef, useState, useEffect } from "react";
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
    <form onSubmit={(event) => event.preventDefault()} noValidate className="mt-5">
      <label
        htmlFor="login-identifier"
        className="block text-xs font-semibold tracking-wide text-neutral-600 cursor-pointer"
        onClick={() => inputRef.current?.focus()}
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
        type="submit"
        disabled={isSubmitting}
        className="mt-6 flex min-h-14 w-full items-center justify-center rounded-full bg-black px-6 py-4 text-base font-semibold text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
      >
        {isSubmitting ? "Sending OTP..." : "Next"}
      </button>
    </form>
  );
}
