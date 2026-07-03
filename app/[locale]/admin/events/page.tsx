import { getTranslations, setRequestLocale } from "next-intl/server";

import { getAllEvents } from "@/lib/events";
import { EventManager } from "@/components/admin/event-manager";

export default async function AdminEventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("events.admin");
  const events = await getAllEvents();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl text-espresso">{t("title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <EventManager events={events} />
    </div>
  );
}
