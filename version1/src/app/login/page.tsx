import Link from "next/link";
import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <main className="min-h-svh bg-white px-6 py-8 font-sans text-neutral-950 sm:py-16">
      <div className="mx-auto w-full max-w-sm">
        <Link
          href="/" replace
          aria-label="Back to landing page"
          className="inline-flex size-11 items-center justify-center rounded-full hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-6">
            <path d="M19 12H5m7-7-7 7 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        <div className="mt-10 text-center">
          <div
            aria-label="Logo placeholder"
            className="flex min-h-10 items-center justify-center px-4 text-xs font-semibold tracking-[0.2em]"
          >
            LOGO
          </div>
          <p className="mt-5 text-[clamp(1.75rem,7.7vw,2.125rem)] leading-[1.18] font-semibold tracking-tight">
            Book premium
            <br />
            venues for your next
            <br />
            game.
          </p>
        </div>

        <div className="mt-12 flex items-center gap-4">
          <span aria-hidden="true" className="h-px flex-1 bg-neutral-200" />
          <h1 className="text-xs font-semibold tracking-[0.15em] text-neutral-600">LOG IN</h1>
          <span aria-hidden="true" className="h-px flex-1 bg-neutral-200" />
        </div>

        <LoginForm />
      </div>
    </main>
  );
}
