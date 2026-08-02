"use client";

import * as React from "react";
import { Search, Send, Megaphone, MessagesSquare, Users2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";
import { useMockSession } from "@/lib/mock-session";
import { mockConversations as initialConversations, type Conversation, type ConversationType } from "@/lib/mock-data";

const TYPE_ICON: Record<ConversationType, typeof MessagesSquare> = {
  dm: MessagesSquare,
  project: Users2,
  announcement: Megaphone,
};

const TABS: { value: ConversationType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "dm", label: "Direct" },
  { value: "project", label: "Projects" },
  { value: "announcement", label: "Announcements" },
];

export function MessagingView() {
  const { user } = useMockSession();
  const [conversations, setConversations] = React.useState<Conversation[]>(initialConversations);
  const [tab, setTab] = React.useState<ConversationType | "all">("all");
  const [query, setQuery] = React.useState("");
  const [activeId, setActiveId] = React.useState(initialConversations[0]?.id ?? "");
  const [draft, setDraft] = React.useState("");

  const filtered = conversations.filter(
    (c) =>
      (tab === "all" || c.type === tab) &&
      (c.title.toLowerCase().includes(query.toLowerCase()) || c.lastMessage.toLowerCase().includes(query.toLowerCase()))
  );

  const active = conversations.find((c) => c.id === activeId) ?? filtered[0];

  function selectConversation(id: string) {
    setActiveId(id);
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  }

  function sendMessage() {
    if (!draft.trim() || !active) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === active.id
          ? {
              ...c,
              lastMessage: draft,
              lastTime: "Just now",
              messages: [
                ...c.messages,
                {
                  id: `m_${c.messages.length}_${draft.length}`,
                  author: user.name,
                  authorInitials: user.avatarInitials,
                  body: draft,
                  time: "Just now",
                },
              ],
            }
          : c
      )
    );
    setDraft("");
  }

  return (
    <div className="flex h-[calc(100vh-9rem)] min-h-[420px] overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex w-full max-w-xs shrink-0 flex-col border-r border-border">
        <div className="space-y-3 border-b border-border p-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search messages…"
              className="pl-8"
            />
          </div>
          <Tabs value={tab} onValueChange={(v) => v && setTab(v as ConversationType | "all")}>
            <TabsList className="w-full">
              {TABS.map((t) => (
                <TabsTrigger key={t.value} value={t.value} className="flex-1 text-xs">
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">No conversations found.</p>
          ) : (
            filtered.map((c) => {
              const Icon = TYPE_ICON[c.type];
              return (
                <button
                  key={c.id}
                  onClick={() => selectConversation(c.id)}
                  className={cn(
                    "flex w-full items-start gap-3 border-b border-border p-3 text-left transition-colors hover:bg-secondary/50",
                    active?.id === c.id && "bg-secondary/70"
                  )}
                >
                  <Avatar className="size-9 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium">{c.title}</p>
                      <span className="shrink-0 font-mono text-[0.65rem] text-muted-foreground">{c.lastTime}</span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{c.lastMessage}</p>
                  </div>
                  {c.unread > 0 ? (
                    <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-[0.6rem] font-semibold text-primary-foreground">
                      {c.unread}
                    </span>
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        {!active ? (
          <div className="flex flex-1 items-center justify-center p-8">
            <EmptyState icon={MessagesSquare} title="No conversation selected" description="Pick a conversation from the list." />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 border-b border-border p-4">
              <Avatar className="size-9">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {React.createElement(TYPE_ICON[active.type], { className: "size-4" })}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{active.title}</p>
                <p className="text-xs text-muted-foreground">{active.subtitle}</p>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {active.messages.map((m) => {
                const self = m.author === user.name;
                return (
                  <div key={m.id} className={cn("flex gap-2", self && "flex-row-reverse")}>
                    <Avatar className="size-7 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-[0.65rem] text-primary">{m.authorInitials}</AvatarFallback>
                    </Avatar>
                    <div className={cn("max-w-[70%]", self && "items-end text-right")}>
                      {!self ? <p className="mb-0.5 text-xs font-medium text-muted-foreground">{m.author}</p> : null}
                      <div
                        className={cn(
                          "rounded-2xl px-3.5 py-2 text-sm",
                          self ? "rounded-tr-sm bg-primary text-primary-foreground" : "rounded-tl-sm bg-secondary"
                        )}
                      >
                        {m.body}
                      </div>
                      <p className="mt-0.5 text-[0.65rem] text-muted-foreground">{m.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <form
              className="flex items-center gap-2 border-t border-border p-3"
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
            >
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={`Message ${active.title}…`}
                className="flex-1"
              />
              <Button type="submit" size="icon" aria-label="Send message" disabled={!draft.trim()}>
                <Send className="size-4" />
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
