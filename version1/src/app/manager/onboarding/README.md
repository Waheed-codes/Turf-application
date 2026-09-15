# ArenaX Manager onboarding

Foundation only. No onboarding screens or routing behavior are implemented yet.
Add each route when its screen is requested, in this order:

1. `/manager/onboarding/services`
2. `/manager/onboarding/location`
3. `/manager/onboarding/photos`
4. `/manager/onboarding/description`
5. `/manager/onboarding/amenities`
6. `/manager/onboarding/slots`
7. `/manager/onboarding/banking`

After setup, the intended destination is `/manager/dashboard`, currently a
Coming soon placeholder. Setup completion and role checks are deferred.

Use `src/components/manager/` for reusable Manager UI. Introduce a shared
onboarding shell when the first screen needs it. Use simple React state and
typed mock data as needed; do not implement database, banking, or authentication
services during this foundation phase.

Keep screens mobile-first (320–430px), responsive, accessible, and strictly
black, white, and neutral grey. Preserve the existing shared login and OTP flow.
Future backend logic will determine the approved account role and setup status;
client-side role selection is not authorization.
