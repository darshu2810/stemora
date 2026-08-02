import Link from "next/link";
import { notFound } from "next/navigation";
import { Users2, FolderKanban, Megaphone } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockClubs, mockMembers, mockProjects, mockAnnouncements } from "@/lib/mock-data";

export default async function ClubDetailPage({ params }: { params: Promise<{ clubId: string }> }) {
  const { clubId } = await params;
  const club = mockClubs.find((c) => c.id === clubId);
  if (!club) notFound();

  const members = mockMembers.filter((m) => m.clubId === clubId);
  const projects = mockProjects.filter((p) => p.clubId === clubId);
  const announcements = mockAnnouncements.filter((a) => a.club === club.name);

  return (
    <div className="space-y-8">
      <PageHeader eyebrow={club.category} title={club.name} description={`${club.members} members in this club.`} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Members" value={String(club.members)} icon={Users2} />
        <StatCard label="Active projects" value={String(projects.filter((p) => p.status === "active").length)} icon={FolderKanban} />
        <StatCard label="Announcements" value={String(announcements.length)} icon={Megaphone} />
      </div>

      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-6">
          {members.length === 0 ? (
            <EmptyState icon={Users2} title="No members yet" description="Invite members from the People page." />
          ) : (
            <div className="divide-y divide-border rounded-xl border border-border bg-card">
              {members.map((m) => (
                <div key={m.id} className="flex items-center justify-between gap-4 p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">{m.avatarInitials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{m.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{m.clubRole}</p>
                    </div>
                  </div>
                  <StatusBadge status={m.status === "active" ? "active" : m.status === "invited" ? "pending" : "suspended"} label={m.status} />
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          {projects.length === 0 ? (
            <EmptyState icon={FolderKanban} title="No projects yet" description="Start one from the Projects page." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {projects.map((p) => (
                <Link
                  key={p.id}
                  href={`/school/projects/${p.id}`}
                  className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-sm font-semibold">{p.name}</h3>
                    <StatusBadge status={p.status === "active" ? "active" : p.status === "completed" ? "graded" : "closed"} label={p.status} />
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">{p.description}</p>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="announcements" className="mt-6">
          {announcements.length === 0 ? (
            <EmptyState icon={Megaphone} title="No announcements yet" description="Post one from the Announcements page." />
          ) : (
            <div className="divide-y divide-border rounded-xl border border-border bg-card">
              {announcements.map((a) => (
                <div key={a.id} className="p-4">
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{a.body}</p>
                  <p className="mt-1.5 font-mono text-xs text-muted-foreground">{a.author} · {a.date}</p>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
