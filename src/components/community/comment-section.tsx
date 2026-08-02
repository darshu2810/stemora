"use client";

import * as React from "react";
import { Send } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMockSession } from "@/lib/mock-session";

export type SimpleComment = { id: string; author: string; body: string; time: string };

export function CommentSection({ initialComments }: { initialComments: SimpleComment[] }) {
  const { user } = useMockSession();
  const [comments, setComments] = React.useState(initialComments);
  const [draft, setDraft] = React.useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    setComments((prev) => [...prev, { id: `c_${prev.length}_${draft.length}`, author: user.name, body: draft, time: "Just now" }]);
    setDraft("");
  }

  return (
    <div className="space-y-4">
      <h2 className="font-display font-semibold">Comments ({comments.length})</h2>
      <form onSubmit={submit} className="flex items-center gap-2">
        <Avatar className="size-8 shrink-0">
          <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">{user.avatarInitials}</AvatarFallback>
        </Avatar>
        <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add a comment…" className="flex-1" />
        <Button type="submit" size="icon" aria-label="Post comment" disabled={!draft.trim()}>
          <Send className="size-4" />
        </Button>
      </form>
      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-2.5">
            <Avatar className="size-8 shrink-0">
              <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                {c.author.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm">
                <span className="font-medium">{c.author}</span>{" "}
                <span className="ml-1 font-mono text-xs text-muted-foreground">{c.time}</span>
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">{c.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
