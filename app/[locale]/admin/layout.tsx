import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Defense in depth — the proxy already gates /admin, but re-check here.
  const session = await auth();
  if (!session?.user) redirect(`/${locale}/login`);
  if (session.user.role !== "admin") redirect(`/${locale}`);

  const t = await getTranslations("admin");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl text-espresso">{t("title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("signedInAs")}: {session.user.email} · {t("role")}:{" "}
            {session.user.role}
          </p>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: `/${locale}` });
          }}
        >
          <Button variant="outline" size="sm" type="submit">
            {t("signOut")}
          </Button>
        </form>
      </div>
      <div className="pt-8">{children}</div>
    </div>
  );
}
