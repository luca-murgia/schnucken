// Single source of truth for the bistro's contact + legal details. The values
// here are locale-independent; the field labels are translated in the `contact`
// messages. Mirrors the static-data pattern of `lib/opening-hours.ts`.
export const contact = {
  street: "Elfbuchenstraße 18",
  postalCode: "34119",
  city: "Kassel",
  // Country name is translated — see the `contact.country` message.
  vatNumber: "DE424863319",
  email: "info@schnucken.com",
  // Display form + E.164 tel: form of the same number.
  phone: "+49 561 95314085",
  phoneHref: "tel:+4956195314085",
  instagram: {
    handle: "@das_schnucken",
    url: "https://www.instagram.com/das_schnucken/",
  },
} as const;
