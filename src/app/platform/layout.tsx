import { DashboardShell } from "@/components/dashboard/shell";

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell variant="platform" contextLabel="STEMORA PLATFORM">
      {children}
    </DashboardShell>
  );
}
