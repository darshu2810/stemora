"use client";

import * as React from "react";
import Link from "next/link";
import { ListChecks } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { formatDate } from "@/lib/utils";
import { mockSchool, mockUsers, tasksForStudent, BOARD_COLUMNS, type OpenTask } from "@/lib/mock-data";

const COLUMN_LABEL = Object.fromEntries(BOARD_COLUMNS.map((c) => [c.id, c.name]));

export function MyTasksView({ basePath }: { basePath: string }) {
  const student = mockUsers.student;
  const myTasks = React.useMemo(() => tasksForStudent(student.id), [student.id]);
  const openCount = myTasks.filter((t) => t.column !== "done").length;

  const columns: DataTableColumn<OpenTask>[] = [
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
    { key: "column", header: "Status", render: (t) => COLUMN_LABEL[t.column] },
    { key: "priority", header: "Priority", render: (t) => <span className="capitalize">{t.priority}</span> },
    { key: "dueDate", header: "Due", render: (t) => formatDate(t.dueDate), className: "text-muted-foreground" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={mockSchool.clubName}
        title="My Tasks"
        description={`${openCount} open ${openCount === 1 ? "task" : "tasks"} across your projects.`}
      />

      {myTasks.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="No tasks have been assigned to you yet"
          description="When a project leader assigns you a task on a project board, it appears here."
        />
      ) : (
        <DataTable
          data={myTasks}
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
