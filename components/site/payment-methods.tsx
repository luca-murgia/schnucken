import type { SVGProps } from "react";
import { getTranslations } from "next-intl/server";
import { Banknote, CreditCard } from "lucide-react";

// Two overlapping circles — the Mastercard / Maestro mark.
function TwoCircles({ left, right }: { left: string; right: string }) {
  return (
    <svg viewBox="0 0 34 22" className="h-3.5" aria-hidden="true">
      <circle cx="13" cy="11" r="9" fill={left} />
      <circle cx="21" cy="11" r="9" fill={right} />
    </svg>
  );
}

// The Apple logo glyph.
function AppleLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
    </svg>
  );
}

// The contactless-payment waves.
function Contactless(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M9 7.5a7 7 0 0 1 0 9" />
      <path d="M12.5 5a11 11 0 0 1 0 14" />
      <path d="M16 2.5a15 15 0 0 1 0 19" />
    </svg>
  );
}

export async function PaymentMethods() {
  const t = await getTranslations("payment");

  // Order matches the operator's list.
  const items: { label: string; mark: React.ReactNode }[] = [
    {
      label: t("cash"),
      mark: <Banknote className="h-3.5 w-3.5 text-espresso" strokeWidth={1.75} />,
    },
    {
      label: t("contactless"),
      mark: <Contactless className="h-3.5 text-espresso" />,
    },
    { label: "Mastercard", mark: <TwoCircles left="#EB001B" right="#F79E1B" /> },
    {
      label: "PayPal",
      mark: (
        <span className="text-[0.55rem] leading-none font-bold tracking-tight italic">
          <span className="text-[#003087]">Pay</span>
          <span className="text-[#0099DF]">Pal</span>
        </span>
      ),
    },
    {
      label: "Visa",
      mark: (
        <span className="text-[0.62rem] leading-none font-bold tracking-tight text-[#1434CB] italic">
          VISA
        </span>
      ),
    },
    {
      label: t("debit"),
      mark: (
        <CreditCard className="h-3.5 w-3.5 text-espresso" strokeWidth={1.75} />
      ),
    },
    {
      label: "Apple Pay",
      mark: (
        <span className="flex items-center gap-px leading-none text-black">
          <AppleLogo className="h-3 w-3" />
          <span className="text-[0.6rem] font-medium">Pay</span>
        </span>
      ),
    },
    { label: "Maestro", mark: <TwoCircles left="#0099DF" right="#ED0006" /> },
    {
      label: t("ecCard"),
      mark: (
        <span className="text-[0.62rem] leading-none font-bold tracking-tight text-espresso">
          EC
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="text-xs font-semibold tracking-wider text-cream/60 uppercase">
        {t("heading")}
      </div>
      <ul className="mt-3 grid w-fit grid-cols-3 gap-2">
        {items.map((it) => (
          <li
            key={it.label}
            title={it.label}
            aria-label={it.label}
            className="flex h-7 w-11 items-center justify-center rounded-md bg-white shadow-sm ring-1 ring-black/5"
          >
            {it.mark}
          </li>
        ))}
      </ul>
    </div>
  );
}
