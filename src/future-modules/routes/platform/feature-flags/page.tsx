"use client";

import * as React from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { mockFeatureFlags, type FeatureFlag } from "@/lib/mock-data";

export default function PlatformFeatureFlagsPage() {
  const [flags, setFlags] = React.useState<FeatureFlag[]>(mockFeatureFlags);

  function toggle(id: string) {
    setFlags((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        const next = { ...f, enabled: !f.enabled };
        toast.success(`${next.name} ${next.enabled ? "enabled" : "disabled"}`);
        return next;
      })
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Platform" title="Feature flags" description="Roll features out safely before a full launch." />

      <div className="divide-y divide-border rounded-xl border border-border bg-card">
        {flags.map((flag) => (
          <div key={flag.id} className="flex items-center justify-between gap-6 p-5">
            <div>
              <Label htmlFor={flag.id} className="font-display text-sm font-semibold">
                {flag.name}
              </Label>
              <p className="mt-1 text-sm text-muted-foreground">{flag.description}</p>
              <span className="mt-2 inline-block font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                Scope: {flag.scope}
              </span>
            </div>
            <Switch id={flag.id} checked={flag.enabled} onCheckedChange={() => toggle(flag.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}
