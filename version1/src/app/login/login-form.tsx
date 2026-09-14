"use client";

import { useRef, useState, type FormEvent } from "react";

export default function LoginForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");

    if (!identifier.trim()) {
      setError("Enter your email address or mobile number.");
      inputRef.current?.focus();
      return;
    }

    setError("");
    // Future OTP navigation belongs here once that screen is implemented.
    // Do not send, persist, or place the identifier in a URL at this stage.
    setNotice("Verification is not available yet. Please try again later.");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-8">
      <label htmlFor="login-identifier" className="block text-xs font-semibold tracking-wide text-neutral-600">
        EMAIL OR MOBILE NUMBER
      </label>
      <input
        ref={inputRef}
        id="login-identifier"
        name="identifier"
        type="text"
        autoComplete="username"
        autoCapitalize="none"
        spellCheck={false}
        required
        value={identifier}
        onChange={(event) => {
          setIdentifier(event.target.value);
          setError("");
          setNotice("");
        }}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "login-error" : undefined}
        placeholder="e.g. +91 98765 43210"
        className="mt-3 min-h-14 w-full min-w-0 rounded-2xl border border-neutral-300 bg-white px-4 py-4 text-base text-neutral-950 placeholder:text-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
      />
      <p id="login-error" role="alert" className="mt-2 text-sm text-neutral-700">
        {error}
      </p>

      <button type="submit" className="mt-6 flex min-h-14 w-full items-center justify-center rounded-full bg-black px-6 py-4 text-base font-semibold text-white hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black">
        Next
      </button>
      <p role="status" className="mt-4 text-center text-sm leading-6 text-neutral-600">
        {notice}
      </p>
    </form>
  );
}
