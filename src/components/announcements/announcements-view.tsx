"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Megaphone, Pin } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { formatDate } from "@/lib/utils";
import {
  mockAnnouncements as initialAnnouncements,
  mockSchool,
  mockUsers,
  DEMO_TODAY,
  type Announcement,
} from "@/lib/mock-data";

const announcementSchema = z.object({
  title: z.string().min(2, "Enter a title"),
  body: z.string().min(5, "Write a short message"),
});
type AnnouncementValues = z.infer<typeof announcementSchema>;

/**
 * Announcements go to the whole STEM Club. There is no narrower audience to
 * pick, so there is no audience picker.
 */
export function AnnouncementsView({ canManage }: { canManage: boolean }) {
  const [announcements, setAnnouncements] = React.useState<Announcement[]>(initialAnnouncements);
  const [open, setOpen] = React.useState(false);

  const form = useForm<AnnouncementValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: { title: "", body: "" },
  });

  const sorted = [...announcements].sort(
    (a, b) => Number(b.pinned) - Number(a.pinned) || (a.date < b.date ? 1 : -1),
  );

  function onPost(values: AnnouncementValues) {
    setAnnouncements((prev) => [
      {
        id: `ann_new_${prev.length}_${values.title.length}`,
        title: values.title,
        body: values.body,
        author: mockUsers.school_admin.name,
        pinned: false,
        date: DEMO_TODAY,
      },
      ...prev,
    ]);
    toast.success("Announcement posted to the STEM Club");
    form.reset();
    setOpen(false);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={mockSchool.clubName}
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
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onPost)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Weekly meeting moves to Lab 2" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="body"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea rows={4} placeholder="Give students the details…" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit" disabled={form.formState.isSubmitting}>Post Announcement</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          ) : undefined
        }
      />

      {sorted.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No announcements have been posted yet"
          description="Post one to keep the whole STEM Club in the loop."
        />
      ) : (
        <div className="space-y-3">
          {sorted.map((a) => (
            <div key={a.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display font-semibold">{a.title}</h3>
                {a.pinned ? <Pin className="size-4 shrink-0 text-primary" /> : null}
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">{a.body}</p>
              <p className="mt-3 font-mono text-xs text-muted-foreground">
                {a.author} · {formatDate(a.date)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
