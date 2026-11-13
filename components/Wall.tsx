"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Participant } from "@/lib/types";
import { labelCohort, plural } from "@/lib/format";
import ParticipantCard from "./ParticipantCard";

function topSkills(participants: Participant[], limit = 12): string[] {
  const counts = new Map<string, number>();
  for (const person of participants) {
    for (const skill of person.skills) {
      counts.set(skill, (counts.get(skill) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([skill]) => skill);
}

export default function Wall({
  participants,
  cohorts,
  departments,
}: {
  participants: Participant[];
  cohorts: string[];
  departments: string[];
}) {
  const [cohort, setCohort] = useState("all");
  const [department, setDepartment] = useState("all");
  const [skill, setSkill] = useState("all");
  const [query, setQuery] = useState("");

  const skills = useMemo(() => topSkills(participants), [participants]);
  const filtersOn =
    cohort !== "all" ||
    department !== "all" ||
    skill !== "all" ||
    query.trim().length > 0;

  const shown = participants.filter((person) => {
    if (cohort !== "all" && person.cohort !== cohort) return false;
    if (department !== "all" && person.department !== department) return false;
    if (skill !== "all" && !person.skills.includes(skill)) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    const haystack = [
      person.name,
      person.username,
      person.department,
      person.semester,
      person.studentId,
      person.bio,
      ...person.skills,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });

  function clear() {
    setCohort("all");
    setDepartment("all");
    setSkill("all");
    setQuery("");
  }

  return (
    <section className="directory" aria-label="Workshop participants">
      <div className="directory-inner">
        {cohorts.length > 1 && (
            <div className="chips" role="tablist" aria-label="Filter by workshop">
              <button
                type="button"
                role="tab"
                aria-selected={cohort === "all"}
                className="chip"
                onClick={() => setCohort("all")}
              >
                All workshops
              </button>
              {cohorts.map((item) => (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={cohort === item}
                  className="chip"
                  onClick={() => setCohort(item)}
                >
                  {labelCohort(item)}
                </button>
            ))}
          </div>
        )}

        {participants.length > 0 && (
          <>
            <div className="toolbar">
              <form
                className="search"
                role="search"
                onSubmit={(event) => event.preventDefault()}
              >
                <label className="sr-only" htmlFor="roster-search">
                  Search builders
                </label>
                <input
                  id="roster-search"
                  className="field"
                  type="search"
                  placeholder="Search name, skill, department…"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </form>
              {departments.length > 0 && (
                <div>
                  <label className="sr-only" htmlFor="dept-filter">
                    Department
                  </label>
                  <select
                    id="dept-filter"
                    className="field select"
                    value={department}
                    onChange={(event) => setDepartment(event.target.value)}
                  >
                    <option value="all">All departments</option>
                    {departments.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {skills.length > 0 && (
              <div className="chips" role="group" aria-label="Filter by skill">
                <button
                  type="button"
                  className="chip"
                  aria-pressed={skill === "all"}
                  onClick={() => setSkill("all")}
                >
                  All skills
                </button>
                {skills.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="chip"
                    aria-pressed={skill === item}
                    onClick={() => setSkill(skill === item ? "all" : item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}

            <div className="results">
              <p aria-live="polite">
                Showing {shown.length} of {participants.length}{" "}
                {plural(participants.length, "builder")}
              </p>
              {filtersOn && (
                <button type="button" className="clear" onClick={clear}>
                  Clear filters
                </button>
              )}
            </div>
          </>
        )}

        {participants.length === 0 ? (
          <div className="empty">
            <h3>The wall is waiting</h3>
            <p>
              Be the first. Fork the repo and run <code>/do-task</code> in
              Cursor.
            </p>
            <Link className="btn btn-navy" href="/workflow">
              How to submit
            </Link>
          </div>
        ) : shown.length === 0 ? (
          <div className="empty">
            <h3>No one matches that search</h3>
            <p>Try another name, skill, or department.</p>
            <button type="button" className="btn btn-navy" onClick={clear}>
              Clear filters
            </button>
          </div>
        ) : (
          <ul className="grid">
            {shown.map((person, index) => (
              <ParticipantCard
                key={`${person.cohort}/${person.username}`}
                p={person}
                index={index}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
