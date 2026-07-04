// Primary nav sections — used by the header, mobile menu, footer, and the home
// "Discover" cards. "Get to Know Us" lives inline on the home page (no nav
// entry); "Find us" (hours + location) has its own route.
export type SectionKey =
  | "reserveTable"
  | "menu"
  | "events"
  | "whereAndWhen"
  | "contact"
  | "reviews";

export const sections: { key: SectionKey; href: string }[] = [
  { key: "reserveTable", href: "/reserve" },
  { key: "menu", href: "/menu" },
  { key: "events", href: "/events" },
  { key: "whereAndWhen", href: "/where-and-when" },
  { key: "contact", href: "/contact" },
  { key: "reviews", href: "/reviews" },
];
