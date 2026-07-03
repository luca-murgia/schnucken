import { contact } from "@/lib/contact";

// Impressum (§ 5 DDG) details. Address/contact fields are pulled from
// lib/contact.ts so the two can never drift; the rest are imprint-specific.
// Field labels are translated — see the `imprint` messages.
export const imprint = {
  businessName: "Das Schnucken",
  legalForm: "GbR",
  firstName: "David",
  lastName: "Sigwart",
  street: contact.street,
  postcode: contact.postalCode,
  town: contact.city,
  country: "Deutschland", // rendered via the localized contact.country message
  phone: contact.phone,
  phoneHref: contact.phoneHref,
  email: contact.email,
  registerEntry: "Kassel",
  registrationNumber: "DE424863319",
  localTaxNumber: "02631100225",
  vatNumber: contact.vatNumber,
} as const;

// Order in which rows are shown on the imprint page (keys of `imprint`,
// excluding phoneHref which is only the tel: target).
export const imprintFields = [
  "businessName",
  "legalForm",
  "firstName",
  "lastName",
  "street",
  "postcode",
  "town",
  "country",
  "phone",
  "email",
  "registerEntry",
  "registrationNumber",
  "localTaxNumber",
  "vatNumber",
] as const;
