import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { sections } from "@/lib/nav";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./language-switcher";
import { MobileNav } from "./mobile-nav";

export async function SiteHeader() {
  const t = await getTranslations("nav");

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-cream/85 backdrop-blur supports-[backdrop-filter]:bg-cream/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <Link
          href="/"
          className="font-heading text-xl font-semibold tracking-tight text-forest"
        >
          {t("brand")}
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {sections.map((s) => (
            <Link
              key={s.key}
              href={s.href}
              className="text-sm font-medium text-ink/75 transition-colors hover:text-forest"
            >
              {t(s.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="/login">{t("login")}</Link>
          </Button>
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
