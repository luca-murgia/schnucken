"use client";

import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { sections } from "@/lib/nav";
import { useUIStore } from "@/store/ui";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LanguageSwitcher } from "./language-switcher";

export function MobileNav() {
  const t = useTranslations("nav");
  // Mobile-nav open state lives in the Zustand UI store.
  const open = useUIStore((s) => s.mobileNavOpen);
  const setOpen = useUIStore((s) => s.setMobileNavOpen);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t("openMenu")}>
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 bg-cream">
        <SheetHeader>
          <SheetTitle className="font-heading text-forest">
            {t("brand")}
          </SheetTitle>
        </SheetHeader>

        <nav className="mt-4 flex flex-col gap-1 px-4">
          {sections.map((s) => (
            <SheetClose asChild key={s.key}>
              <Link
                href={s.href}
                className="rounded-md px-3 py-2 text-base font-medium text-ink/80 transition-colors hover:bg-oat hover:text-forest"
              >
                {t(s.key)}
              </Link>
            </SheetClose>
          ))}
          <SheetClose asChild>
            <Link
              href="/login"
              className="mt-2 rounded-md bg-forest px-3 py-2 text-center text-base font-medium text-cream transition-colors hover:bg-forest/90"
            >
              {t("login")}
            </Link>
          </SheetClose>
        </nav>

        <div className="mt-6 px-4">
          <LanguageSwitcher />
        </div>
      </SheetContent>
    </Sheet>
  );
}
