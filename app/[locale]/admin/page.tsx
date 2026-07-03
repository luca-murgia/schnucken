import { getTranslations } from "next-intl/server";

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
          <CardTitle className="text-forest">{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{t("contentEditing")}</p>
        </CardContent>
      </Card>
    </div>
  );
}
