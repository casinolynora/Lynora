import Link from "next/link";
import { cn } from "@/lib/utils/format";

type RelatedGuidesProps = {
  guides: Array<{ title: string; slug: string; description?: string }>;
  className?: string;
};

export function RelatedGuides({ guides, className }: RelatedGuidesProps) {
  if (guides.length === 0) return null;

  return (
    <section className={cn("mb-8", className)} aria-labelledby="related-guides-title">
      <h2 id="related-guides-title" className="text-xl font-bold mb-4">
        Related Guides
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="card-static p-4 hover:border-brand-300 transition-colors group"
          >
            <h3 className="font-medium text-foreground group-hover:text-brand-600 transition-colors text-sm">
              {guide.title}
            </h3>
            {guide.description && (
              <p className="text-xs text-muted mt-1 line-clamp-2">{guide.description}</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
