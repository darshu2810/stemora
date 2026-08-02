"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Megaphone, Pin } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ClubFilter } from "@/components/shared/club-filter";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { mockAnnouncements as initialAnnouncements, mockClubs, mockUsers, type Announcement } from "@/lib/mock-data";

const announcementSchema = z.object({
  title: z.string().min(2, "Enter a title"),
  body: z.string().min(5, "Write a short message"),
  clubId: z.string().optional(),
});
type AnnouncementValues = z.infer<typeof announcementSchema>;

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = React.useState<Announcement[]>(initialAnnouncements);
  const [clubFilter, setClubFilter] = React.useState("all");
  const [open, setOpen] = React.useState(false);

  const form = useForm<AnnouncementValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: { title: "", body: "" },
  });

  const filtered = announcements
    .filter((a) => clubFilter === "all" || a.club === mockClubs.find((c) => c.id === clubFilter)?.name)
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || (a.date < b.date ? 1 : -1));

  function onPost(values: AnnouncementValues) {
    const club = mockClubs.find((c) => c.id === values.clubId);
    setAnnouncements((prev) => [
      {
        id: `ann_new_${prev.length}_${values.title.length}`,
        title: values.title,
        body: values.body,
        club: club?.name ?? null,
        author: mockUsers.school_admin.name,
        pinned: false,
        date: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    toast.success("Announcement posted");
    form.reset();
    setOpen(false);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="School"
        title="Announcements"
        description="What every club needs to know."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button><Plus className="size-4" /> New announcement</Button>} />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Post an announcement</DialogTitle>
                <DialogDescription>Leave the club blank to post school-wide.</DialogDescription>
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
                          <Input placeholder="Practice moved to Thursday" {...field} />
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
                          <Textarea rows={4} placeholder="Give members the details…" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="clubId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Club (optional)</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="School-wide" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockClubs.map((c) => (
                              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" disabled={form.formState.isSubmitting}>Post</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        }
      />

      <ClubFilter value={clubFilter} onChange={setClubFilter} />

      {filtered.length === 0 ? (
        <EmptyState icon={Megaphone} title="No announcements yet" description="Post one to keep everyone in the loop." />
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <div key={a.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display font-semibold">{a.title}</h3>
                {a.pinned ? <Pin className="size-4 shrink-0 text-primary" /> : null}
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">{a.body}</p>
              <p className="mt-3 font-mono text-xs text-muted-foreground">
                {a.author} · {a.club ?? "School-wide"} · {a.date}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
