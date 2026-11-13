import type { Metadata } from "next";
import { getCohorts, getParticipants } from "@/lib/participants";
import PageHeader from "@/components/PageHeader";
import Wall from "@/components/Wall";

export const metadata: Metadata = {
  title: "Roster",
  description: "Search the students on the Iqra workshop wall.",
};

export default function RosterPage() {
  const participants = getParticipants();
  const cohorts = getCohorts(participants);
  const departments = Array.from(
    new Set(participants.map((person) => person.department).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));

  return (
    <>
      <PageHeader
        kicker="Workshop"
        title="Roster"
        lede="Every card is one markdown file merged through a pull request. Search by name, skill, department, or student ID."
      />
      <Wall
        participants={participants}
        cohorts={cohorts}
        departments={departments}
      />
    </>
  );
}
