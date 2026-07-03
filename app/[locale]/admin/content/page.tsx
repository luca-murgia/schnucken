import { getTranslations, setRequestLocale } from "next-intl/server";

import { routing } from "@/i18n/routing";
import { getContentByLocales } from "@/lib/content";
import { ContentEditor } from "@/components/admin/content-editor";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ABOUT_BODY_KEY = "about.body";

export default async function AdminContentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  const current = await getContentByLocales(ABOUT_BODY_KEY);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl text-espresso">{t("content.title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("content.subtitle")}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t("content.aboutHeading")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ContentEditor
            contentKey={ABOUT_BODY_KEY}
            locales={routing.locales}
            initial={current}
          />
        </CardContent>
      </Card>
    </div>
  );
}
