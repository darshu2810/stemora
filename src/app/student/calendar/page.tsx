import { SchoolCalendarView } from "@/components/calendar/school-calendar-view";

export default function StudentCalendarPage() {
  return <SchoolCalendarView eyebrow="My clubs" canManage={false} />;
}
