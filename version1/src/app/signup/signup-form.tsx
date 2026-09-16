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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fullName = nameRef.current?.value.trim() ?? "";
    const mobile = mobileRef.current?.value.trim() ?? "";
    setErrors({
      name: fullName ? "" : "Enter your full name.",
      mobile: mobile ? "" : "Enter your mobile number.",
    });
    if (!fullName || !mobile) {
      (!fullName ? nameRef : mobileRef).current?.focus();
      return;
    }
    setIdentifier(`+91 ${mobile}`);
    router.replace("/otp?source=signup");
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
              className="shrink-0 pr-4 text-sm font-semibold"
            >
              +91
            </span>
            <input
              ref={mobileRef}
              id="signup-mobile"
              name="mobile"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              required
              placeholder="98765 43210"
              className="min-h-12 w-full min-w-0 bg-transparent py-3 text-base placeholder:text-neutral-400 focus:outline-none"
              aria-invalid={Boolean(errors.mobile)}
              aria-describedby={`signup-country-code${errors.mobile ? " signup-mobile-error" : ""}`}
              onChange={(e) => {
                e.target.value = e.target.value.replace(/\D/g, "");
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
      <button
        type="submit"
        className="mt-7 flex min-h-14 w-full items-center justify-center rounded-full bg-black px-6 py-4 text-base font-semibold text-white hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
      >
        Sign up
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
