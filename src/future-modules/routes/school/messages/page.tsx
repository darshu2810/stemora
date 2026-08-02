import { PageHeader } from "@/components/shared/page-header";
import { MessagingView } from "@/components/messaging/messaging-view";

export default function SchoolMessagesPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="School" title="Messages" description="Direct messages, project chats, and announcements." />
      <MessagingView />
    </div>
  );
}
