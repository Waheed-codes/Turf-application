"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useLoginIdentifier } from "../login-identifier";

const inputClass =
  "mt-2 min-h-12 w-full min-w-0 rounded-2xl border border-neutral-100 bg-white px-4 py-3 text-base placeholder:text-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";
const labelClass =
  "block text-[0.6875rem] font-semibold tracking-wider text-neutral-500";

export default function SignupForm() {
  const router = useRouter();
  const { setIdentifier } = useLoginIdentifier();
  const nameRef = useRef<HTMLInputElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState({ name: "", mobile: "" });
  const [notice, setNotice] = useState("");
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const fullName = nameRef.current?.value.trim() ?? "";
    const rawMobile = mobileRef.current?.value ?? "";
    const digits = rawMobile.replace(/\D/g, "");
    const email = (formData.get("email") as string)?.trim() || undefined;
    const referralCode =
      (formData.get("referral") as string)?.trim() || undefined;
    const whatsappUpdates = formData.get("whatsappUpdates") === "on";
    const offers = formData.get("offers") === "on";

    let mobileError = "";
    if (!digits) {
      mobileError = "Enter your mobile number.";
    } else if (digits.length !== 10) {
      mobileError = "Please enter a valid 10-digit mobile number.";
    }

    setErrors({
      name: fullName ? "" : "Enter your full name.",
      mobile: mobileError,
    });
    setServerError("");

    if (!fullName || mobileError) {
      (!fullName ? nameRef : mobileRef).current?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      const formattedForApi = `+91 ${digits}`;

      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: formattedForApi,
          purpose: "signup",
          signupData: {
            name: fullName,
            email,
            referralCode,
            whatsappUpdates,
            offers,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setServerError(data.message || "Failed to send OTP. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setIdentifier(formattedForApi);
      router.replace("/otp?source=signup");
    } catch {
      setServerError(
        "Network error. Please check your connection and try again.",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="mt-9">
      <div className="space-y-4">
        <div>
          <label htmlFor="signup-name" className={labelClass}>
            FULL NAME
          </label>
          <input
            ref={nameRef}
            id="signup-name"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            placeholder="Enter your name"
            className={inputClass}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "signup-name-error" : undefined}
            onChange={() =>
              setErrors((previous) => ({ ...previous, name: "" }))
            }
          />
          <p
            id="signup-name-error"
            role="alert"
            className="mt-1 text-sm text-neutral-700"
          >
            {errors.name}
          </p>
        </div>
        <div>
          <label htmlFor="signup-mobile" className={labelClass}>
            MOBILE NUMBER
          </label>
          <div className="mt-2 flex min-h-12 items-center rounded-2xl border border-neutral-100 bg-white px-4 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-black">
            <span
              id="signup-country-code"
              className="shrink-0 pr-4 text-sm font-semibold text-neutral-900"
            >
              +91
            </span>
            <input
              ref={mobileRef}
              id="signup-mobile"
              name="mobile"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={10}
              autoComplete="tel-national"
              required
              disabled={isSubmitting}
              placeholder="98765 43210"
              className="min-h-12 w-full min-w-0 bg-transparent py-3 text-base placeholder:text-neutral-400 focus:outline-none disabled:bg-neutral-50"
              aria-invalid={Boolean(errors.mobile)}
              aria-describedby={`signup-country-code${errors.mobile ? " signup-mobile-error" : ""}`}
              onChange={(event) => {
                event.target.value = event.target.value
                  .replace(/\D/g, "")
                  .slice(0, 10);
                setErrors((previous) => ({ ...previous, mobile: "" }));
              }}
            />
          </div>
          <p
            id="signup-mobile-error"
            role="alert"
            className="mt-1 text-sm text-neutral-700"
          >
            {errors.mobile}
          </p>
        </div>
        <div>
          <label htmlFor="signup-email" className={labelClass}>
            EMAIL{" "}
            <span className="font-normal normal-case tracking-normal">
              (Optional)
            </span>
          </label>
          <input
            id="signup-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="signup-referral" className={labelClass}>
            REFERRAL CODE{" "}
            <span className="font-normal normal-case tracking-normal">
              (Optional)
            </span>
          </label>
          <input
            id="signup-referral"
            name="referral"
            type="text"
            placeholder="Enter code"
            className={inputClass}
          />
        </div>
      </div>
      <div className="mt-6">
        <label className="flex min-h-9 cursor-pointer items-center gap-3 text-sm leading-5 text-neutral-600">
          <input
            type="checkbox"
            name="whatsappUpdates"
            defaultChecked
            className="size-4 shrink-0 accent-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          />
          Receive booking updates on WhatsApp
        </label>
        <label className="flex min-h-9 cursor-pointer items-center gap-3 text-sm leading-5 text-neutral-600">
          <input
            type="checkbox"
            name="offers"
            defaultChecked
            className="size-4 shrink-0 accent-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          />
          Receive updates and offers
        </label>
      </div>

      {serverError && (
        <p
          id="signup-server-error"
          role="alert"
          className="mt-4 rounded-xl bg-red-50 p-3 text-center text-sm font-medium text-red-700"
        >
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-7 flex min-h-14 w-full items-center justify-center rounded-2xl bg-black px-6 py-4 text-base font-semibold text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
      >
        {isSubmitting ? "Sending OTP..." : "Sign up"}
      </button>
      <p className="mt-5 text-center text-xs leading-6 text-neutral-500">
        By signing up, you agree to our{" "}
        <button
          type="button"
          onClick={() => setNotice("Terms of Use are not available yet.")}
          className="font-semibold text-neutral-950 underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Terms of Use
        </button>{" "}
        and{" "}
        <button
          type="button"
          onClick={() => setNotice("Privacy Policy is not available yet.")}
          className="font-semibold text-neutral-950 underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Privacy Policy
        </button>
      </p>
      <p
        role="status"
        className="mt-2 text-center text-xs leading-5 text-neutral-600"
      >
        {notice}
      </p>
    </form>
  );
}
