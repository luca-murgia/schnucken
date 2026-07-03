import { describe, expect, it } from "vitest";

import de from "@/messages/de.json";
import en from "@/messages/en.json";
import itMessages from "@/messages/it.json";

type Json = Record<string, unknown>;

/** All leaf key paths in an object, e.g. "nav.about", sorted. */
function keyPaths(obj: Json, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return value && typeof value === "object" && !Array.isArray(value)
      ? keyPaths(value as Json, path)
      : [path];
  });
}

const base = keyPaths(de as Json).sort();

describe("i18n message parity", () => {
  it.each([
    ["en", en],
    ["it", itMessages],
  ])("%s has exactly the same keys as de", (_name, messages) => {
    expect(keyPaths(messages as Json).sort()).toEqual(base);
  });

  it("de has a non-trivial number of keys (sanity)", () => {
    expect(base.length).toBeGreaterThan(20);
  });
});
