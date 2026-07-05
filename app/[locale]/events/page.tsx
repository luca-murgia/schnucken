import { getTranslations, setRequestLocale } from "next-intl/server";

import { getPublishedEvents, type EventCard as EventData } from "@/lib/events";
import { EventCard } from "@/components/site/event-card";
import { AdminEditButton } from "@/components/site/admin-edit-button";

// Rendered dynamically (not ISR-cached): the page contains the admin-only
// AdminEditButton, which depends on the per-request session — caching it would
// leak the edit affordance to the public. Admin edits still show immediately.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sections.events" });
  return { title: t("title") };
}

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  // Published events from the DB; before Neon is wired (or when no events have
  // been created yet) fall back to the built-in "Sunday Service" example so the
  // page is never blank in the demo.
  const dbEvents = await getPublishedEvents();
  const events: EventData[] =
    dbEvents.length > 0
      ? dbEvents
      : [
          {
            id: "example",
            title: t("events.example.title"),
            subtitle: t("events.example.subtitle"),
            description: t("events.example.description"),
            image: "/events/sunday-service.jpg",
            published: true,
            sortOrder: 0,
          },
        ];

  return (
    <section className="mx-auto max-w-4xl px-5 py-16 md:px-6 md:py-24">
      <span className="text-xs font-semibold tracking-[0.18em] text-clay uppercase">
        {t("events.eyebrow")}
      </span>
      <h1 className="mt-3 text-4xl font-semibold text-ink md:text-5xl">
        {t("sections.events.title")}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        {t("sections.events.intro")}
      </p>

      <div className="mt-10 space-y-8 md:mt-12">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      <AdminEditButton href="/admin/events" label={t("events.admin.editOnSite")} />
    </section>
  );
}
