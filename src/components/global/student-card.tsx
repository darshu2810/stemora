import Link from "next/link";
import { Users2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { GlobalStudent } from "@/lib/mock-global";

export function StudentCard({ student }: { student: GlobalStudent }) {
  return (
    <Link
      href={`/portfolio/${student.handle}`}
      className="flex flex-col items-center rounded-xl border border-border bg-card p-5 text-center transition-colors hover:border-primary/40"
    >
      <Avatar className="size-14">
        <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">{student.avatarInitials}</AvatarFallback>
      </Avatar>
      <h3 className="mt-3 font-display text-sm font-semibold">{student.name}</h3>
      <p className="mt-0.5 text-xs text-muted-foreground">{student.school}</p>
      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{student.headline}</p>
      <div className="mt-3 flex flex-wrap justify-center gap-1">
        {student.skills.slice(0, 2).map((s) => (
          <span key={s} className="rounded-full bg-secondary px-2 py-0.5 text-[0.65rem] font-medium">{s}</span>
        ))}
      </div>
      <p className="mt-3 flex items-center gap-1 font-mono text-[0.65rem] text-muted-foreground">
        <Users2 className="size-3" /> {student.followers} followers
      </p>
    </Link>
  );
}
