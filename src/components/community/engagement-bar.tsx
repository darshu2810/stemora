"use client";

import * as React from "react";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EngagementBar({
  initialLikes,
  initialBookmarks,
  commentCount,
  onCommentClick,
  className,
}: {
  initialLikes: number;
  initialBookmarks?: number;
  commentCount: number;
  onCommentClick?: () => void;
  className?: string;
}) {
  const [liked, setLiked] = React.useState(false);
  const [bookmarked, setBookmarked] = React.useState(false);
  const [likes, setLikes] = React.useState(initialLikes);
  const [bookmarks, setBookmarks] = React.useState(initialBookmarks ?? 0);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setLiked((v) => !v);
          setLikes((n) => (liked ? n - 1 : n + 1));
        }}
        className={cn(liked && "text-destructive hover:text-destructive")}
      >
        <Heart className={cn("size-4", liked && "fill-current")} />
        {likes}
      </Button>
      <Button variant="ghost" size="sm" onClick={onCommentClick}>
        <MessageCircle className="size-4" />
        {commentCount}
      </Button>
      {initialBookmarks !== undefined ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setBookmarked((v) => !v);
            setBookmarks((n) => (bookmarked ? n - 1 : n + 1));
          }}
          className={cn(bookmarked && "text-primary hover:text-primary")}
        >
          <Bookmark className={cn("size-4", bookmarked && "fill-current")} />
          {bookmarks}
        </Button>
      ) : null}
    </div>
  );
}
