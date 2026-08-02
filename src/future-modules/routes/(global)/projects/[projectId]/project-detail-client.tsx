"use client";

import Link from "next/link";
import { toast } from "sonner";
import { MapPin, Download, Users2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/shared/status-badge";
import { EngagementBar } from "@/components/community/engagement-bar";
import { CommentSection } from "@/components/community/comment-section";
import { mockGlobalSchools, type ShowcaseProject } from "@/lib/mock-global";

export function ProjectDetailClient({ project }: { project: ShowcaseProject }) {
  const school = mockGlobalSchools.find((s) => s.name === project.school);

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className={`h-40 bg-gradient-to-br ${project.cover}`} />
        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">{project.category}</p>
              <h1 className="mt-1 font-display text-xl font-semibold">{project.title}</h1>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-3.5" />
                {school ? (
                  <Link href={`/schools/${school.slug}`} className="hover:text-foreground hover:underline">{project.school}</Link>
                ) : (
                  project.school
                )}
                {" · "}{project.country}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={project.status === "active" ? "active" : "graded"} label={project.status} />
              <Button variant="outline" size="sm" onClick={() => toast.info("Downloads aren't available in preview mode yet.")}>
                <Download className="size-3.5" /> Download files
              </Button>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">{project.longDescription}</p>
          <EngagementBar
            className="mt-4 -ml-2"
            initialLikes={project.likes}
            initialBookmarks={project.bookmarks}
            commentCount={project.comments.length}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          <section className="space-y-3">
            <h2 className="font-display font-semibold">Gallery</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {Array.from({ length: project.galleryCount }, (_, i) => (
                <div
                  key={i}
                  className={`aspect-video rounded-lg bg-gradient-to-br ${project.cover} ${i % 2 === 0 ? "opacity-100" : "opacity-70"}`}
                />
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <CommentSection initialComments={project.comments} />
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-display font-semibold">Progress</h2>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{project.progress}% complete</span>
                <span className="capitalize">{project.status}</span>
              </div>
              <Progress value={project.progress} className="mt-1.5 h-1.5" />
            </div>
            <p className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Download className="size-4" /> {project.downloads} downloads
            </p>
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-display font-semibold">Technologies</h2>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.technologies.map((t) => (
                <span key={t} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">{t}</span>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="flex items-center gap-1.5 font-display font-semibold">
              <Users2 className="size-4" /> Contributors
            </h2>
            <div className="mt-3 space-y-3">
              {project.contributors.map((c) => (
                <div key={c} className="flex items-center gap-2.5">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                      {c.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{c}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
