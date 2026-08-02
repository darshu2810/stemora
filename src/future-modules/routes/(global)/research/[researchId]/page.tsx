import Link from "next/link";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EngagementBar } from "@/components/community/engagement-bar";
import { CommentSection } from "@/components/community/comment-section";
import { mockResearchItems, mockGlobalSchools } from "@/lib/mock-global";

export default async function ResearchDetailPage({ params }: { params: Promise<{ researchId: string }> }) {
  const { researchId } = await params;
  const item = mockResearchItems.find((r) => r.id === researchId);
  if (!item) notFound();

  const school = mockGlobalSchools.find((s) => s.name === item.school);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{item.type}</Badge>
          <Badge variant="outline">{item.category}</Badge>
          <span className="font-mono text-xs text-muted-foreground">{item.date}</span>
        </div>
        <h1 className="mt-3 font-display text-2xl font-semibold leading-tight">{item.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {item.authors.join(", ")} ·{" "}
          {school ? (
            <Link href={`/schools/${school.slug}`} className="hover:text-foreground hover:underline">{item.school}</Link>
          ) : (
            item.school
          )}
        </p>
        <EngagementBar
          className="mt-3 -ml-2"
          initialLikes={item.likes}
          initialBookmarks={Math.round(item.likes / 4)}
          commentCount={item.comments.length}
        />
      </div>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Abstract</h2>
        <p className="mt-2 text-sm leading-relaxed">{item.abstract}</p>
      </section>

      <section className="flex items-center justify-between rounded-xl border border-dashed border-border bg-secondary/40 p-5">
        <div>
          <p className="text-sm font-medium">Full {item.type.toLowerCase()}</p>
          <p className="text-xs text-muted-foreground">Downloads aren&apos;t available in preview mode yet.</p>
        </div>
        <Download className="size-4 text-muted-foreground" />
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <CommentSection initialComments={item.comments} />
      </section>
    </div>
  );
}
