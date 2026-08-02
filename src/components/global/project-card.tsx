import Link from "next/link";
import { Heart, MapPin } from "lucide-react";
import type { ShowcaseProject } from "@/lib/mock-global";

export function ProjectCard({ project }: { project: ShowcaseProject }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/40"
    >
      <div className={`h-24 bg-gradient-to-br ${project.cover}`} />
      <div className="p-4">
        <p className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">{project.category}</p>
        <h3 className="mt-1 font-display text-sm font-semibold">{project.title}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{project.description}</p>
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="size-3" /> {project.school}</span>
          <span className="flex items-center gap-1"><Heart className="size-3" /> {project.likes}</span>
        </div>
      </div>
    </Link>
  );
}
