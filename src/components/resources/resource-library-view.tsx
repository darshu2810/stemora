"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Library, FileText, Link2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ClubFilter } from "@/components/shared/club-filter";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { mockResources as initialResources, mockClubs, mockUsers, type Resource, type ResourceType } from "@/lib/mock-data";

const resourceSchema = z.object({
  title: z.string().min(2, "Enter a title"),
  type: z.custom<ResourceType>(),
  clubId: z.string().optional(),
  meta: z.string().min(2, "Enter a link or file note"),
});
type ResourceValues = z.infer<typeof resourceSchema>;

export function ResourceLibraryView({ eyebrow, canManage }: { eyebrow: string; canManage: boolean }) {
  const [resources, setResources] = React.useState<Resource[]>(initialResources);
  const [clubFilter, setClubFilter] = React.useState("all");
  const [open, setOpen] = React.useState(false);

  const form = useForm<ResourceValues>({
    resolver: zodResolver(resourceSchema),
    defaultValues: { title: "", type: "link", meta: "" },
  });

  const filtered = resources.filter((r) => clubFilter === "all" || r.club === mockClubs.find((c) => c.id === clubFilter)?.name);

  function onAdd(values: ResourceValues) {
    const club = mockClubs.find((c) => c.id === values.clubId);
    setResources((prev) => [
      {
        id: `res_new_${prev.length}_${values.title.length}`,
        title: values.title,
        club: club?.name ?? null,
        type: values.type,
        meta: values.meta,
        uploadedBy: mockUsers.school_admin.name,
        date: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    toast.success(`${values.title} added to the library`);
    form.reset();
    setOpen(false);
  }

  const columns: DataTableColumn<Resource>[] = [
    {
      key: "title",
      header: "Resource",
      render: (r) => (
        <div className="flex items-center gap-2.5">
          {r.type === "file" ? (
            <FileText className="size-4 shrink-0 text-muted-foreground" />
          ) : (
            <Link2 className="size-4 shrink-0 text-muted-foreground" />
          )}
          <div>
            <p className="font-medium">{r.title}</p>
            <p className="text-xs text-muted-foreground">{r.meta}</p>
          </div>
        </div>
      ),
    },
    { key: "club", header: "Club", render: (r) => r.club ?? "School-wide" },
    { key: "uploadedBy", header: "Uploaded by", render: (r) => r.uploadedBy },
    { key: "date", header: "Date", render: (r) => r.date, className: "text-muted-foreground" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={eyebrow}
        title="Resource library"
        description="Shared files and links for every club."
        actions={
          canManage ? (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger render={<Button><Plus className="size-4" /> Add resource</Button>} />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a resource</DialogTitle>
                  <DialogDescription>Files can&apos;t be uploaded yet in preview mode — add a link or a placeholder note.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onAdd)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Build Log Template.docx" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="link">Link</SelectItem>
                              <SelectItem value="file">File</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="meta"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link or file size</FormLabel>
                          <FormControl>
                            <Input placeholder="docs.google.com/… or 2.1 MB" {...field} />
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
                      <Button type="submit" disabled={form.formState.isSubmitting}>Add resource</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          ) : undefined
        }
      />

      <DataTable
        data={filtered}
        columns={columns}
        rowKey={(r) => r.id}
        searchPlaceholder="Search resources…"
        searchFn={(r, q) => r.title.toLowerCase().includes(q.toLowerCase())}
        emptyIcon={Library}
        emptyTitle="No resources match your filters"
        toolbar={
          <ClubFilter value={clubFilter} onChange={setClubFilter} />
        }
      />
    </div>
  );
}
