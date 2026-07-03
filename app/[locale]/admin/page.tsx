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
    </div>
  );
}
