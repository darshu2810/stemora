"use client";

import * as React from "react";
import {
  Plus,
  Users,
  UserCheck,
  MailWarning,
  Lock,
  ShieldCheck,
  RotateCcw,
  Send,
  Trash2,
  TriangleAlert,
  UserRoundPlus,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge, type StatusKind } from "@/components/shared/status-badge";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { ActionForm, SubmitButton } from "@/components/shared/action-form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatDate, initialsOf } from "@/lib/utils";
import type { AccessRow } from "@/lib/db/queries";
import {
  decideJoinRequest,
  inviteStudent,
  resendInvitation,
  revokeInvitation,
  setMemberRole,
  setMemberStatus,
  type ActionResult,
} from "@/lib/db/actions";
import type { MembershipStatus } from "@/lib/supabase/types";

const GRADES = [8, 9, 10, 11, 12] as const;
const GRADE_ITEMS = Object.fromEntries(GRADES.map((g) => [String(g), `Grade ${g}`]));

const FILTER_ITEMS: Record<string, string> = {
  all: "Everyone",
  pending: "Asked to join",
  active: "Has access",
  invited: "Invitation pending",
  suspended: "Paused",
  removed: "Closed",
};

const STATUS_BADGE: Record<MembershipStatus, { kind: StatusKind; label: string }> = {
  pending: { kind: "pending", label: "asked to join" },
  active: { kind: "active", label: "has access" },
  invited: { kind: "pending", label: "invited" },
  suspended: { kind: "suspended", label: "paused" },
  removed: { kind: "closed", label: "closed" },
};

type Action = (prev: ActionResult | undefined, fd: FormData) => Promise<ActionResult>;

/**
 * A destructive or otherwise consequential access change: confirm first, and
 * show whatever the server says back — including the database's refusal to
 * leave a school without a School Admin — right in the dialog.
 */
