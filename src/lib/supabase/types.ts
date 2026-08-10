// Row shapes for the STEMORA schema, kept in step with the migrations applied
// to the Supabase project. Insert/Update are derived rather than spelled out,
// which keeps this readable while still catching column typos and wrong value
// types at the call site.

export type UserRoleEnum = "platform_owner" | "school_admin" | "student";
// `pending` is a student who asked to join; `invited` is one a School Admin
// sought out. Neither can sign in to anything — the difference is who moved
// first, and only `pending` needs a decision from the club head.
export type MembershipStatus = "pending" | "invited" | "active" | "suspended" | "removed";
export type InvitationStatus = "pending" | "accepted" | "expired" | "revoked";
/** Where a school's request to join STEMORA has got to. */
export type ApplicationStatus = "pending" | "approved" | "rejected";
/** Metadata describing a project's subject area — not an organisational unit. */
export type ProjectCategory =
  | "Robotics"
  | "Programming"
  | "Artificial Intelligence"
  | "Engineering"
  | "Electronics"
  | "Mathematics"
  | "Research"
  | "Physics"
  | "Environmental Science";
export type ProjectStatus = "active" | "completed";
export type TaskColumn = "backlog" | "todo" | "in_progress" | "in_review" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type CompetitionLevel = "School" | "Regional" | "National" | "International";
export type CompetitionStatus = "upcoming" | "completed";
export type EventType = "Meeting" | "Workshop" | "Competition" | "Showcase";
export type ResourceType = "file" | "link";
export type NotificationType =
  | "task_assigned"
  | "task_completed"
  | "announcement"
  | "event_reminder"
  | "competition_deadline"
  | "resource_uploaded";

type SchoolRow = {
  id: string;
  name: string;
  slug: string;
  district: string | null;
  club_name: string;
  status: string;
  created_at: string;
  updated_at: string;
};

type UserRow = {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  platform_role: string;
  created_at: string;
  updated_at: string;
};

type SchoolMemberRow = {
  id: string;
  school_id: string;
  user_id: string;
  role: UserRoleEnum;
  grade: number | null;
  status: MembershipStatus;
  joined_at: string;
  created_at: string;
  updated_at: string;
};

type InvitationRow = {
  id: string;
  school_id: string;
  email: string;
  full_name: string | null;
  grade: number | null;
  status: InvitationStatus;
  invited_by: string;
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
  updated_at: string;
};

type SchoolApplicationRow = {
  id: string;
  applicant_id: string;
  applicant_name: string;
  applicant_email: string;
  school_name: string;
  club_name: string;
  school_email_domain: string | null;
  city: string | null;
  country: string | null;
  status: ApplicationStatus;
  rejection_reason: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  school_id: string | null;
  created_at: string;
  updated_at: string;
};

