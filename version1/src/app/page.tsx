import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-svh bg-white px-6 py-10 font-sans text-neutral-950 sm:py-16">
      <div className="mx-auto flex w-full max-w-sm flex-col items-center text-center">
        {/* Replace with the supplied monochrome sports illustration when available. */}
        <div
          role="img"
          aria-label="Temporary placeholder for the sports illustration"
          className="flex aspect-[6/5] w-full items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-6 text-sm text-neutral-500"
        >
          Sports illustration placeholder
        </div>

        <div
          aria-label="Logo placeholder"
          className="mt-8 flex min-h-10 items-center justify-center px-4 text-xs font-semibold tracking-[0.2em]"
        >
          LOGO
        </div>

        <h1 className="mt-5 text-[clamp(1.75rem,7.7vw,2.125rem)] leading-[1.18] font-semibold tracking-tight">
          Book premium
          <br />
          venues for your next
          <br />
          game.
        </h1>

        <Link
          href="/login"
          replace
          prefetch={false}
          className="mt-10 flex min-h-14 w-full items-center justify-center rounded-full bg-black px-6 py-4 text-base font-semibold text-white hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
        >
          Log in
        </Link>

        <p className="mt-5 text-sm leading-6 text-neutral-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            replace
            prefetch={false}
            className="inline-flex min-h-11 items-center font-semibold text-neutral-950 underline underline-offset-4 hover:text-neutral-600 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
