import { Pencil } from "lucide-react";

import { auth } from "@/auth";
import { Link } from "@/i18n/navigation";

/**
 * A discreet floating "Edit" pill shown on a public page — but only to a
 * logged-in admin. Clients (and logged-out visitors) get nothing. It deep-links
 * into the matching backoffice editor, giving in-context editing without pulling
 * the editing UI into the public page. Drop one onto any editable page.
 */
export async function AdminEditButton({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const session = await auth();
  if (session?.user?.role !== "admin") return null;

  return (
    <Link
      href={href}
      className="fixed right-5 bottom-5 z-40 inline-flex items-center gap-2 rounded-full bg-espresso px-4 py-2.5 text-sm font-medium text-cream shadow-lg ring-1 ring-black/10 transition-colors hover:bg-espresso/90 md:right-6 md:bottom-6"
    >
      <Pencil className="size-4" />
      {label}
    </Link>
  );
}
