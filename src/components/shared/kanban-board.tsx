"use client";

import * as React from "react";
import { MoreHorizontal, CalendarDays } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { BoardCard, BoardColumnId } from "@/lib/mock-data";

const PRIORITY_STYLES: Record<BoardCard["priority"], string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-brand-spark/15 text-accent-foreground",
  high: "bg-destructive/10 text-destructive",
};

// Reusable across every project's board: drag-and-drop for mouse users, plus
// a "Move to…" menu on each card so moving a card never requires a mouse.
export function KanbanBoard({
  columns,
  cardsByColumn,
  onMove,
  onCardClick,
}: {
  columns: { id: BoardColumnId; name: string }[];
  cardsByColumn: Record<BoardColumnId, BoardCard[]>;
  onMove: (cardId: string, toColumn: BoardColumnId) => void;
  onCardClick?: (card: BoardCard) => void;
}) {
  const [dragOverColumn, setDragOverColumn] = React.useState<BoardColumnId | null>(null);

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {columns.map((column) => {
        const cards = cardsByColumn[column.id] ?? [];
        return (
          <div
            key={column.id}
            className={cn(
              "flex w-72 shrink-0 flex-col rounded-xl border border-border bg-secondary/40 p-3 transition-colors",
              dragOverColumn === column.id && "border-primary/50 bg-primary/5"
            )}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverColumn(column.id);
            }}
            onDragLeave={() => setDragOverColumn((c) => (c === column.id ? null : c))}
            onDrop={(e) => {
              e.preventDefault();
              const cardId = e.dataTransfer.getData("text/card-id");
              if (cardId) onMove(cardId, column.id);
              setDragOverColumn(null);
            }}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <h3 className="font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {column.name}
              </h3>
              <span className="font-mono text-xs text-muted-foreground">{cards.length}</span>
            </div>

            <div className="flex flex-1 flex-col gap-2">
              {cards.map((card) => (
                <div
                  key={card.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("text/card-id", card.id)}
                  onClick={() => onCardClick?.(card)}
                  className="cursor-grab space-y-2 rounded-lg border border-border bg-card p-3 text-sm shadow-sm active:cursor-grabbing"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium leading-snug">{card.title}</p>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <button
                            aria-label={`Move "${card.title}"`}
                            onClick={(e) => e.stopPropagation()}
                            className="shrink-0 rounded p-0.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                          >
                            <MoreHorizontal className="size-4" />
                          </button>
                        }
                      />
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                            Move to
                          </DropdownMenuLabel>
                          {columns.map((c) => (
                            <DropdownMenuItem
                              key={c.id}
                              disabled={c.id === card.column}
                              onClick={() => onMove(card.id, c.id)}
                            >
                              {c.name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={cn("rounded-full px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-wide", PRIORITY_STYLES[card.priority])}>
                      {card.priority}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CalendarDays className="size-3" />
                      {card.dueDate.slice(5)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <Avatar className="size-5">
                      <AvatarFallback className="bg-primary/10 text-[0.6rem] font-medium text-primary">
                        {card.assigneeInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{card.assignee}</span>
                  </div>
                </div>
              ))}
              {cards.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border p-3 text-center text-xs text-muted-foreground">
                  Drop a card here
                </p>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
