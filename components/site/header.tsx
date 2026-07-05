import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { auth } from "@/auth";
import { Link } from "@/i18n/navigation";
import { sections } from "@/lib/nav";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./language-switcher";
import { MobileNav } from "./mobile-nav";

export async function SiteHeader() {
  const t = await getTranslations("nav");
  // Show the backoffice link only to a signed-in admin — clients never see it.
  const session = await auth();
  const isAdmin = session?.user?.role === "admin";

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-cream/85 backdrop-blur supports-[backdrop-filter]:bg-cream/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-heading text-xl font-semibold tracking-tight text-espresso"
        >
          <Image
            src="/schnucken-logo.png"
            alt=""
            width={36}
            height={36}
            priority
            className="size-9 rounded-full"
          />
          {t("brand")}
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {sections.map((s) => (
            <Link
              key={s.key}
              href={s.href}
              className="text-sm font-medium text-ink/75 transition-colors hover:text-espresso"
            >
              {t(s.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          {/* Login stays hidden for the public demo — clients don't need
              accounts. Once the owner is signed in, an Admin link appears here
              for one-click access back to the backoffice. */}
          {isAdmin && (
            <Button
              asChild
              size="sm"
              variant="outline"
              className="hidden md:inline-flex"
            >
              <Link href="/admin">{t("admin")}</Link>
            </Button>
          )}
          <div className="md:hidden">
            <MobileNav isAdmin={isAdmin} />
          </div>
        </div>
      </div>
    </header>
  );
}
