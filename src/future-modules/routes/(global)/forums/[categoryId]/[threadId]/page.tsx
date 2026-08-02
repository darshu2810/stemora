import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CommentSection } from "@/components/community/comment-section";
import { mockForumCategories, mockForumThreads } from "@/lib/mock-global";

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

export default async function ForumThreadPage({
  params,
}: {
  params: Promise<{ categoryId: string; threadId: string }>;
}) {
  const { categoryId, threadId } = await params;
  const category = mockForumCategories.find((c) => c.id === categoryId);
  const thread = mockForumThreads.find((t) => t.id === threadId && t.categoryId === categoryId);
  if (!category || !thread) notFound();

  const replies = thread.posts.map((p) => ({ id: p.id, author: p.author, body: p.body, time: p.time }));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href={`/forums/${categoryId}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> {category.name}
      </Link>

      <div className="rounded-xl border border-border bg-card p-6">
        <h1 className="font-display text-xl font-semibold">{thread.title}</h1>
        <div className="mt-3 flex items-center gap-2.5">
          <Avatar className="size-8">
            <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">{initials(thread.author)}</AvatarFallback>
          </Avatar>
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{thread.author}</span> · {thread.createdAt}
          </p>
        </div>
        <p className="mt-4 text-sm leading-relaxed">{thread.body}</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <CommentSection initialComments={replies} />
      </div>
    </div>
  );
}
