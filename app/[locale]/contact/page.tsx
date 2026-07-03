import { getTranslations, setRequestLocale } from "next-intl/server";

import { contact } from "@/lib/contact";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sections.contact" });
  return { title: t("title") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const mapsQuery = encodeURIComponent(
    `${contact.street}, ${contact.postalCode} ${contact.city}`,
  );
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  const linkClass =
    "font-medium text-espresso underline underline-offset-4 transition-colors hover:text-clay";
  const fieldLabelClass =
    "text-xs font-semibold tracking-wider text-clay uppercase";

  return (
    <section className="mx-auto max-w-5xl px-5 py-16 md:px-6 md:py-24">
      <span className="text-xs font-semibold tracking-[0.18em] text-clay uppercase">
        {t("contact.eyebrow")}
      </span>
      <h1 className="mt-3 text-4xl font-semibold text-ink md:text-5xl">
        {t("sections.contact.title")}
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
        {t("contact.intro")}
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {/* Find us */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-espresso">
              {t("contact.addressLabel")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-ink/80">
            <address className="space-y-0.5 not-italic">
              <div>{contact.street}</div>
              <div>
                {contact.postalCode} {contact.city}
              </div>
              <div>{t("contact.country")}</div>
            </address>
            <div className="text-sm">
              <span className="text-muted-foreground">
                {t("contact.vatLabel")}
              </span>{" "}
              <span className="tabular-nums">{contact.vatNumber}</span>
            </div>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className={`inline-block text-sm ${linkClass}`}
            >
              {t("contact.getDirections")}
            </a>
          </CardContent>
        </Card>

        {/* Get in touch */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-espresso">
              {t("home.ctaContact")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className={fieldLabelClass}>{t("contact.emailLabel")}</div>
              <a
                href={`mailto:${contact.email}`}
                className={`mt-1 inline-block ${linkClass}`}
              >
                {contact.email}
              </a>
            </div>
            <div>
              <div className={fieldLabelClass}>{t("contact.phoneLabel")}</div>
              <a
                href={contact.phoneHref}
                className={`mt-1 inline-block tabular-nums ${linkClass}`}
              >
                {contact.phone}
              </a>
            </div>
            <div>
              <div className={fieldLabelClass}>{t("contact.followLabel")}</div>
              <a
                href={contact.instagram.url}
                target="_blank"
                rel="noreferrer"
                className={`mt-1 inline-block ${linkClass}`}
              >
                {contact.instagram.handle}
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
