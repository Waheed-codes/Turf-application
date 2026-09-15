import Link from "next/link";
import SignupForm from "./signup-form";

export default function SignupPage() {
  return (
    <main className="min-h-svh bg-neutral-50 px-6 py-6 font-sans text-neutral-950 sm:py-12">
      <div className="mx-auto w-full max-w-sm">
        <Link
          href="/"
          replace
          aria-label="Back to landing page"
          className="inline-flex size-11 items-center justify-center rounded-full hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="size-5"
          >
            <path
              d="M19 12H5m7-7-7 7 7 7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
        <h1 className="mt-6 text-[1.75rem] leading-tight font-semibold tracking-tight">
          Create an account
        </h1>
        <SignupForm />
      </div>
    </main>
  );
}
