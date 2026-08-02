import Link from "next/link";
import { MessageSquare, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { mockForumCategories, mockForumThreads } from "@/lib/mock-global";

export default function ForumsPage() {
  const recentThreads = [...mockForumThreads].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="STEMORA Network"
        title="Discussion forums"
        description="Ask questions, share build logs, and compare notes across schools."
      />

      <section className="space-y-4">
        <h2 className="font-display font-semibold">Categories</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockForumCategories.map((c) => {
            const threadCount = mockForumThreads.filter((t) => t.categoryId === c.id).length;
            return (
              <Link
                key={c.id}
                href={`/forums/${c.id}`}
                className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
              >
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MessageSquare className="size-4.5" strokeWidth={1.75} />
                </div>
                <h3 className="mt-3 font-display text-sm font-semibold">{c.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{c.description}</p>
                <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                  {threadCount} {threadCount === 1 ? "thread" : "threads"}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display font-semibold">Recent discussions</h2>
        <div className="divide-y divide-border rounded-xl border border-border bg-card">
          {recentThreads.map((t) => {
            const category = mockForumCategories.find((c) => c.id === t.categoryId);
            return (
              <Link
                key={t.id}
                href={`/forums/${t.categoryId}/${t.id}`}
                className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-secondary/40"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{t.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {category?.name} · {t.author} · {t.createdAt} · {t.posts.length}{" "}
                    {t.posts.length === 1 ? "reply" : "replies"}
                  </p>
                </div>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
