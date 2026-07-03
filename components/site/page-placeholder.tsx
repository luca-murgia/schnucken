import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  intro: string;
  comingSoon: string;
  back: string;
};

/** Themed placeholder used by each section page until real content is added. */
export function PagePlaceholder({ title, intro, comingSoon, back }: Props) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-20 md:px-6 md:py-28">
      <span className="text-xs font-semibold tracking-[0.18em] text-clay uppercase">
        {comingSoon}
      </span>
      <h1 className="mt-3 text-4xl font-semibold text-ink md:text-5xl">
        {title}
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{intro}</p>
      <div className="mt-8">
        <Button asChild variant="outline">
          <Link href="/">{back}</Link>
        </Button>
      </div>
    </section>
  );
}
