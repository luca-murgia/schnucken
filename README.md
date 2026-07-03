# Schnucken — German Bistro website

A multilingual (DE / EN / IT) website for a German bistro, built as a client demo.
Next.js 16 (App Router) · Tailwind v4 · shadcn/ui · Zustand · next-intl · Prisma + Neon · Auth.js.

## Getting started

```bash
npm install
npm run dev
# open http://localhost:3000  (redirects to /de)
```

The app runs locally with placeholder env values. To wire up the database and
logins (and to deploy), see **[DEPLOY.md](./DEPLOY.md)**.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` / `npm start` | Production build / serve |
| `npm run db:migrate` | Create/update the database schema (needs a real Neon URL) |
| `npm run db:seed` | Create the admin user |
| `npm run db:studio` | Browse the database (Prisma Studio) |
| `npm test` | Unit tests (Vitest) — routing/role logic + i18n key parity |
| `npm run test:e2e` | End-to-end smoke tests (Playwright, Chromium) |

## Testing

- **Unit** (`npm test`): `tests/unit/` — the pure logic in `lib/access.ts` (locale/route/role decisions) and DE/EN/IT message-key parity. Fast, no server needed.
- **E2E** (`npm run test:e2e`): `tests/e2e/` — Playwright builds and serves the app on port **3199**, then drives Chromium through locale routing, the language switcher, the `/admin` auth gate, and the cookie banner. First time only, install the browser:

  ```bash
  npx playwright install chromium
  ```

## What's here (Phase 0)

- Responsive shell: desktop header nav + mobile burger menu, language switcher, footer, cookie banner.
- Routed pages per section — Get to Know Us, Our Menu, How to Find Us, Contact Us, Leave a Review — plus Impressum & Datenschutz (placeholder content).
- Auth infrastructure: credentials login, `admin` / `client` roles, a protected `/admin` area.
- Warm green-and-brown "Waldküche" theme with Fraunces + Inter typography.

Architecture, conventions, and the theme system are documented in **[CLAUDE.md](./CLAUDE.md)**.
