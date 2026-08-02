"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { mockClubs as initialClubs } from "@/lib/mock-data";

const clubSchema = z.object({
  name: z.string().min(2, "Enter a club name"),
  category: z.string().min(2, "Enter a category"),
  description: z.string().optional(),
});
type ClubValues = z.infer<typeof clubSchema>;

const COVERS = [
  "from-primary to-brand-spark",
  "from-emerald-500 to-teal-400",
  "from-fuchsia-500 to-purple-500",
  "from-amber-500 to-orange-500",
  "from-sky-500 to-blue-500",
];

export default function ClubsPage() {
  const [clubs, setClubs] = React.useState(initialClubs);
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const form = useForm<ClubValues>({
    resolver: zodResolver(clubSchema),
    defaultValues: { name: "", category: "", description: "" },
  });

  const filtered = clubs.filter(
    (c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.category.toLowerCase().includes(query.toLowerCase())
  );

  function onSubmit(values: ClubValues) {
    setClubs((prev) => [
      ...prev,
      {
        id: `club_${prev.length + 1}_${Date.now()}`,
        name: values.name,
        category: values.category,
        members: 1,
        cover: COVERS[prev.length % COVERS.length],
      },
    ]);
    toast.success(`${values.name} created`);
    form.reset();
    setOpen(false);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="School"
        title="Clubs"
        description={`${clubs.length} clubs running this term.`}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button><Plus className="size-4" /> Create club</Button>} />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a club</DialogTitle>
                <DialogDescription>New clubs start with you as the only member.</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Club name</FormLabel>
                        <FormControl>
                          <Input placeholder="Astronomy Club" {...field} />
                        </FormControl>
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
                        <FormControl>
                          <Input placeholder="Astronomy" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (optional)</FormLabel>
                        <FormControl>
                          <Textarea rows={3} placeholder="What does this club do?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                      Create club
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="relative max-w-xs">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search clubs…" className="pl-8" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Search} title="No clubs match your search" description="Try a different search term." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((club) => (
            <Link
              key={club.id}
              href={`/school/clubs/${club.id}`}
              className="overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/40"
            >
              <div className={`h-16 bg-gradient-to-br ${club.cover}`} />
              <div className="p-4">
                <h3 className="font-display text-sm font-semibold">{club.name}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {club.category} · {club.members} members
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
