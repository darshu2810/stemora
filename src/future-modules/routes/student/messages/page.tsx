import { PageHeader } from "@/components/shared/page-header";
import { MessagingView } from "@/components/messaging/messaging-view";

export default function StudentMessagesPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Messages" title="Messages" description="Direct messages, project chats, and announcements." />
      <MessagingView />
    </div>
  );
}
