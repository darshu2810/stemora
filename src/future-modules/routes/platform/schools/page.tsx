"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockSchools, type MockSchoolRecord, type SchoolPlan, type SchoolStatus } from "@/lib/mock-data";

export default function PlatformSchoolsPage() {
  const router = useRouter();
  const [plan, setPlan] = React.useState<SchoolPlan | "all">("all");
  const [status, setStatus] = React.useState<SchoolStatus | "all">("all");

  const filtered = React.useMemo(() => {
    return mockSchools.filter((s) => (plan === "all" || s.plan === plan) && (status === "all" || s.status === status));
  }, [plan, status]);

  const columns: DataTableColumn<MockSchoolRecord>[] = [
    {
      key: "name",
      header: "School",
      render: (s) => (
        <div>
          <p className="font-medium">{s.name}</p>
          <p className="text-xs text-muted-foreground">{s.district}</p>
        </div>
      ),
    },
    { key: "plan", header: "Plan", render: (s) => s.plan },
    { key: "members", header: "Members", render: (s) => s.members.toLocaleString() },
    { key: "clubs", header: "Clubs", render: (s) => s.clubs },
    { key: "status", header: "Status", render: (s) => <StatusBadge status={s.status} /> },
    { key: "joinedAt", header: "Joined", render: (s) => s.joinedAt, className: "text-muted-foreground" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Platform"
        title="Schools"
        description={`${mockSchools.length} schools on STEMORA.`}
      />

      <DataTable
        data={filtered}
        columns={columns}
        rowKey={(s) => s.id}
        searchPlaceholder="Search schools…"
        searchFn={(s, q) => s.name.toLowerCase().includes(q.toLowerCase()) || s.district.toLowerCase().includes(q.toLowerCase())}
        onRowClick={(s) => router.push(`/platform/schools/${s.id}`)}
        emptyIcon={Building2}
        emptyTitle="No schools match your filters"
        emptyDescription="Try a different plan, status, or search term."
        toolbar={
          <div className="flex gap-2">
            <Select value={plan} onValueChange={(v) => setPlan(v as SchoolPlan | "all")}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All plans</SelectItem>
                <SelectItem value="Free">Free</SelectItem>
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={(v) => setStatus(v as SchoolStatus | "all")}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />
    </div>
  );
}
