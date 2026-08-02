"use client";

import * as React from "react";
import { toast } from "sonner";
import { Users2, LayoutGrid, ShieldCheck, Wallet, ScrollText } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import type { MockSchoolRecord, PlatformAuditEntry, SchoolStatus } from "@/lib/mock-data";

export function SchoolDetailClient({
  school,
  auditEntries,
}: {
  school: MockSchoolRecord;
  auditEntries: PlatformAuditEntry[];
}) {
  const [status, setStatus] = React.useState<SchoolStatus>(school.status);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const roleSplit = {
    admins: Math.max(1, Math.round(school.clubs * 0.2)),
    clubLeaders: Math.max(1, school.clubs),
    students: school.members - Math.max(1, Math.round(school.clubs * 1.2)),
  };

  function toggleStatus() {
    const next = status === "suspended" ? "active" : "suspended";
    setStatus(next);
    setConfirmOpen(false);
    toast.success(next === "suspended" ? `${school.name} suspended` : `${school.name} reactivated`);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={school.district}
        title={school.name}
        description={`On the ${school.plan} plan · Joined ${school.joinedAt}`}
        actions={<StatusBadge status={status} />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Members" value={school.members.toLocaleString()} icon={Users2} />
        <StatCard label="Clubs" value={String(school.clubs)} icon={LayoutGrid} />
        <StatCard label="Plan" value={school.plan} icon={Wallet} />
        <StatCard label="Status" value={status[0].toUpperCase() + status.slice(1)} icon={ShieldCheck} />
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="audit">Audit log</TabsTrigger>
          <TabsTrigger value="danger">Danger zone</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-display font-semibold">School profile</h3>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">District</dt>
                <dd className="text-sm font-medium">{school.district}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Plan</dt>
                <dd className="text-sm font-medium">{school.plan}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Joined</dt>
                <dd className="text-sm font-medium">{school.joinedAt}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Status</dt>
                <dd className="text-sm font-medium capitalize">{status}</dd>
              </div>
            </dl>
          </div>
        </TabsContent>

        <TabsContent value="members" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="School admins" value={String(roleSplit.admins)} icon={ShieldCheck} />
            <StatCard label="Club leaders" value={String(roleSplit.clubLeaders)} icon={Users2} />
            <StatCard label="Students" value={roleSplit.students.toLocaleString()} icon={Users2} />
          </div>
        </TabsContent>

        <TabsContent value="audit" className="mt-6">
          {auditEntries.length === 0 ? (
            <EmptyState icon={ScrollText} title="No audit events yet" description="Actions taken on this school will show up here." />
          ) : (
            <div className="divide-y divide-border rounded-xl border border-border bg-card">
              {auditEntries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <p className="text-sm font-medium">{entry.action}</p>
                    <p className="text-xs text-muted-foreground">{entry.actor} · {entry.target}</p>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">{entry.time}</span>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="danger" className="mt-6">
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
            <h3 className="font-display font-semibold text-destructive">Danger zone</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {status === "suspended"
                ? "This school is suspended — members can't sign in until it's reactivated."
                : "Suspending a school immediately blocks sign-in for every member."}
            </p>
            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <AlertDialogTrigger
                render={
                  <Button variant="destructive" className="mt-4">
                    {status === "suspended" ? "Reactivate school" : "Suspend school"}
                  </Button>
                }
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {status === "suspended" ? "Reactivate this school?" : "Suspend this school?"}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {status === "suspended"
                      ? `${school.name} will regain access immediately.`
                      : `${school.name}'s ${school.members.toLocaleString()} members will lose access immediately. This is logged to the audit trail.`}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={toggleStatus}>
                    {status === "suspended" ? "Reactivate" : "Suspend"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
