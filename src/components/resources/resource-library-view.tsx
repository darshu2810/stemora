"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Library, FileText, Link2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { CategoryFilter, ALL_CATEGORIES } from "@/components/shared/category-filter";
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
import { formatDate } from "@/lib/utils";
import {
  mockResources as initialResources,
  mockSchool,
  mockUsers,
  RESOURCE_CATEGORIES,
  DEMO_TODAY,
  type Resource,
  type ResourceCategory,
  type ResourceType,
} from "@/lib/mock-data";

const TYPE_LABELS: Record<string, string> = { link: "Link", file: "File" };

const resourceSchema = z.object({
  title: z.string().min(2, "Enter a title"),
  type: z.custom<ResourceType>(),
  category: z.custom<ResourceCategory>(),
  meta: z.string().min(2, "Enter a link or file size"),
});
type ResourceValues = z.infer<typeof resourceSchema>;

/**
 * The STEM Club's shared library. Resources belong to the club; the category
 * mirrors the project categories so a student can find the electronics notes
 * without there being an electronics club.
 */
export function ResourceLibraryView({ canManage }: { canManage: boolean }) {
  const [resources, setResources] = React.useState<Resource[]>(initialResources);
  const [category, setCategory] = React.useState<string>(ALL_CATEGORIES);
  const [open, setOpen] = React.useState(false);

  const form = useForm<ResourceValues>({
    resolver: zodResolver(resourceSchema),
    defaultValues: { title: "", type: "link", category: "General", meta: "" },
  });

  const filtered = resources.filter((r) => category === ALL_CATEGORIES || r.category === category);

  function onAdd(values: ResourceValues) {
    setResources((prev) => [
      {
        id: `res_new_${prev.length}_${values.title.length}`,
        title: values.title,
        category: values.category,
        type: values.type,
        meta: values.meta,
        uploadedBy: mockUsers.school_admin.name,
        date: DEMO_TODAY,
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
    { key: "category", header: "Category", render: (r) => r.category },
    { key: "uploadedBy", header: "Uploaded by", render: (r) => r.uploadedBy },
    { key: "date", header: "Date", render: (r) => formatDate(r.date), className: "text-muted-foreground" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={mockSchool.clubName}
        title="Resources"
        description={`${resources.length} files and links shared with the club.`}
        actions={
          canManage ? (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger render={<Button><Plus className="size-4" /> Upload Resource</Button>} />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload a resource</DialogTitle>
                  <DialogDescription>Share a file or a link with everyone in the STEM Club.</DialogDescription>
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
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select items={TYPE_LABELS} value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(TYPE_LABELS).map(([value, label]) => (
                                  <SelectItem key={value} value={value}>{label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {RESOURCE_CATEGORIES.map((c) => (
                                  <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="meta"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link or file size</FormLabel>
                          <FormControl>
                            <Input placeholder="docs.arduino.cc or 2.1 MB" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit" disabled={form.formState.isSubmitting}>Upload Resource</Button>
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
        emptyTitle="No resources in this category yet"
        emptyDescription="Choose a different category, or upload the first file for this one."
        toolbar={
          <CategoryFilter value={category} onChange={setCategory} categories={RESOURCE_CATEGORIES} />
        }
      />
    </div>
  );
}
