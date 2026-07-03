import type { DefaultSession } from "next-auth";

type UserRole = "admin" | "client";

declare module "next-auth" {
  /** Shape of `session` returned by `auth()` / `useSession()`. */
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  /** Shape of the object returned by the Credentials `authorize` callback. */
  interface User {
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  /** Shape of the encoded JWT (`token`) in the jwt/session callbacks. */
  interface JWT {
    id: string;
    role: UserRole;
  }
}
