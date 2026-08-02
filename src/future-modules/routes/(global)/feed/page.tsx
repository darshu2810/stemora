"use client";

import * as React from "react";
import Link from "next/link";
import { Rss, FolderKanban, FlaskConical, Trophy, MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EngagementBar } from "@/components/community/engagement-bar";
import { useFollows } from "@/lib/use-follows";
import { buildGlobalFeed, type FeedItemType } from "@/lib/mock-global";

const TYPE_ICON: Record<FeedItemType, typeof Rss> = {
  project: FolderKanban,
  research: FlaskConical,
  competition_result: Trophy,
  forum: MessageSquare,
  achievement: Trophy,
};

export default function FeedPage() {
  const { isFollowing } = useFollows();
  const [tab, setTab] = React.useState<"all" | "following">("all");
  const feed = React.useMemo(() => buildGlobalFeed(), []);

  const filtered = feed.filter((item) => tab === "all" || (item.schoolId && isFollowing(`school:${item.schoolId}`)));

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="STEMORA Network" title="Feed" description="What's happening across every school in the network." />

      <Tabs value={tab} onValueChange={(v) => v && setTab(v as "all" | "following")}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Rss}
          title={tab === "following" ? "Follow schools to see them here" : "Nothing in the feed yet"}
          description={tab === "following" ? "Follow a school from its profile to see their activity in this feed." : "Check back soon."}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => {
            const Icon = TYPE_ICON[item.type];
            return (
              <div key={item.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="size-4" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{item.actor}</span>
                      {item.school ? <> · {item.school}</> : null} · {item.time}
                    </p>
                    <Link href={item.href} className="mt-1 block font-display text-sm font-semibold hover:text-primary">
                      {item.title}
                    </Link>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.body}</p>
                    <EngagementBar
                      className="mt-2 -ml-2"
                      initialLikes={item.likes}
                      initialBookmarks={item.bookmarks}
                      commentCount={item.commentCount}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
