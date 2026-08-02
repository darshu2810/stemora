"use client";

import { ScrollText } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { mockPlatformAuditLog, type PlatformAuditEntry } from "@/lib/mock-data";

export default function PlatformAuditLogPage() {
  const columns: DataTableColumn<PlatformAuditEntry>[] = [
    { key: "action", header: "Action", render: (e) => <span className="font-mono text-xs">{e.action}</span> },
    { key: "actor", header: "Actor", render: (e) => e.actor },
    { key: "target", header: "Target", render: (e) => e.target },
    { key: "time", header: "Time", render: (e) => e.time, className: "text-muted-foreground" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Platform" title="Audit log" description="Every sensitive action taken across the platform." />

      <DataTable
        data={mockPlatformAuditLog}
        columns={columns}
        rowKey={(e) => e.id}
        searchPlaceholder="Search audit log…"
        searchFn={(e, q) =>
          [e.actor, e.action, e.target].some((f) => f.toLowerCase().includes(q.toLowerCase()))
        }
        emptyIcon={ScrollText}
        emptyTitle="No matching audit events"
        emptyDescription="Try a different search term."
      />
    </div>
  );
}
