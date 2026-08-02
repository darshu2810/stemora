import { CreditCard, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { mockSchools, type SchoolPlan } from "@/lib/mock-data";

const PLAN_PRICE: Record<SchoolPlan, number> = { Free: 0, Standard: 49, Premium: 99 };

export default function PlatformBillingPage() {
  const billable = mockSchools.filter((s) => s.status !== "suspended");
  const mrr = billable.reduce((sum, s) => sum + PLAN_PRICE[s.plan], 0);
  const paying = billable.filter((s) => s.plan !== "Free");
  const arpu = paying.length ? mrr / paying.length : 0;
  const pastDue = mockSchools.filter((s) => s.status === "suspended");

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Platform" title="Billing" description="Subscription revenue across every school." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="MRR" value={`$${mrr.toLocaleString()}`} icon={DollarSign} delta={{ value: "+11.3%", direction: "up" }} />
        <StatCard label="Paying schools" value={String(paying.length)} icon={CreditCard} />
        <StatCard label="ARPU" value={`$${arpu.toFixed(0)}`} icon={TrendingUp} />
        <StatCard label="Past due" value={String(pastDue.length)} icon={AlertTriangle} />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>School</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Next renewal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockSchools.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell>{s.plan}</TableCell>
                <TableCell className="tabular-nums">${PLAN_PRICE[s.plan]}/mo</TableCell>
                <TableCell>
                  <StatusBadge status={s.status === "suspended" ? "suspended" : "active"} label={s.status === "suspended" ? "Past due" : "Paid"} />
                </TableCell>
                <TableCell className="text-muted-foreground">Sep 1, 2026</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
