"use server";

import { CLOSED_WEEKDAYS, type ReservationState } from "@/lib/reservation";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Reservation submission. For the demo this only validates and returns a
 * thank-you; wire it to the DB / back-office + a confirmation email later
 * (persist here, then notify).
 */
export async function createReservation(
  _prev: ReservationState,
  formData: FormData,
): Promise<ReservationState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const time = String(formData.get("time") ?? "").trim();
  const guests = String(formData.get("guests") ?? "").trim();
  // Unchecked checkboxes are absent from the form data.
  const newsletter = formData.get("newsletter") != null;

  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date);
  const day = validDate ? new Date(`${date}T00:00:00`).getDay() : -1;
  // Email is optional; only validate the format when one is provided.
  const emailValid = email === "" || EMAIL_RE.test(email);

  if (
    name.length < 2 ||
    !emailValid ||
    !validDate ||
    CLOSED_WEEKDAYS.includes(day) ||
    !time ||
    !guests
  ) {
    return { status: "error" };
  }

  // TODO (post-demo): persist to the database + notify the team / send a
  // confirmation email to the guest.
  console.log("[reservation] request received", {
    name,
    email,
    phone,
    date,
    time,
    guests,
    newsletter,
  });

  return { status: "success", summary: { name, date, time, guests } };
}
