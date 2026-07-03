@AGENTS.md

# Schnucken — German Bistro website

Client demo. **Next.js 16** (App Router, RSC) + TypeScript, deployed to **Vercel + Neon**.

## Commands

- `npm run dev` — dev server (Turbopack)
- `npm run build` / `npm start` — production build / serve
- `npm run db:migrate` — `prisma migrate dev` (needs a real Neon `DATABASE_URL`)
- `npm run db:seed` — seed the admin user (reads `SEED_ADMIN_*` from `.env`)
- `npm run db:studio` — Prisma Studio
- `npm test` — Vitest unit tests (`tests/unit/`: `lib/access.ts` logic + message-key parity)
- `npm run test:e2e` — Playwright e2e (`tests/e2e/`); builds + serves on port 3199 (one-time: `npx playwright install chromium`)

## Stack

Tailwind v4 · shadcn/ui (`radix`/`vega` preset, components in `components/ui/`) · Zustand (`store/`) · next-intl 4 (de/en/it) · Prisma 6 + Neon Postgres · Auth.js v5 (credentials + roles).

## Next.js 16 conventions (differ from older Next / most training data)

- Middleware is **`proxy.ts`** at the repo root, exporting a `proxy` function — NOT `middleware.ts`.
- Route `params` / `searchParams` are **async** (Promises): `const { locale } = await params`.
- Fonts via `next/font/google` (self-hosted; no external CDN).

## Structure

- `app/[locale]/layout.tsx` — the **root layout** (renders `<html>`); loads Fraunces + Inter, wraps `NextIntlClientProvider`, renders Header/Footer/CookieBanner. There is intentionally **no** `app/layout.tsx`.
- Public sections: `about`, `menu`, `find-us`, `contact`, `reviews` — placeholder pages via `components/site/page-placeholder.tsx`. The section list lives in `lib/nav.ts`.
- `app/[locale]/login` — credentials login (client `LoginForm` → server action `lib/actions.ts` → `signIn`).
- `app/[locale]/admin` — protected (proxy + defense-in-depth `auth()` in the layout); `/admin/content` is the mini-CMS editor.
- `app/[locale]/impressum` + `datenschutz` — legal placeholders (client provides the text).
- `app/api/auth/[...nextauth]/route.ts` — Auth.js handlers.

## Content (mini-CMS)

- Editable content lives in the `ContentBlock` table, keyed by `(key, locale)` (e.g. `about.body`).
- Read with `getContent(key, locale, fallback)` / `getContentByLocales(key)` in `lib/content.ts` — both fall back gracefully (message catalog / empty) when the DB is unreachable, so builds stay green before Neon is wired.
- Save via the `saveContent` server action (`lib/admin-actions.ts`): admin-only, upserts every locale, and `revalidatePath`s the affected public pages so edits appear without a redeploy.
- `/[locale]/about` renders `about.body` (fallback → `sections.about.intro`). Live editing needs a wired Neon DB + a seeded admin.

## i18n

- `i18n/routing.ts` (locales `de`/`en`/`it`, default `de`, `localePrefix: "always"`), `request.ts`, `navigation.ts`.
- **Always** use `Link`, `useRouter`, `usePathname`, `redirect` from `@/i18n/navigation` (they keep the `/de|/en|/it` prefix).
- Copy lives in `messages/{de,en,it}.json`. `next.config.ts` wraps the config with `createNextIntlPlugin`.

## Auth (edge split — important)

- `auth.config.ts` — Edge-safe (no DB/bcrypt); imported by **both** `auth.ts` and `proxy.ts`. JWT session strategy (required for Credentials + adapter). `jwt`/`session` callbacks carry `id` + `role`.
- `auth.ts` — Node runtime only: `PrismaAdapter` + Credentials `authorize` (bcrypt vs the Prisma `User`).
- `proxy.ts` — composes auth (protects `/admin` and `/:locale/admin`) then hands off to next-intl. Note `isLoggedIn = !!req.auth?.user` (req.auth can be a truthy empty object when logged out).
- Roles: `admin` | `client` (lowercase, matching the Prisma `Role` enum). Types augmented in `types/next-auth.d.ts`.

## Theme (Waldküche)

- Tokens in `app/globals.css`: `:root` / `.dark` values + brand tokens (`--forest`, `--walnut`, `--amber`, `--terracotta`, `--sage`, `--cream`, `--oat`, `--ink`, `--taupe`) mapped via `@theme inline` → utilities `bg-forest`, `text-amber`, `border-walnut`, etc.
- Fonts: `font-sans` = Inter (body/UI), `font-heading` = Fraunces (auto-applied to `h1`–`h3`).
- **Recolor the whole site** by editing the values in `:root` / `.dark` — component code never changes.

## Env

- `.env` (Prisma + seed): `DATABASE_URL` (Neon **pooled**), `DATABASE_URL_UNPOOLED` (Neon **direct**), `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`.
- `.env.local`: `AUTH_SECRET` (generate with `npx auth secret`).
- See `.env.example`. Deployment steps: **`DEPLOY.md`**.
- `postinstall` runs `prisma generate`, so the client is regenerated on every install and on Vercel builds.
