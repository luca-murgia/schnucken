import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe Auth.js configuration.
 *
 * Imported by BOTH auth.ts (Node) and proxy.ts (Edge), so it must contain only
 * pure-JS, database-free code: session strategy, pages, and the jwt/session
 * callbacks that copy `id` and `role`. The Prisma adapter, Prisma client,
 * bcrypt, and the Credentials `authorize` logic live in auth.ts only — none of
 * them can run on the Edge runtime that proxy.ts uses.
 */
export const authConfig = {
  // Credentials logins are NOT persisted by the adapter, so a DB session is
  // never created for them. JWT strategy is REQUIRED here (see the caveat).
  session: { strategy: "jwt" },

  pages: {
    // Localised login pages live at app/[locale]/login; proxy.ts does the
    // locale-aware redirects, this is the fallback used by signIn().
    signIn: "/login",
  },

  // Providers are added in auth.ts (Credentials needs Prisma + bcrypt, which
  // are not Edge-safe). The Edge instance in proxy.ts only decodes the JWT
  // cookie, so an empty providers array here is correct.
  providers: [],

  callbacks: {
    // Runs at sign-in with `user` (returned by authorize), then on every request
    // with `token` only. Copy id + role into the JWT.
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
      }
      return token;
    },
    // Exposes id + role on the session everywhere, including `req.auth` in
    // proxy.ts and `await auth()` in Server Components.
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "admin" | "client";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
