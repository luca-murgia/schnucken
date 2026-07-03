import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { sections } from "@/lib/nav";
import { PaymentMethods } from "@/components/site/payment-methods";

export async function SiteFooter() {
  const tNav = await getTranslations("nav");
  const tFoot = await getTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-espresso text-cream">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Image
              src="/schnucken-logo.png"
              alt=""
              width={32}
              height={32}
              className="size-8 rounded-full"
            />
            <div className="font-heading text-lg font-semibold">
              {tNav("brand")}
            </div>
          </div>
          <p className="mt-2 max-w-xs text-sm text-cream/70">
            {tFoot("tagline")}
          </p>
        </div>

        <PaymentMethods />

        <div>
          <div className="text-xs font-semibold tracking-wider text-cream/60 uppercase">
            {tFoot("sectionsHeading")}
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {sections.map((s) => (
              <li key={s.key}>
                <Link
                  href={s.href}
                  className="text-cream/80 transition-colors hover:text-cream"
                >
                  {tNav(s.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-xs font-semibold tracking-wider text-cream/60 uppercase">
            {tFoot("legalHeading")}
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                href="/impressum"
                className="text-cream/80 transition-colors hover:text-cream"
              >
                {tFoot("impressum")}
              </Link>
            </li>
            <li>
              <Link
                href="/datenschutz"
                className="text-cream/80 transition-colors hover:text-cream"
              >
                {tFoot("datenschutz")}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/15">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-cream/60 md:px-6">
          © {year} {tNav("brand")}. {tFoot("rights")}
        </div>
      </div>
    </footer>
  );
}
