import Link from "next/link";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ResearchItem } from "@/lib/mock-global";

export function ResearchCard({ item }: { item: ResearchItem }) {
  return (
    <Link
      href={`/research/${item.id}`}
      className="block rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
    >
      <div className="flex items-center justify-between gap-2">
        <Badge variant="secondary">{item.type}</Badge>
        <span className="font-mono text-[0.65rem] text-muted-foreground">{item.date}</span>
      </div>
      <h3 className="mt-2 font-display text-sm font-semibold">{item.title}</h3>
      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.abstract}</p>
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>{item.authors.join(", ")} · {item.school}</span>
        <span className="flex shrink-0 items-center gap-1"><Heart className="size-3" /> {item.likes}</span>
      </div>
    </Link>
  );
}
