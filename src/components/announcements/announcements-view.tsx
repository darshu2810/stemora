"use client";

import * as React from "react";
import { Plus, Megaphone, Pin, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ActionForm, SubmitButton, ActionButton } from "@/components/shared/action-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { postAnnouncement, deleteAnnouncement } from "@/lib/db/actions";
import type { AnnouncementWithAuthor } from "@/lib/db/queries";

export function AnnouncementsView({
  clubName,
  announcements,
  canManage,
}: {
  clubName: string;
  announcements: AnnouncementWithAuthor[];
  canManage: boolean;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={clubName}
        title="Announcements"
        description="What everyone in the club needs to know."
        actions={
          canManage ? (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger render={<Button><Plus className="size-4" /> Post Announcement</Button>} />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Post an announcement</DialogTitle>
                  <DialogDescription>Everyone in the STEM Club will see it.</DialogDescription>
                </DialogHeader>
                <ActionForm action={postAnnouncement} onSuccess={() => setOpen(false)}>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" required placeholder="Weekly meeting moves to Lab 2" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="body">Message</Label>
                    <Textarea id="body" name="body" rows={4} required placeholder="Give students the details…" />
                  </div>
                  <Label className="flex items-center gap-2 font-normal">
                    <Checkbox name="pinned" /> Pin to the top
                  </Label>
                  <DialogFooter>
                    <SubmitButton pendingLabel="Posting…">Post Announcement</SubmitButton>
                  </DialogFooter>
                </ActionForm>
              </DialogContent>
            </Dialog>
          ) : undefined
        }
      />

      {announcements.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No announcements have been posted yet"
          description={
            canManage
              ? "Post one to keep the whole STEM Club in the loop."
              : "When your School Admin posts one, it appears here."
          }
        />
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <div key={a.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display font-semibold">{a.title}</h3>
                <div className="flex shrink-0 items-center gap-1">
                  {a.pinned ? <Pin className="size-4 text-primary" /> : null}
                  {canManage ? (
                    <ActionButton
                      action={deleteAnnouncement}
                      fields={{ announcementId: a.id }}
                      size="icon"
                      ariaLabel={`Delete ${a.title}`}
                    >
                      <Trash2 className="size-4" />
                    </ActionButton>
                  ) : null}
                </div>
              </div>
              <p className="mt-1.5 whitespace-pre-line text-sm text-muted-foreground">{a.body}</p>
              <p className="mt-3 font-mono text-xs text-muted-foreground">
                {a.authorName} · {formatDate(a.created_at)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
