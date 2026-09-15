# Sports booking foundation

This independent Next.js application lives in `version1`. The parent application is separate and was preserved. Scope is foundation only: a neutral setup placeholder, with no product screens or backend features. No database, authentication, or payment credentials are needed.

## Prerequisites

Use Node.js 24 LTS (`nvm use` if available) and npm. npm is the sole package manager; use the committed `package-lock.json` for reproducible installs.

## Commands

Run from this directory:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. If another application uses that port, run `npm run dev -- --port 3001`.

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

Type checking generates Next.js route definitions and runs TypeScript without emitting application files. Production start requires a successful build; stop the development server first or choose another port.

## Development scope

App Router lives in `src/app`; `@/*` resolves to `src/*`. TypeScript is strict, Server Components are the default, and Tailwind CSS 4 uses its PostCSS integration. No custom fonts, branding, design system, or PWA setup is included.

See [project context](docs/project-context.md) before implementing an approved feature. Add folders only when a feature needs them. Do not treat the roadmap as authorization.

After verification and user testing, suggested checkpoint commit: `setup-nextjs-project`. No commit or push is automatic.

## Tooling notes

Development and production builds use the supported Webpack option because this environment blocks Turbopack CSS worker ports. ESLint 9 is retained for compatibility with the installed Next.js React lint plugin; npm marks it unsupported, while ESLint 10 currently fails in that plugin. Revisit when the plugin supports ESLint 10.

Next.js generated `AGENTS.md` and `CLAUDE.md` during development startup; these contain its version-specific agent guidance.
