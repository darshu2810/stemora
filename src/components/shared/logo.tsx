import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 font-display text-[1.05rem] font-semibold tracking-tight text-foreground",
        className
      )}
    >
      <span className="relative flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <svg viewBox="0 0 24 24" className="size-4" fill="none">
          <circle cx="12" cy="12" r="2.4" fill="currentColor" />
          <circle cx="4" cy="6" r="1.6" fill="currentColor" opacity="0.9" />
          <circle cx="20" cy="6" r="1.6" fill="currentColor" opacity="0.9" />
          <circle cx="4" cy="18" r="1.6" fill="currentColor" opacity="0.9" />
          <circle cx="20" cy="18" r="1.6" fill="currentColor" opacity="0.9" />
          <path
            d="M12 12 4 6M12 12l8-6M12 12l-8 6M12 12l8 6"
            stroke="currentColor"
            strokeWidth="1.2"
            opacity="0.9"
          />
        </svg>
      </span>
      STEMORA
    </Link>
  );
}
