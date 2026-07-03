// Central list of the public site sections. `key` maps to a translation key in
// the `nav` / `sections` namespaces; `href` is locale-agnostic (the next-intl
// <Link> adds the /de|/en|/it prefix).
export type SectionKey = "about" | "menu" | "findUs" | "contact" | "reviews";

export const sections: { key: SectionKey; href: string }[] = [
  { key: "about", href: "/about" },
  { key: "menu", href: "/menu" },
  { key: "findUs", href: "/find-us" },
  { key: "contact", href: "/contact" },
  { key: "reviews", href: "/reviews" },
];
