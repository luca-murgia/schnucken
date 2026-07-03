"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

const ADDRESS = "Elfbuchenstraße 18, 34119 Kassel, Germany";
const MAP_EMBED = `https://maps.google.com/maps?q=${encodeURIComponent(
  ADDRESS,
)}&z=15&output=embed`;
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  ADDRESS,
)}`;

/**
 * Click-to-load Google map (GDPR-friendly): nothing is requested from Google
 * until the visitor explicitly loads the map. Also offers a plain link out.
 */
export function LocationMap() {
  const t = useTranslations("location");
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="space-y-3">
      <div className="aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-oat">
        {loaded ? (
          <iframe
            src={MAP_EMBED}
            title={t("mapTitle")}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="relative flex h-full w-full flex-col items-center justify-center gap-2 px-6 text-center transition-colors hover:bg-oat/60"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/world-map.webp"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 size-full object-cover opacity-30"
            />
            <MapPin className="relative size-7 text-espresso" />
            <span className="relative font-medium text-ink">
              {t("showMap")}
            </span>
            <span className="relative max-w-xs text-xs text-muted-foreground">
              {t("mapConsent")}
            </span>
          </button>
        )}
      </div>
      <a
        href={MAP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-espresso underline underline-offset-4 hover:text-espresso/80"
      >
        <MapPin className="size-4" />
        {t("openInMaps")}
      </a>
    </div>
  );
}
