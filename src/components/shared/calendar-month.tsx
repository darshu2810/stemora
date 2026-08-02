"use client";

import { cn } from "@/lib/utils";
import type { SchoolEvent } from "@/lib/mock-data";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toISODate(year: number, month: number, day: number) {
  const d = new Date(year, month, day);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function CalendarMonth({
  year,
  month,
  events,
  selectedDate,
  onSelectDate,
}: {
  year: number;
  month: number;
  events: SchoolEvent[];
  selectedDate?: string;
  onSelectDate?: (date: string) => void;
}) {
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  const eventsByDate = events.reduce<Record<string, SchoolEvent[]>>((acc, e) => {
    (acc[e.date] ??= []).push(e);
    return acc;
  }, {});

  const todayISO = toISODate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="grid grid-cols-7 gap-1 text-center font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-1.5">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: totalCells }, (_, i) => {
          const dayNum = i - startOffset + 1;
          const inMonth = dayNum >= 1 && dayNum <= daysInMonth;
          const iso = inMonth ? toISODate(year, month, dayNum) : null;
          const dayEvents = iso ? eventsByDate[iso] ?? [] : [];
          const isSelected = iso === selectedDate;
          const isToday = iso === todayISO;

          return (
            <button
              key={i}
              type="button"
              disabled={!inMonth}
              onClick={() => iso && onSelectDate?.(iso)}
              className={cn(
                "flex min-h-16 flex-col items-start gap-1 rounded-lg p-1.5 text-left text-xs transition-colors disabled:cursor-default",
                inMonth ? "hover:bg-secondary" : "opacity-0",
                isSelected && "bg-primary/10 ring-1 ring-primary/40",
                isToday && !isSelected && "ring-1 ring-border"
              )}
            >
              <span className={cn("font-mono", isToday && "font-semibold text-primary")}>{inMonth ? dayNum : ""}</span>
              <div className="flex flex-wrap gap-0.5">
                {dayEvents.slice(0, 3).map((e) => (
                  <span key={e.id} className={cn("size-1.5 rounded-full", e.club ? "bg-primary" : "bg-brand-spark")} />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
