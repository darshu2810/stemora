import Link from "next/link";
import { Building2, Users2, LayoutGrid, DollarSign, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { TrendChart } from "@/components/shared/charts/trend-chart";
import { mockPlatformStats, mockGrowthSeries, mockSchools } from "@/lib/mock-data";

export default function PlatformDashboardPage() {
  const stats = mockPlatformStats;
  const recentSchools = [...mockSchools]
    .sort((a, b) => (a.joinedAt < b.joinedAt ? 1 : -1))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Platform · Jakarta"
        title="Network overview"
        description="Every school on STEMORA, at a glance."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Schools" value={stats.totalSchools.toLocaleString()} icon={Building2} delta={{ value: "+5 this month", direction: "up" }} />
        <StatCard label="Students" value={stats.totalStudents.toLocaleString()} icon={Users2} delta={{ value: "+14.2%", direction: "up" }} />
        <StatCard label="Clubs" value={stats.totalClubs.toLocaleString()} icon={LayoutGrid} delta={{ value: "+9.6%", direction: "up" }} />
        <StatCard label="MRR" value={`$${(stats.mrr / 1000).toFixed(1)}k`} icon={DollarSign} delta={{ value: "+11.3%", direction: "up" }} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-display font-semibold">Students onboarded</h2>
          <p className="text-sm text-muted-foreground">Cumulative, since launch.</p>
          <div className="mt-2">
            <TrendChart
              data={mockGrowthSeries}
              xKey="month"
              series={[{ key: "students", color: "var(--color-chart-1)", label: "Students" }]}
              height={220}
            />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-display font-semibold">Schools onboarded</h2>
          <p className="text-sm text-muted-foreground">Cumulative, since launch.</p>
          <div className="mt-2">
            <TrendChart
              data={mockGrowthSeries}
              xKey="month"
              series={[{ key: "schools", color: "var(--color-chart-2)", label: "Schools" }]}
              height={220}
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between p-5 pb-0">
          <div>
            <h2 className="font-display font-semibold">Recently joined</h2>
            <p className="text-sm text-muted-foreground">The newest schools on the platform.</p>
          </div>
          <Button variant="outline" size="sm" render={<Link href="/platform/schools">View all <ArrowRight className="size-3.5" /></Link>} />
        </div>
        <div className="mt-4 divide-y divide-border">
          {recentSchools.map((school) => (
            <Link
              key={school.id}
              href={`/platform/schools/${school.id}`}
              className="flex items-center justify-between gap-4 px-5 py-3 transition-colors hover:bg-secondary/50"
            >
              <div>
                <p className="text-sm font-medium">{school.name}</p>
                <p className="text-xs text-muted-foreground">
                  {school.district} · {school.members} members · Joined {school.joinedAt}
                </p>
              </div>
              <StatusBadge status={school.status} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
