"use client";

import * as React from "react";
import { Check, X, MapPin, Mail, Globe } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { ActionForm, SubmitButton, ActionButton } from "@/components/shared/action-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { approveApplication, rejectApplication } from "@/lib/db/actions";
import type { SchoolApplication } from "@/lib/supabase/types";

function ApplicationCard({
  application,
  actionable,
}: {
  application: SchoolApplication;
  actionable: boolean;
}) {
  const [rejectOpen, setRejectOpen] = React.useState(false);
  const location = [application.city, application.country].filter(Boolean).join(", ");

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display font-semibold">{application.school_name}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{application.club_name}</p>
        </div>
        <StatusBadge
          status={
            application.status === "pending"
              ? "pending"
              : application.status === "approved"
                ? "active"
                : "closed"
          }
          label={application.status}
        />
      </div>

      <dl className="mt-4 grid gap-x-6 gap-y-2 text-xs text-muted-foreground sm:grid-cols-2">
        <div className="flex items-center gap-1.5">
          <dt className="sr-only">Applicant</dt>
          <dd className="font-medium text-foreground">{application.applicant_name}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <dt className="sr-only">Email</dt>
          <Mail className="size-3 shrink-0" />
          <dd className="truncate">{application.applicant_email}</dd>
        </div>
        {location ? (
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Location</dt>
            <MapPin className="size-3 shrink-0" />
            <dd>{location}</dd>
          </div>
        ) : null}
        {application.school_email_domain ? (
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">School domain</dt>
            <Globe className="size-3 shrink-0" />
            <dd>{application.school_email_domain}</dd>
          </div>
        ) : null}
        <div>
          <dt className="sr-only">Submitted</dt>
          <dd>Submitted {formatDate(application.created_at)}</dd>
        </div>
        {application.reviewed_at ? (
          <div>
            <dt className="sr-only">Reviewed</dt>
            <dd>Reviewed {formatDate(application.reviewed_at)}</dd>
          </div>
        ) : null}
      </dl>

      {application.rejection_reason ? (
        <p className="mt-3 rounded-lg border border-border bg-secondary/40 p-3 text-xs text-muted-foreground">
          {application.rejection_reason}
        </p>
      ) : null}

      {actionable ? (
        <div className="mt-4 flex items-center gap-2">
          <ActionButton
            action={approveApplication}
            fields={{ applicationId: application.id }}
            variant="default"
            size="sm"
          >
            <Check className="size-4" /> Approve
          </ActionButton>

          <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
            <DialogTrigger
              render={
                <Button variant="outline" size="sm">
                  <X className="size-4" /> Reject
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reject this application</DialogTitle>
                <DialogDescription>
                  {application.school_name} will be told their application wasn&apos;t approved.
                </DialogDescription>
              </DialogHeader>
              <ActionForm action={rejectApplication} onSuccess={() => setRejectOpen(false)}>
                <input type="hidden" name="applicationId" value={application.id} />
                <div className="space-y-2">
                  <Label htmlFor={`reason-${application.id}`}>Reason (optional)</Label>
                  <Textarea
                    id={`reason-${application.id}`}
                    name="reason"
                    rows={3}
                    placeholder="Shown to the applicant."
                  />
                </div>
                <DialogFooter>
                  <SubmitButton variant="destructive" pendingLabel="Rejecting…">
                    Reject application
                  </SubmitButton>
                </DialogFooter>
              </ActionForm>
            </DialogContent>
          </Dialog>
        </div>
      ) : null}
    </div>
  );
}

export function RequestsView({
  pending,
  reviewed,
}: {
  pending: SchoolApplication[];
  reviewed: SchoolApplication[];
}) {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-display text-lg font-semibold">
          Pending {pending.length > 0 ? `· ${pending.length}` : ""}
        </h2>
        {pending.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">Nothing waiting on you.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {pending.map((a) => (
              <ApplicationCard key={a.id} application={a} actionable />
            ))}
          </div>
        )}
      </section>

      {reviewed.length > 0 ? (
        <section>
          <h2 className="font-display text-lg font-semibold">Reviewed</h2>
          <div className="mt-4 space-y-3">
            {reviewed.map((a) => (
              <ApplicationCard key={a.id} application={a} actionable={false} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
