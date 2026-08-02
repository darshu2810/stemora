"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Users, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge, type StatusKind } from "@/components/shared/status-badge";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { ClubFilter } from "@/components/shared/club-filter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { mockMembers as initialMembers, mockClubs, type SchoolMember, type MemberStatus } from "@/lib/mock-data";
import { ROLE_LABELS, SCHOOL_ROLES, type UserRole } from "@/config/roles";

const inviteSchema = z.object({
  email: z.email("Enter a valid email"),
  role: z.custom<UserRole>(),
  clubId: z.string().optional(),
});
type InviteValues = z.infer<typeof inviteSchema>;

const STATUS_MAP: Record<MemberStatus, StatusKind> = { active: "active", invited: "pending", suspended: "suspended" };

// SCHOOL_ROLES excludes platform_owner — STEMORA staff are never school members.
const SELECTABLE_ROLES = SCHOOL_ROLES;

const ROLE_FILTER_LABELS: Record<string, string> = {
  all: "All roles",
  ...Object.fromEntries(SELECTABLE_ROLES.map((r) => [r, ROLE_LABELS[r]])),
};

export default function PeoplePage() {
  const [members, setMembers] = React.useState<SchoolMember[]>(initialMembers);
  const [roleFilter, setRoleFilter] = React.useState<UserRole | "all">("all");
  const [clubFilter, setClubFilter] = React.useState<string>("all");
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<SchoolMember | null>(null);

  const form = useForm<InviteValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: "", role: "student" },
  });

  const filtered = members.filter(
    (m) => (roleFilter === "all" || m.role === roleFilter) && (clubFilter === "all" || m.clubId === clubFilter)
  );

  const columns: DataTableColumn<SchoolMember>[] = [
    {
      key: "name",
      header: "Member",
      render: (m) => (
        <div className="flex items-center gap-2.5">
          <Avatar className="size-7">
            <AvatarFallback className="bg-primary/10 text-[0.65rem] font-medium text-primary">{m.avatarInitials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{m.name}</p>
            <p className="text-xs text-muted-foreground">{m.email}</p>
          </div>
        </div>
      ),
    },
    { key: "role", header: "Role", render: (m) => ROLE_LABELS[m.role] },
    { key: "club", header: "Club", render: (m) => m.club ?? "—" },
    { key: "status", header: "Status", render: (m) => <StatusBadge status={STATUS_MAP[m.status]} label={m.status} /> },
    { key: "joinedAt", header: "Joined", render: (m) => m.joinedAt, className: "text-muted-foreground" },
  ];

  function onInvite(values: InviteValues) {
    const club = mockClubs.find((c) => c.id === values.clubId);
    setMembers((prev) => [
      {
        id: `member_new_${Date.now()}`,
        name: values.email.split("@")[0],
        email: values.email,
        role: values.role,
        clubId: club?.id ?? null,
        club: club?.name ?? null,
        clubRole: club ? "member" : null,
        status: "invited",
        joinedAt: new Date().toISOString().slice(0, 10),
        avatarInitials: values.email.slice(0, 2).toUpperCase(),
      },
      ...prev,
    ]);
    toast.success(`Invitation sent to ${values.email}`);
    form.reset();
    setInviteOpen(false);
  }

  function removeMember(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    toast.success("Member removed");
    setSelected(null);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="School"
        title="Members"
        description={`${members.length} people across every club.`}
        actions={
          <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
            <DialogTrigger render={<Button><Plus className="size-4" /> Invite member</Button>} />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite a member</DialogTitle>
                <DialogDescription>They&apos;ll get an email invite to join the school.</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onInvite)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="name@student.sman8jakarta.sch.id" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {SELECTABLE_ROLES.map((r) => (
                              <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                              <SelectValue placeholder="No club" />
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
                    <Button type="submit" disabled={form.formState.isSubmitting}>Send invite</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        }
      />

      <DataTable
        data={filtered}
        columns={columns}
        rowKey={(m) => m.id}
        searchPlaceholder="Search members…"
        searchFn={(m, q) => [m.name, m.email].some((f) => f.toLowerCase().includes(q.toLowerCase()))}
        onRowClick={(m) => setSelected(m)}
        emptyIcon={Users}
        emptyTitle="No members match your filters"
        emptyDescription="Try a different role, club, or search term."
        toolbar={
          <div className="flex gap-2">
            <Select
              items={ROLE_FILTER_LABELS}
              value={roleFilter}
              onValueChange={(v) => setRoleFilter(v as UserRole | "all")}
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                {SELECTABLE_ROLES.map((r) => (
                  <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ClubFilter value={clubFilter} onChange={setClubFilter} className="w-40" />
          </div>
        }
      />

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent>
          {selected ? (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  <Avatar className="size-9">
                    <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">{selected.avatarInitials}</AvatarFallback>
                  </Avatar>
                  {selected.name}
                </SheetTitle>
                <SheetDescription>{selected.email}</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 px-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Role</span>
                  <span className="font-medium">{ROLE_LABELS[selected.role]}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Club</span>
                  <span className="font-medium">{selected.club ?? "—"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Club role</span>
                  <span className="font-medium capitalize">{selected.clubRole ?? "—"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={STATUS_MAP[selected.status]} label={selected.status} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Joined</span>
                  <span className="font-medium">{selected.joinedAt}</span>
                </div>
              </div>
              <SheetFooter>
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button variant="destructive" className="w-full">
                        <Trash2 className="size-4" /> Remove from school
                      </Button>
                    }
                  />
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove {selected.name}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        They&apos;ll lose access to every club and workspace immediately.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => removeMember(selected.id)}>Remove</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
