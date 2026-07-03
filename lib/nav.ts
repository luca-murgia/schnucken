// Primary nav sections — used by the header, mobile menu, footer, and the home
// "Discover" cards. "Get to Know Us" lives inline on the home page (no nav
// entry); "Where & When" (hours + location) has its own route.
export type SectionKey =
  | "whereAndWhen"
  | "menu"
  | "reserveTable"
  | "contact"
  | "reviews";

export const sections: { key: SectionKey; href: string }[] = [
  { key: "whereAndWhen", href: "/where-and-when" },
  { key: "menu", href: "/menu" },
  { key: "reserveTable", href: "/reserve" },
  { key: "contact", href: "/contact" },
  { key: "reviews", href: "/reviews" },
];