function ConfirmAction({
  label,
  icon: Icon,
  title,
  description,
  confirmLabel,
  action,
  fields,
  destructive,
  onDone,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  confirmLabel: string;
  action: Action;
  fields: Record<string, string>;
  destructive?: boolean;
  onDone: () => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button variant={destructive ? "destructive" : "outline"} className="w-full justify-start">
            <Icon className="size-4" /> {label}
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <ActionForm
          action={action}
          onSuccess={() => {
            setOpen(false);
            onDone();
          }}
        >
          {Object.entries(fields).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <SubmitButton pendingLabel="Working…" variant={destructive ? "destructive" : undefined}>
              {confirmLabel}
            </SubmitButton>
          </AlertDialogFooter>
        </ActionForm>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function AccessView({
  clubName,
  people,
  currentUserId,
  canSendEmail,
}: {
  clubName: string;
  people: AccessRow[];
  currentUserId: string;
  canSendEmail: boolean;
}) {
  const [filter, setFilter] = React.useState("all");
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  // Read the selection out of the current list rather than holding a copy, so
  // the panel reflects an access change the moment the page revalidates.
  const selected = people.find((p) => p.userId === selectedId) ?? null;

  const counts = {
    pending: people.filter((p) => p.status === "pending").length,
    active: people.filter((p) => p.status === "active").length,
    invited: people.filter((p) => p.status === "invited").length,
    suspended: people.filter((p) => p.status === "suspended").length,
  };

  const rows = people.filter((p) => filter === "all" || p.status === filter);

  const columns: DataTableColumn<AccessRow>[] = [
    {
      key: "person",
      header: "Person",
      render: (p) => (
        <div className="flex items-center gap-2.5">
          <Avatar className="size-7">
            <AvatarFallback className="bg-primary/10 text-[0.65rem] font-medium text-primary">
              {initialsOf(p.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{p.name}</p>
            <p className="text-xs text-muted-foreground">{p.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (p) =>
        p.role === "school_admin" ? (
          <span className="inline-flex items-center gap-1.5 font-medium">
            <ShieldCheck className="size-3.5 text-primary" /> School Admin
          </span>
        ) : (
          "Student"
        ),
    },
    {
      key: "grade",
      header: "Grade",
      render: (p) => (p.grade ? `Grade ${p.grade}` : "—"),
      className: "text-muted-foreground",
    },
    {
      key: "status",
      header: "Access",
      render: (p) => <StatusBadge status={STATUS_BADGE[p.status].kind} label={STATUS_BADGE[p.status].label} />,
    },
    {
      key: "joined",
      header: "Added",
      render: (p) => formatDate(p.joinedAt),
      className: "text-muted-foreground",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={clubName}
        title="Students"
        description="Everyone who can sign in to this school, and what each of them can do. Accept the students asking to join, invite the ones who haven't, and pause or close access here."
        actions={
          <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
            <DialogTrigger render={<Button><Plus className="size-4" /> Invite Student</Button>} />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite a student</DialogTitle>
                <DialogDescription>
                  They&apos;ll get an email inviting them to set a password. Access begins when they
                  accept — not before.
                </DialogDescription>
              </DialogHeader>
              <ActionForm action={inviteStudent} onSuccess={() => setInviteOpen(false)}>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input id="fullName" name="fullName" required placeholder="Their name as it should appear" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">School email</Label>
                  <Input id="email" name="email" type="email" required placeholder="name@student.gmis.sch.id" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade</Label>
                  <Select items={GRADE_ITEMS} name="grade" defaultValue="9">
                    <SelectTrigger id="grade" className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {GRADES.map((g) => (
                        <SelectItem key={g} value={String(g)}>Grade {g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <SubmitButton pendingLabel="Sending…">Send Invitation</SubmitButton>
                </DialogFooter>
              </ActionForm>
            </DialogContent>
          </Dialog>
        }
      />

      {canSendEmail ? null : (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-destructive" />
          <div className="text-sm">
            <p className="font-medium">Invitation emails can&apos;t be sent yet</p>
            <p className="mt-0.5 text-muted-foreground">
              Add <code className="font-mono text-xs">SUPABASE_SERVICE_ROLE_KEY</code> to{" "}
              <code className="font-mono text-xs">.env.local</code> and restart the server. Pausing
              and restoring access work without it.
            </p>
          </div>
        </div>
      )}

      {counts.pending > 0 ? (
        <button
          type="button"
          onClick={() => setFilter("pending")}
          className="flex w-full items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 text-left transition-colors hover:bg-primary/10"
        >
          <UserRoundPlus className="mt-0.5 size-4 shrink-0 text-primary" />
          <div className="text-sm">
            <p className="font-medium">
              {counts.pending === 1
                ? "1 student is asking to join"
                : `${counts.pending} students are asking to join`}
            </p>
            <p className="mt-0.5 text-muted-foreground">
              They can&apos;t sign in until you accept them. Open a name to accept or decline.
            </p>
          </div>
        </button>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Asked to join" value={String(counts.pending)} icon={UserRoundPlus} />
        <StatCard label="Has access" value={String(counts.active)} icon={UserCheck} />
        <StatCard label="Invitation pending" value={String(counts.invited)} icon={MailWarning} />
        <StatCard label="Paused" value={String(counts.suspended)} icon={Lock} />
      </div>

      <DataTable
        data={rows}
        columns={columns}
        rowKey={(p) => p.userId}
        searchPlaceholder="Search by name or email…"
        searchFn={(p, q) => [p.name, p.email].some((f) => f.toLowerCase().includes(q.toLowerCase()))}
        onRowClick={(p) => setSelectedId(p.userId)}
        emptyIcon={Users}
        emptyTitle={filter === "all" ? "Nobody has been invited yet" : "Nobody matches this filter"}
        emptyDescription={
          filter === "all"
            ? "Invite your first student and they'll appear here as soon as the invitation goes out."
            : "Choose a different filter to see the rest of the school."
        }
        toolbar={
          <Select items={FILTER_ITEMS} value={filter} onValueChange={(v) => setFilter(v ?? "all")}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(FILTER_ITEMS).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelectedId(null)}>
        <SheetContent>
          {selected ? (
            <AccessPanel
              person={selected}
              isSelf={selected.userId === currentUserId}
              onDone={() => setSelectedId(null)}
            />
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function AccessPanel({
  person,
  isSelf,
  onDone,
}: {
  person: AccessRow;
  isSelf: boolean;
  onDone: () => void;
}) {
  const badge = STATUS_BADGE[person.status];

  return (
    <>
      <SheetHeader>
        <SheetTitle className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
              {initialsOf(person.name)}
            </AvatarFallback>
          </Avatar>
          {person.name}
        </SheetTitle>
        <SheetDescription>{person.email}</SheetDescription>
      </SheetHeader>

      <div className="space-y-4 px-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Role</span>
          <span className="font-medium">{person.role === "school_admin" ? "School Admin" : "Student"}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Grade</span>
          <span className="font-medium">{person.grade ? `Grade ${person.grade}` : "—"}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Access</span>
          <StatusBadge status={badge.kind} label={badge.label} />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Added</span>
          <span className="font-medium">{formatDate(person.joinedAt)}</span>
        </div>
        {person.status === "invited" && person.expiresAt ? (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Invitation expires</span>
            <span className="font-medium">{formatDate(person.expiresAt)}</span>
          </div>
        ) : null}
      </div>

      <div className="mt-6 space-y-2 border-t border-border px-4 pt-6">
        {isSelf ? (
          <p className="text-sm text-muted-foreground">
            This is you. Another School Admin can change your access — you can&apos;t change your own.
          </p>
        ) : (
          <AccessControls person={person} onDone={onDone} />
        )}
      </div>
    </>
  );
}

function AccessControls({ person, onDone }: { person: AccessRow; onDone: () => void }) {
  const { userId, name, status, role } = person;

  if (status === "pending") {
    return (
      <>
        <p className="pb-2 text-sm text-muted-foreground">
          {name} asked to join the club and is waiting on you. Nothing is open to them until you
          accept.
        </p>
        <ConfirmAction
          label="Accept into the club"
          icon={UserCheck}
          title={`Accept ${name} into the club?`}
          description="They'll be able to sign in straight away, as a Student."
          confirmLabel="Accept"
          action={decideJoinRequest}
          fields={{ userId, decision: "accept" }}
          onDone={onDone}
        />
        <ConfirmAction
          label="Decline the request"
          icon={Trash2}
          title={`Decline ${name}'s request?`}
          description="They won't be able to sign in. They stay on the list as closed, so you'll know they were turned down — you can restore them later if it was a mistake."
          confirmLabel="Decline"
          action={decideJoinRequest}
          fields={{ userId, decision: "decline" }}
          destructive
          onDone={onDone}
        />
      </>
    );
  }

  if (status === "invited") {
    return (
      <>
        <p className="pb-2 text-sm text-muted-foreground">
          {name} hasn&apos;t accepted the invitation yet, so they can&apos;t sign in.
        </p>
        <ConfirmAction
          label="Resend invitation"
          icon={Send}
          title={`Resend the invitation to ${name}?`}
          description="A fresh email goes out and the previous link stops working."
          confirmLabel="Resend"
          action={resendInvitation}
          fields={{ userId }}
          onDone={onDone}
        />
        <ConfirmAction
          label="Withdraw invitation"
          icon={Trash2}
          title={`Withdraw ${name}'s invitation?`}
          description="The link in their inbox stops working and they come off the list. You can invite them again later."
          confirmLabel="Withdraw"
          action={revokeInvitation}
          fields={{ userId }}
          destructive
          onDone={onDone}
        />
      </>
    );
  }

  if (status === "suspended" || status === "removed") {
    return (
      <>
        <p className="pb-2 text-sm text-muted-foreground">
          {status === "suspended"
            ? `${name} can't sign in while their access is paused. Their projects and work are untouched.`
            : `${name}'s access is closed. Their past work stays on the school's record.`}
        </p>
        <ConfirmAction
          label="Restore access"
          icon={RotateCcw}
          title={`Restore access for ${name}?`}
          description="They'll be able to sign in again straight away, as a Student."
          confirmLabel="Restore"
          action={setMemberStatus}
          fields={{ userId, status: "active" }}
          onDone={onDone}
        />
      </>
    );
  }

  return (
    <>
      {role === "school_admin" ? (
        <ConfirmAction
          label="Withdraw School Admin"
          icon={Users}
          title={`Make ${name} a Student?`}
          description="They keep their access but lose the ability to manage the club."
          confirmLabel="Make Student"
          action={setMemberRole}
          fields={{ userId, role: "student" }}
          onDone={onDone}
        />
      ) : (
        <ConfirmAction
          label="Make School Admin"
          icon={ShieldCheck}
          title={`Give ${name} School Admin access?`}
          description="They'll be able to manage students, projects, and everything else in this school — including your access."
          confirmLabel="Make School Admin"
          action={setMemberRole}
          fields={{ userId, role: "school_admin" }}
          onDone={onDone}
        />
      )}
      <ConfirmAction
        label="Pause access"
        icon={Lock}
        title={`Pause ${name}'s access?`}
        description="They'll be signed out on their next click and won't be able to get back in. Nothing they've made is deleted, and you can restore them at any time."
        confirmLabel="Pause access"
        action={setMemberStatus}
        fields={{ userId, status: "suspended" }}
        onDone={onDone}
      />
      <ConfirmAction
        label="Close access"
        icon={Trash2}
        title={`Close ${name}'s access?`}
        description="They come off the active roster and can't sign in. Their projects, tasks, and achievements stay on the school's record."
        confirmLabel="Close access"
        action={setMemberStatus}
        fields={{ userId, status: "removed" }}
        destructive
        onDone={onDone}
      />
    </>
  );
}
