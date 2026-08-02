import { DashboardShell } from "@/components/dashboard/shell";
import { mockSchool } from "@/lib/mock-data";

export default function SchoolLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell variant="school" contextLabel={mockSchool.name.toUpperCase()}>
      {children}
    </DashboardShell>
  );
}
