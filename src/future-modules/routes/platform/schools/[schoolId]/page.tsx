import { notFound } from "next/navigation";
import { mockSchools, mockPlatformAuditLog } from "@/lib/mock-data";
import { SchoolDetailClient } from "./school-detail-client";

export default async function PlatformSchoolDetailPage({
  params,
}: {
  params: Promise<{ schoolId: string }>;
}) {
  const { schoolId } = await params;
  const school = mockSchools.find((s) => s.id === schoolId);

  if (!school) {
    notFound();
  }

  const auditEntries = mockPlatformAuditLog.filter((entry) => entry.target.includes(school.name));

  return <SchoolDetailClient school={school} auditEntries={auditEntries} />;
}
