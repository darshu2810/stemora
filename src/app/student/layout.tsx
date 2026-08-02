import { DashboardShell } from "@/components/dashboard/shell";
import { mockSchool } from "@/lib/mock-data";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell variant="student" contextLabel={mockSchool.name.toUpperCase()}>
      {children}
    </DashboardShell>
  );
}
