import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageSquare, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { mockForumCategories, mockForumThreads } from "@/lib/mock-global";

export default async function ForumCategoryPage({ params }: { params: Promise<{ categoryId: string }> }) {
  const { categoryId } = await params;
  const category = mockForumCategories.find((c) => c.id === categoryId);
  if (!category) notFound();

  const threads = mockForumThreads
    .filter((t) => t.categoryId === categoryId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Forums" title={category.name} description={category.description} />

      {threads.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No threads yet" description="Be the first to start a discussion here." />
      ) : (
        <div className="divide-y divide-border rounded-xl border border-border bg-card">
          {threads.map((t) => (
            <Link
              key={t.id}
              href={`/forums/${categoryId}/${t.id}`}
              className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-secondary/40"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{t.title}</p>
                <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{t.body}</p>
                <p className="mt-1 font-mono text-[0.65rem] text-muted-foreground">
                  {t.author} · {t.createdAt} · {t.posts.length} {t.posts.length === 1 ? "reply" : "replies"}
                </p>
              </div>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
