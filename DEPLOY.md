# Deploying the Bistro demo (Vercel + Neon)

No Docker. The app deploys as a standard Next.js project on **Vercel**, with **Neon** Postgres for the database. Total first-deploy time ≈ 15 minutes.

---

## 1. Create the database (Neon)

1. Sign up / log in at <https://neon.tech> and create a project (choose an EU region, e.g. Frankfurt, for a German business).
2. In the project's **Connection Details**, copy **two** connection strings:
   - the **Pooled** string (host contains `-pooler`) → this is `DATABASE_URL`
   - the **Direct** string (no `-pooler`) → this is `DATABASE_URL_UNPOOLED`

## 2. Point the local app at Neon and create the tables

Put the two strings in `.env`, then run the migration and seed the admin user:

```bash
# .env  ->  DATABASE_URL=<pooled>   DATABASE_URL_UNPOOLED=<direct>
#           SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD (set a real password)

npm run db:migrate      # creates users / accounts / sessions / verification_tokens
npm run db:seed         # creates the admin login
```

Generate a real auth secret for `.env.local`:

```bash
npx auth secret         # writes AUTH_SECRET into .env.local
```

## 3. Put the code on GitHub (recommended path)

```bash
git add -A
git commit -m "Phase 0: themed i18n scaffold with auth"
# create an empty GitHub repo, then:
git remote add origin git@github.com:<you>/schnucken.git
git push -u origin main
```

## 4. Deploy on Vercel

**Dashboard route (easiest):**

1. <https://vercel.com/new> → import the GitHub repo. Framework = Next.js (auto-detected).
2. Add **Environment Variables** (Production + Preview):
   | Name | Value |
   | --- | --- |
   | `DATABASE_URL` | Neon **pooled** string |
   | `DATABASE_URL_UNPOOLED` | Neon **direct** string |
   | `AUTH_SECRET` | the value from `npx auth secret` |
3. **Deploy.** `postinstall` runs `prisma generate` automatically during the build.

**CLI route (alternative):** run these yourself in this terminal with the `!` prefix:

```
! npx vercel login
! npx vercel link
! npx vercel env add DATABASE_URL
! npx vercel env add DATABASE_URL_UNPOOLED
! npx vercel env add AUTH_SECRET
! npx vercel --prod
```

> Tip: Vercel's official **Neon integration** (Vercel dashboard → Integrations) can provision `DATABASE_URL` / `DATABASE_URL_UNPOOLED` for you automatically — use it to skip step 1's manual copy.

## 5. Connect the client's domain

Vercel → Project → **Settings → Domains** → add the domain, then set the DNS records Vercel shows (an `A` record for the apex and a `CNAME` for `www`, or Vercel nameservers). HTTPS is issued automatically.

---

## Notes

- **Node version:** Neon serverless + Prisma 6 are happy on Vercel's default Node 20/22.
- **Only static, public pages are prerendered.** `/login`, `/admin`, and the auth API are server-rendered on demand, so they need the env vars above at runtime.
- **Redeploys:** every `git push` triggers a new Vercel build; `prisma generate` reruns via `postinstall`.
- **Secrets** (`.env`, `.env.local`) are git-ignored; only `.env.example` is committed. Set the real values in Vercel, never in the repo.
