# Project context

## Purpose and scope

Build a mobile-first sports venue booking platform, initially for Hyderabad, India, then other cities. Sports may include cricket, football, badminton, pickleball, box cricket, and table tennis. Keep future features extensible without creating a framework now.

Eventual roles:
- Customer: discover venues, choose courts and slots, book, pay, and manage bookings and profile.
- Venue owner: manage venues, courts, pricing, availability, bookings, and earnings.
- Platform admin: manage users, owners, venues, payments, reports, and settings.

Customer journey: Home → Explore/Search → Venue details → Court/sport selection → Date and slot selection → Checkout → Payment UI → Booking success → My Bookings/Profile.

## Stack and organization

One Next.js App Router application under `version1`, React, strict TypeScript, Tailwind CSS, Node.js 24 LTS, and npm with one lockfile. `src/app` contains routes and `@/*` maps to `src/*`. Server Components are the default; add client boundaries only for state, handlers, or browser APIs.

Add components, data, models, lib, services, repositories, validations, types, hooks, store, constants, public assets, scripts, and tests only when approved work needs them. Repository layers and shared stores are optional. MongoDB Atlas and Mongoose are planned, not installed here.

## Design and data rules

Reproduce supplied designs accurately without redesigning them. Prioritize 320–430px viewports with reasonable tablet and desktop behavior. Preserve zoom and navigation; do not impose a fixed mobile shell. Defer branding, fonts, design tokens, and component styling until references arrive.

Use typed mock data until API integration is explicitly requested. Keep reusable mocks separate from presentation and avoid duplicate venue data. Add `src/data/mockVenues.ts` and `src/types/venue.ts` when the first venue feature needs them. Use stable identifiers and consistent relationships. Do not create mock APIs or abstraction frameworks prematurely. Clearly label simulated bookings and payments.

## Deferred architecture — documentation only

Future flow: Frontend → API → Server-side business logic → MongoDB → Response, within the same Next.js application. Introduce API routes, connections, Mongoose models, services, and validation only as approved features require them. Keep database access and secrets server-side. Potential models: User, Venue, Court, Booking, Payment, Review, ExternalBooking; no schemas now.

Backend availability and booking correctness must prevent double booking independently of frontend state. The eventual transaction flow is slot selection → temporary hold → payment → booking confirmation. Verify payment success on the backend before confirming a real booking. Authentication and role authorization require explicit implementation requests.

Backend, authentication, booking, payments, external synchronization, real-time infrastructure, and PWA work are deferred. External booking sync follows a working internal system and a verified integration method. Add real-time infrastructure only when justified. PWA installation, service workers, caching, and offline behavior follow a working web application.

## Workflow

Implement only the currently requested feature. Requested task → implementation → verification → fixes → user testing → Git checkpoint → next task. Inspect existing code, identify files and data sources, follow supplied designs, reuse components, preserve completed screens/navigation, and verify the requested behavior before stopping.

Start approved customer screens with mock data. Once the core frontend journey is usable, connect features vertically: listings, venue details, courts, slots, bookings, and payments. This roadmap does not authorize implementation.

## Implementation status

`version1` was verified empty before setup. The root route now contains the first customer landing/authentication-entry screen, with an illustration placeholder, neutral LOGO placeholder, the requested heading, and links to `/login` and `/signup`. The `/login` route now exists; `/signup` remains unimplemented and resolves to the default not-found screen. No authentication logic, application data, backend endpoints, database/authentication/payment packages, or PWA features were added here. The pre-existing parent application and its uncommitted changes remain separate and untouched.

Setup verification: lint, type checking, and the production Webpack build passed. Development and production servers returned HTTP 200 for the placeholder with compiled Tailwind CSS; the alias resolves through the root stylesheet import. Browser viewport checks at 320px, 430px, and desktop, and browser-console checks remain unverified because Chromium cannot launch without the system library `libnspr4.so`. No application errors were observed in the successful server checks. Scripts use Webpack because the environment blocked the Turbopack build worker port. See README for the ESLint compatibility limitation.

Landing screen verification: lint, type checking, and production build passed. Built HTML contains the requested copy, placeholders, and navigation targets. The reference screenshot and final illustration were not present in the attachment or this application; the layout follows the written brief pending those assets. Browser overflow checks at 320px and 430px remain unverified: Chromium is missing `libnspr4.so`, `libnss3.so`, `libnssutil3.so`, and `libasound.so.2`.

Login screen: `/login` has a back link to `/`, the existing LOGO placeholder, heading, and a single labeled email/mobile text field. A small client component prevents submission, rejects empty or whitespace-only input with an accessible inline error, and keeps nonempty submissions on the page with a verification-unavailable notice. No identifier is transmitted or persisted. OTP navigation, delivery, verification, signup, and real authentication remain deferred. No screenshot was attached; styling follows the written brief and landing page.

Login verification: lint, type checking, and production build passed. HTTP checks confirmed `/` and `/login` return 200 and include links in both directions. Browser interaction, validation announcements, and overflow at 320px/430px remain unverified because Chromium lacks the system libraries listed above. The existing landing page and project configuration were preserved.
