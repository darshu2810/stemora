import { PageHeader } from "@/components/shared/page-header";
import { TrendChart } from "@/components/shared/charts/trend-chart";
import { DonutChart } from "@/components/shared/charts/donut-chart";
import { Progress } from "@/components/ui/progress";
import { mockGrowthSeries, mockPlanDistribution, mockSchools } from "@/lib/mock-data";

export default function PlatformAnalyticsPage() {
  const districtCounts = Object.entries(
    mockSchools.reduce<Record<string, number>>((acc, s) => {
      acc[s.district] = (acc[s.district] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);
  const maxDistrict = Math.max(...districtCounts.map(([, n]) => n));

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Platform" title="Analytics" description="How the Jakarta rollout is trending." />

      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-display font-semibold">Student growth</h2>
        <p className="text-sm text-muted-foreground">Cumulative students across all schools.</p>
        <div className="mt-2">
          <TrendChart
            data={mockGrowthSeries}
            xKey="month"
            series={[{ key: "students", color: "var(--color-chart-1)", label: "Students" }]}
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-display font-semibold">Schools by plan</h2>
          <p className="text-sm text-muted-foreground">Distribution across pricing tiers.</p>
          <DonutChart
            data={mockPlanDistribution}
            dataKey="count"
            nameKey="plan"
            colors={["var(--color-chart-5)", "var(--color-chart-1)", "var(--color-chart-2)"]}
          />
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-display font-semibold">Schools by district</h2>
          <p className="text-sm text-muted-foreground">Where Jakarta schools are concentrated.</p>
          <div className="mt-5 space-y-4">
            {districtCounts.map(([district, count]) => (
              <div key={district}>
                <div className="flex items-center justify-between text-sm">
                  <span>{district}</span>
                  <span className="font-mono text-xs text-muted-foreground">{count}</span>
                </div>
                <Progress value={(count / maxDistrict) * 100} className="mt-1.5 h-1.5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
