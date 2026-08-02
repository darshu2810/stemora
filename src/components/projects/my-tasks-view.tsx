"use client";

import * as React from "react";
import Link from "next/link";
import { ListChecks } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { useMockSession } from "@/lib/mock-session";
import { mockProjects, getProjectBoard, BOARD_COLUMNS, type BoardCard } from "@/lib/mock-data";

type MyTask = BoardCard & { projectId: string; projectName: string; clubName: string };

const COLUMN_LABEL = Object.fromEntries(BOARD_COLUMNS.map((c) => [c.id, c.name]));

export function MyTasksView({ eyebrow, basePath }: { eyebrow: string; basePath: string }) {
  const { user } = useMockSession();

  const myTasks: MyTask[] = React.useMemo(() => {
    const tasks: MyTask[] = [];
    for (const project of mockProjects) {
      const board = getProjectBoard(project.id);
      for (const col of BOARD_COLUMNS) {
        for (const card of board[col.id]) {
          if (card.assignee === user.name) {
            tasks.push({ ...card, projectId: project.id, projectName: project.name, clubName: project.clubName });
          }
        }
      }
    }
    return tasks.sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1));
  }, [user.name]);

  const columns: DataTableColumn<MyTask>[] = [
    {
      key: "title",
      header: "Task",
      render: (t) => (
        <Link href={`${basePath}/${t.projectId}`} className="font-medium hover:text-primary hover:underline">
          {t.title}
        </Link>
      ),
    },
    { key: "project", header: "Project", render: (t) => t.projectName },
    { key: "club", header: "Club", render: (t) => t.clubName, className: "text-muted-foreground" },
    { key: "column", header: "Status", render: (t) => COLUMN_LABEL[t.column] },
    { key: "priority", header: "Priority", render: (t) => <span className="capitalize">{t.priority}</span> },
    { key: "dueDate", header: "Due", render: (t) => t.dueDate, className: "text-muted-foreground" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={eyebrow}
        title="My tasks"
        description={`Everything assigned to ${user.name} across every project.`}
      />

      {myTasks.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="Nothing assigned to you"
          description="Tasks assigned to you in any project's kanban board will show up here."
        />
      ) : (
        <DataTable
          data={myTasks}
          columns={columns}
          rowKey={(t) => t.id}
          searchPlaceholder="Search tasks…"
          searchFn={(t, q) => t.title.toLowerCase().includes(q.toLowerCase())}
          emptyIcon={ListChecks}
        />
      )}
    </div>
  );
}
