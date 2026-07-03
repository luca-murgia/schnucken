// Opening schedule (static structured data, 24h format). Day names + the
// "closed"/"kitchen" labels are translated in the `openingHours` messages.
export type OpeningDay = {
  key: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
  closed?: boolean;
  hours?: string;
  kitchen?: string[];
};

export const openingHours: OpeningDay[] = [
  { key: "mon", closed: true },
  { key: "tue", closed: true },
  { key: "wed", hours: "17:00 – 22:00", kitchen: ["17:30 – 21:00"] },
  {
    key: "thu",
    hours: "09:00 – 22:00",
    kitchen: ["09:00 – 14:00", "17:30 – 21:00"],
  },
  {
    key: "fri",
    hours: "09:00 – 22:00",
    kitchen: ["09:00 – 14:00", "17:30 – 21:00"],
  },
  {
    key: "sat",
    hours: "09:00 – 22:00",
    kitchen: ["09:00 – 14:00", "17:30 – 21:00"],
  },
  { key: "sun", hours: "09:00 – 21:00" },
];