type ActivityLogRow = {
  id: string;
  school_id: string;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  summary: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

type ProjectRow = {
  id: string;
  school_id: string;
  name: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  started_at: string;
  due_date: string;
  leader_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

type ProjectMemberRow = {
  id: string;
  school_id: string;
  project_id: string;
  user_id: string;
  added_at: string;
  created_at: string;
  updated_at: string;
};

type ProjectTaskRow = {
  id: string;
  school_id: string;
  project_id: string;
  title: string;
  assignee_id: string | null;
  column_id: TaskColumn;
  priority: TaskPriority;
  position: number;
  due_date: string | null;
  created_at: string;
  updated_at: string;
};

type CompetitionRow = {
  id: string;
  school_id: string;
  name: string;
  category: ProjectCategory;
  level: CompetitionLevel;
  event_date: string;
  status: CompetitionStatus;
  result: string | null;
  podium: boolean;
  created_at: string;
  updated_at: string;
};

type CompetitionParticipantRow = {
  id: string;
  school_id: string;
  competition_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

type EventRow = {
  id: string;
  school_id: string;
  title: string;
  type: EventType;
  event_date: string;
  start_time: string;
  location: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

type EventRsvpRow = {
  id: string;
  school_id: string;
  event_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

type ResourceRow = {
  id: string;
  school_id: string;
  title: string;
  /** Null is a general club resource, belonging to no particular subject. */
  category: ProjectCategory | null;
  type: ResourceType;
  url: string | null;
  storage_path: string | null;
  size_bytes: number | null;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
};

type AnnouncementRow = {
  id: string;
  school_id: string;
  author_id: string;
  title: string;
  body: string;
  pinned: boolean;
  created_at: string;
  updated_at: string;
};

type BadgeRow = {
  id: string;
  name: string;
  description: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type StudentAchievementRow = {
  id: string;
  school_id: string;
  user_id: string;
  badge_id: string;
  note: string | null;
  awarded_by: string;
  earned_at: string;
  created_at: string;
  updated_at: string;
};

type StudentProfileRow = {
  user_id: string;
  school_id: string;
  headline: string | null;
  about: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
};

type StudentSkillRow = {
  id: string;
  school_id: string;
  user_id: string;
  name: string;
  category: string;
  level: number;
  created_at: string;
  updated_at: string;
};

type StudentCertificateRow = {
  id: string;
  school_id: string;
  user_id: string;
  title: string;
  issuer: string;
  issued_on: string;
  created_at: string;
  updated_at: string;
};

type NotificationRow = {
  id: string;
  school_id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  link_path: string | null;
  read_at: string | null;
  created_at: string;
  updated_at: string;
};

/** Every table exposes the same Row / Insert / Update triple. */
type TableOf<Row> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      schools: TableOf<SchoolRow>;
      school_applications: TableOf<SchoolApplicationRow>;
      users: TableOf<UserRow>;
      school_members: TableOf<SchoolMemberRow>;
      invitations: TableOf<InvitationRow>;
      projects: TableOf<ProjectRow>;
      project_members: TableOf<ProjectMemberRow>;
      project_tasks: TableOf<ProjectTaskRow>;
      competitions: TableOf<CompetitionRow>;
      competition_participants: TableOf<CompetitionParticipantRow>;
      activity_logs: TableOf<ActivityLogRow>;
      events: TableOf<EventRow>;
      event_rsvps: TableOf<EventRsvpRow>;
      resources: TableOf<ResourceRow>;
      announcements: TableOf<AnnouncementRow>;
      badges: TableOf<BadgeRow>;
      student_achievements: TableOf<StudentAchievementRow>;
      student_profiles: TableOf<StudentProfileRow>;
      student_skills: TableOf<StudentSkillRow>;
      student_certificates: TableOf<StudentCertificateRow>;
      notifications: TableOf<NotificationRow>;
    };
    Views: Record<never, never>;
    Functions: {
      current_school_id: { Args: Record<never, never>; Returns: string };
      is_school_member: { Args: { target_school: string }; Returns: boolean };
      is_school_affiliate: { Args: { target_school: string }; Returns: boolean };
      joinable_schools: {
        Args: Record<never, never>;
        Returns: { id: string; name: string; club_name: string; district: string | null }[];
      };
      is_platform_owner: { Args: Record<never, never>; Returns: boolean };
      has_school_role: {
        Args: { target_school: string; min_role: UserRoleEnum };
        Returns: boolean;
      };
      submit_school_application: {
        Args: {
          p_school_name: string;
          p_club_name?: string;
          p_school_email_domain?: string;
          p_city?: string;
          p_country?: string;
        };
        Returns: string;
      };
      promote_to_school_admin: { Args: { p_user: string }; Returns: undefined };
      demote_school_admin: { Args: { p_user: string }; Returns: undefined };
      step_down_as_school_admin: { Args: Record<never, never>; Returns: undefined };
      approve_school_application: { Args: { p_application: string }; Returns: string };
      reject_school_application: {
        Args: { p_application: string; p_reason?: string };
        Returns: undefined;
      };
    };
    Enums: {
      user_role: UserRoleEnum;
      membership_status: MembershipStatus;
      invitation_status: InvitationStatus;
      application_status: ApplicationStatus;
      project_category: ProjectCategory;
      project_status: ProjectStatus;
      task_column: TaskColumn;
      task_priority: TaskPriority;
      competition_level: CompetitionLevel;
      competition_status: CompetitionStatus;
      event_type: EventType;
      resource_type: ResourceType;
      notification_type: NotificationType;
    };
    CompositeTypes: Record<never, never>;
  };
};

// Domain aliases used across the app.
export type School = SchoolRow;
export type SchoolApplication = SchoolApplicationRow;
export type AppUser = UserRow;
export type ActivityLog = ActivityLogRow;
export type SchoolMember = SchoolMemberRow;
export type Invitation = InvitationRow;
export type Project = ProjectRow;
export type ProjectTask = ProjectTaskRow;
export type Competition = CompetitionRow;
export type StemEvent = EventRow;
export type Resource = ResourceRow;
export type Announcement = AnnouncementRow;
export type Badge = BadgeRow;
export type StudentAchievement = StudentAchievementRow;
export type StudentProfile = StudentProfileRow;
export type StudentSkill = StudentSkillRow;
export type StudentCertificate = StudentCertificateRow;
export type Notification = NotificationRow;
