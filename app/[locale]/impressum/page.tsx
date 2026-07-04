import { getTranslations, setRequestLocale } from "next-intl/server";

import { imprint, imprintFields } from "@/lib/imprint";

const linkClass =
  "font-medium text-espresso underline underline-offset-2 hover:text-clay";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return { title: t("impressumTitle") };
}

export default async function ImpressumPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <section className="mx-auto max-w-4xl px-5 py-16 md:px-6 md:py-24">
      <h1 className="text-4xl font-semibold text-ink md:text-5xl">
        {t("legal.impressumTitle")}
      </h1>

      <dl className="mt-10 divide-y divide-border">
        {imprintFields.map((field) => (
          <div key={field} className="grid gap-1 py-4 sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm text-muted-foreground">
              {t(`imprint.${field}`)}
            </dt>
            <dd className="text-ink sm:col-span-2">
              {field === "email" ? (
                <a href={`mailto:${imprint.email}`} className={linkClass}>
                  {imprint.email}
                </a>
              ) : field === "phone" ? (
                <a href={imprint.phoneHref} className={linkClass}>
                  {imprint.phone}
                </a>
              ) : field === "country" ? (
                t("contact.country")
              ) : (
                imprint[field]
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
