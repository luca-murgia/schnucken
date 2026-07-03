import { getTranslations, setRequestLocale } from "next-intl/server";

import { privacyDocument } from "@/content/privacy";

// Turn bare URLs in a string into clickable links.
function withLinks(text: string) {
  return text.split(/(https?:\/\/[^\s)]+)/g).map((part, i) =>
    part.startsWith("http") ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noreferrer"
        className="font-medium break-all text-espresso underline underline-offset-2 hover:text-clay"
      >
        {part}
      </a>
    ) : (
      part
    ),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return { title: t("datenschutzTitle") };
}

export default async function DatenschutzPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  return (
    <section className="mx-auto max-w-3xl px-5 py-16 md:px-6 md:py-24">
      <h1 className="text-4xl font-semibold text-ink md:text-5xl">
        {t("datenschutzTitle")}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {privacyDocument.updated}
      </p>

      <div className="mt-10 space-y-10">
        {privacyDocument.sections.map((s) => (
          <div key={s.id}>
            <h2 className="text-xl font-semibold text-ink">{s.heading}</h2>
            <div className="mt-3 space-y-4 leading-relaxed text-ink/80">
              {s.blocks.map((b, i) =>
                b.type === "p" ? (
                  <p key={i}>{withLinks(b.text)}</p>
                ) : (
                  <ul key={i} className="list-disc space-y-2 pl-6">
                    {b.items.map((item, j) => (
                      <li key={j}>{withLinks(item)}</li>
                    ))}
                  </ul>
                ),
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
