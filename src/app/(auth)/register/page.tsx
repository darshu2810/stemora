import { listJoinableSchools } from "@/lib/db/queries";
import { RegisterView, type RegisterSection } from "@/components/auth/register-view";

export const metadata = { title: "Join STEMORA" };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ as?: string }>;
}) {
  // The school list is public — it has to be, since whoever needs it has no
  // account yet — and comes from a SECURITY DEFINER function, not the table.
  const [params, schools] = await Promise.all([searchParams, listJoinableSchools()]);
  const defaultSection: RegisterSection = params.as === "school" ? "school" : "student";

  return <RegisterView schools={schools} defaultSection={defaultSection} />;
}
