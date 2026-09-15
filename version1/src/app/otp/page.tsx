import Link from "next/link";
import OtpForm from "./otp-form";

export default async function OtpPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string | string[] }>;
}) {
  const source = (await searchParams).source;
  const backPath = source === "signup" ? "/signup" : "/login";
  const backLabel = source === "signup" ? "Back to signup" : "Back to login";
  return (
    <main className="min-h-svh bg-white px-6 py-8 font-sans text-neutral-950 sm:py-16">
      <div className="mx-auto w-full max-w-sm">
        <Link
          href={backPath}
          replace
          aria-label={backLabel}
          className="inline-flex size-11 items-center justify-center rounded-full hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="size-6"
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
        <div
          aria-label="Logo placeholder"
          className="mt-8 flex min-h-10 items-center justify-center px-4 text-xs font-semibold tracking-[0.2em]"
        >
          LOGO
        </div>
        <h1 className="mt-10 text-center text-[clamp(1.5rem,6.5vw,1.875rem)] leading-tight font-semibold tracking-tight">
          Verify your number
        </h1>
        <OtpForm />
      </div>
    </main>
  );
}
