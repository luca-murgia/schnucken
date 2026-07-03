"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";

/**
 * Server action for the credentials login form. Returns an error key on failure;
 * on success `signIn` throws a redirect (to formData's `redirectTo`) which must
 * be re-thrown so Next.js can perform the navigation.
 */
export async function authenticate(
  _prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      return "invalid";
    }
    throw error;
  }
  return undefined;
}
