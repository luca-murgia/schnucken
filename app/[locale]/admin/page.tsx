import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AdminPage() {
  const t = await getTranslations("admin");

  return (
    <div className="space-y-6">
      <p className="text-lg">{t("welcome")} 👋</p>
      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-espresso">{t("title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{t("contentEditing")}</p>
            <Button asChild>
              <Link href="/admin/content">{t("manageContent")}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-espresso">{t("manageEvents")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{t("eventsEditing")}</p>
            <Button asChild>
              <Link href="/admin/events">{t("manageEvents")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
