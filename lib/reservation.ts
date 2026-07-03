// Reservation constants + types (no "use server" — safe to import anywhere).

export const TIME_SLOTS = [
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
] as const;

export const PARTY_SIZES = [1, 2, 3, 4, 5, 6, 7, 8] as const;

// Closed on Monday (1) and Tuesday (2) — used to disable calendar days.
export const CLOSED_WEEKDAYS = [1, 2];

export type ReservationSummary = {
  name: string;
  date: string;
  time: string;
  guests: string;
};

export type ReservationState =
  | { status: "success"; summary: ReservationSummary }
  | { status: "error" }
  | undefined;
