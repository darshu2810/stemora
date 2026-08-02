"use client";

import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFollows } from "@/lib/use-follows";
import { cn } from "@/lib/utils";

export function FollowButton({ id, className }: { id: string; className?: string }) {
  const { isFollowing, toggleFollow } = useFollows();
  const following = isFollowing(id);

  return (
    <Button
      variant={following ? "outline" : "default"}
      size="sm"
      className={cn(className)}
      onClick={() => toggleFollow(id)}
    >
      {following ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}
      {following ? "Following" : "Follow"}
    </Button>
  );
}
