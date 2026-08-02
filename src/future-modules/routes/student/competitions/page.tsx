import { CompetitionsView } from "@/components/competitions/competitions-view";

// Parked for the MVP (features.globalCompetitions). Students see competitions
// through the school register today; re-enable this route to give them their
// own read-only view.
export default function StudentCompetitionsPage() {
  return <CompetitionsView eyebrow="Competitions" canManage={false} />;
}
