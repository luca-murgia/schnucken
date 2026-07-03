import { describe, expect, it } from "vitest";

import { adminAccess, isAdminPath, splitLocale } from "@/lib/access";
import { routing } from "@/i18n/routing";

const locales = routing.locales; // ["de", "en", "it"]

describe("splitLocale", () => {
  it("splits a locale-prefixed path", () => {
    expect(splitLocale("/de/admin", locales, "de")).toEqual({
      locale: "de",
      pathWithoutLocale: "/admin",
    });
    expect(splitLocale("/en/menu", locales, "de")).toEqual({
      locale: "en",
      pathWithoutLocale: "/menu",
    });
  });

  it("falls back to the default locale when unprefixed", () => {
    expect(splitLocale("/admin", locales, "de")).toEqual({
      locale: "de",
      pathWithoutLocale: "/admin",
    });
  });

  it("maps a bare locale root to '/'", () => {
    expect(splitLocale("/it", locales, "de")).toEqual({
      locale: "it",
      pathWithoutLocale: "/",
    });
  });
});

describe("isAdminPath", () => {
  it("matches the admin root and nested routes", () => {
    expect(isAdminPath("/admin")).toBe(true);
    expect(isAdminPath("/admin/content")).toBe(true);
  });

  it("does not match public or look-alike routes", () => {
    expect(isAdminPath("/")).toBe(false);
    expect(isAdminPath("/menu")).toBe(false);
    expect(isAdminPath("/administrator")).toBe(false);
  });
});

describe("adminAccess", () => {
  it("allows any non-admin path", () => {
    expect(
      adminAccess({ isAdminPath: false, isLoggedIn: false, role: undefined }),
    ).toBe("allow");
  });

  it("sends anonymous visitors to login", () => {
    expect(
      adminAccess({ isAdminPath: true, isLoggedIn: false, role: undefined }),
    ).toBe("redirect-login");
  });

  it("sends signed-in non-admins home", () => {
    expect(
      adminAccess({ isAdminPath: true, isLoggedIn: true, role: "client" }),
    ).toBe("redirect-home");
  });

  it("allows admins through", () => {
    expect(
      adminAccess({ isAdminPath: true, isLoggedIn: true, role: "admin" }),
    ).toBe("allow");
  });
});
