"use client";

import * as React from "react";
import { Plus, FileText, Link2, Library, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { CategoryFilter, ALL_CATEGORIES } from "@/components/shared/category-filter";
import { ActionForm, SubmitButton, ActionButton } from "@/components/shared/action-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { formatDate } from "@/lib/utils";
import { PROJECT_CATEGORIES } from "@/config/categories";
import { addResource, deleteResource } from "@/lib/db/actions";
import type { ResourceWithUploader } from "@/lib/db/queries";

const TYPE_LABELS: Record<string, string> = { link: "Link", file: "File" };
const GENERAL = "General";

function formatSize(bytes: number | null) {
  if (bytes === null) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * The club's shared files and links. Files live in a private Supabase Storage
 * bucket and are reached through a short-lived signed URL, so a resource is
 * only ever readable by someone who is still a member of the school.
 */
export function ResourceLibraryView({
  clubName,
  resources,
  canManage,
}: {
  clubName: string;
  resources: ResourceWithUploader[];
  canManage: boolean;
}) {
  const [category, setCategory] = React.useState<string>(ALL_CATEGORIES);
  const [type, setType] = React.useState<string>("link");
  const [open, setOpen] = React.useState(false);

  const categoryLabels = {
    [GENERAL]: GENERAL,
    ...Object.fromEntries(PROJECT_CATEGORIES.map((c) => [c, c])),
  };

  const filtered = resources.filter(
    (r) => category === ALL_CATEGORIES || (r.category ?? GENERAL) === category,
  );

  const columns: DataTableColumn<ResourceWithUploader>[] = [
    {
      key: "title",
      header: "Resource",
      render: (r) => {
        const href = r.type === "file" ? `/api/resources/${r.id}/download` : r.url ?? "#";
        return (
          <div className="flex items-center gap-2.5">
            {r.type === "file" ? (
              <FileText className="size-4 shrink-0 text-muted-foreground" />
            ) : (
              <Link2 className="size-4 shrink-0 text-muted-foreground" />
            )}
            <div className="min-w-0">
              <a
                href={href}
                target={r.type === "link" ? "_blank" : undefined}
                rel={r.type === "link" ? "noreferrer noopener" : undefined}
                className="font-medium hover:text-primary hover:underline"
              >
                {r.title}
              </a>
              <p className="truncate text-xs text-muted-foreground">
                {r.type === "file" ? formatSize(r.size_bytes) : r.url}
              </p>
            </div>
          </div>
        );
      },
    },
    { key: "category", header: "Category", render: (r) => r.category ?? GENERAL },
    { key: "uploadedBy", header: "Added by", render: (r) => r.uploaderName },
    {
      key: "date",
      header: "Date",
      render: (r) => formatDate(r.created_at),
      className: "text-muted-foreground",
    },
    ...(canManage
      ? [
          {
            key: "actions",
            header: "",
            render: (r: ResourceWithUploader) => (
              <ActionButton
                action={deleteResource}
                fields={{ resourceId: r.id }}
                size="icon"
                ariaLabel={`Delete ${r.title}`}
              >
                <Trash2 className="size-4" />
              </ActionButton>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={clubName}
        title="Resources"
        description={
          resources.length === 0
            ? "Files and links shared with the club will appear here."
            : `${resources.length} ${resources.length === 1 ? "file or link" : "files and links"} shared with the club.`
        }
        actions={
          canManage ? (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger render={<Button><Plus className="size-4" /> Add Resource</Button>} />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a resource</DialogTitle>
                  <DialogDescription>Share a file or a link with everyone in the STEM Club.</DialogDescription>
                </DialogHeader>
                <ActionForm action={addResource} onSuccess={() => setOpen(false)}>
                  <div className="space-y-2">
                    <Label htmlFor="resource-title">Title</Label>
                    <Input id="resource-title" name="title" placeholder="Build log template" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="resource-type">Type</Label>
                      <Select items={TYPE_LABELS} value={type} onValueChange={(v) => setType(v ?? "link")} name="type">
                        <SelectTrigger id="resource-type" className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(TYPE_LABELS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="resource-category">Category</Label>
                      <Select items={categoryLabels} defaultValue={GENERAL} name="category">
                        <SelectTrigger id="resource-category" className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={GENERAL}>{GENERAL}</SelectItem>
                          {PROJECT_CATEGORIES.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {type === "link" ? (
                    <div className="space-y-2">
                      <Label htmlFor="resource-url">Link</Label>
                      <Input
                        id="resource-url"
                        name="url"
                        type="url"
                        placeholder="https://docs.arduino.cc"
                        required
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="resource-file">File</Label>
                      <Input id="resource-file" name="file" type="file" required />
                      <p className="text-xs text-muted-foreground">Up to 25 MB.</p>
                    </div>
                  )}
                  <DialogFooter>
                    <SubmitButton pendingLabel="Adding…">Add Resource</SubmitButton>
                  </DialogFooter>
                </ActionForm>
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
        emptyTitle={resources.length === 0 ? "No resources yet" : "No resources match your search"}
        emptyDescription={
          resources.length === 0
            ? canManage
              ? "Add the first file or link for the club."
              : "Your School Admin hasn't shared anything yet."
            : "Try a different word, or another category."
        }
        toolbar={
          resources.length > 0 ? (
            <CategoryFilter
              value={category}
              onChange={setCategory}
              categories={[GENERAL, ...PROJECT_CATEGORIES]}
            />
          ) : undefined
        }
      />
    </div>
  );
}
