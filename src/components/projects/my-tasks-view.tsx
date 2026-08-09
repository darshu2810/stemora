"use client";

import Link from "next/link";
import { ListChecks } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { formatDate } from "@/lib/utils";
import { COLUMN_LABELS } from "@/lib/board";
import type { TaskWithProject } from "@/lib/db/queries";

export function MyTasksView({
  clubName,
  tasks,
  basePath,
}: {
  clubName: string;
  tasks: TaskWithProject[];
  basePath: string;
}) {
  const openCount = tasks.filter((t) => t.column_id !== "done").length;

  const columns: DataTableColumn<TaskWithProject>[] = [
    {
      key: "title",
      header: "Task",
      render: (t) => (
        <Link href={`${basePath}/${t.project_id}`} className="font-medium hover:text-primary hover:underline">
          {t.title}
        </Link>
      ),
    },
    { key: "project", header: "Project", render: (t) => t.projectName },
    { key: "column", header: "Status", render: (t) => COLUMN_LABELS[t.column_id] },
    { key: "priority", header: "Priority", render: (t) => <span className="capitalize">{t.priority}</span> },
    {
      key: "dueDate",
      header: "Due",
      render: (t) => (t.due_date ? formatDate(t.due_date) : "—"),
      className: "text-muted-foreground",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={clubName}
        title="My Tasks"
        description={
          tasks.length === 0
            ? "Nothing is assigned to you yet."
            : `${openCount} open ${openCount === 1 ? "task" : "tasks"} across your projects.`
        }
      />

      {tasks.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="No tasks yet"
          description="When your School Admin assigns you a task on a project board, it appears here."
        />
      ) : (
        <DataTable
          data={tasks}
          columns={columns}
          rowKey={(t) => t.id}
          searchPlaceholder="Search tasks…"
          searchFn={(t, q) => t.title.toLowerCase().includes(q.toLowerCase())}
          emptyIcon={ListChecks}
          emptyTitle="No tasks match your search"
          emptyDescription="Try a different word from the task title."
        />
      )}
    </div>
  );
}
