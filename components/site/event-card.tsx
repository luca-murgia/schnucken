import Image from "next/image";
import { CalendarDays } from "lucide-react";

import type { EventCard as EventData } from "@/lib/events";

/**
 * Render an event description as paragraphs. Blank lines (\n\n) separate
 * paragraphs; single newlines become line breaks within a paragraph — so a
 * short list like the "Sunday Service" menu keeps its shape.
 */
function DescriptionBody({ text }: { text: string }) {
  const paragraphs = text.split(/\n{2,}/).filter((p) => p.trim());
  return (
    <div className="space-y-3 text-ink/80">
      {paragraphs.map((paragraph, i) => {
        const lines = paragraph.split("\n");
        return (
          <p key={i} className="leading-relaxed">
            {lines.map((line, j) => (
              <span key={j}>
                {j > 0 && <br />}
                {line}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

export function EventCard({ event }: { event: EventData }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm sm:flex-row">
      <div className="w-full shrink-0 p-4 sm:w-56 md:w-64 lg:w-72">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-oat">
          {event.image ? (
            <Image
              src={event.image}
              alt={event.title}
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, 18rem"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-clay/50">
              <CalendarDays className="size-10" />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-ink md:text-3xl">
          {event.title}
        </h2>
        {event.subtitle && (
          <p className="text-sm font-semibold tracking-wide text-clay">
            {event.subtitle}
          </p>
        )}
        <DescriptionBody text={event.description} />
      </div>
    </article>
  );
}
