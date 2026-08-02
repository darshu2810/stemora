import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  draft: "bg-muted text-muted-foreground",
  published: "bg-primary/10 text-primary dark:bg-primary/20",
  closed: "bg-secondary text-secondary-foreground",
  active: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  suspended: "bg-destructive/10 text-destructive",
  overdue: "bg-destructive/10 text-destructive",
  graded: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  pending: "bg-brand-spark/15 text-accent-foreground",
} as const;

export type StatusKind = keyof typeof STATUS_STYLES;

export function StatusBadge({ status, label }: { status: StatusKind; label?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[0.68rem] font-medium uppercase tracking-wide",
        STATUS_STYLES[status]
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {label ?? status}
    </span>
  );
}
