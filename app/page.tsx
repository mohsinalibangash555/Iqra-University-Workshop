import Link from "next/link";
import { getCohorts, getParticipants } from "@/lib/participants";
import { labelCohort, plural, semesterLabel } from "@/lib/format";
import PageHeader from "@/components/PageHeader";

export default function Home() {
  const participants = getParticipants();
  const cohorts = getCohorts(participants);
  const departments = new Set(
    participants.map((person) => person.department).filter(Boolean)
  ).size;
  const skills = new Set(participants.flatMap((person) => person.skills)).size;
  const cohortLabel = cohorts[0] ? labelCohort(cohorts[0]) : "No cohort yet";

  return (
    <>
      <PageHeader
        kicker={cohortLabel}
        title="Workshop Wall"
        lede="The roster of students who opened a pull request in this workshop, plus the Git sheet and the path from a markdown file to a live card."
      />

      <dl className="metrics">
        <div>
          <dt>{plural(participants.length, "builder")} on the wall</dt>
          <dd>{participants.length}</dd>
        </div>
        <div>
          <dt>{plural(cohorts.length, "workshop")} recorded</dt>
          <dd>{cohorts.length}</dd>
        </div>
        <div>
          <dt>{plural(departments, "department")}</dt>
          <dd>{departments}</dd>
        </div>
        <div>
          <dt>{plural(skills, "skill")} listed</dt>
          <dd>{skills}</dd>
        </div>
      </dl>

      <section className="doc" aria-labelledby="next-title">
        <h2 id="next-title">Open a section</h2>
        <ul className="jump-list">
          <li>
            <Link href="/roster">
              <strong>Roster</strong>
              <span>Search the cards by name, department, or skill.</span>
            </Link>
          </li>
          <li>
            <Link href="/git">
              <strong>Git commands</strong>
              <span>Setup, commit, branch, push, and the exact workshop sequence.</span>
            </Link>
          </li>
          <li>
            <Link href="/workflow">
              <strong>Submit a card</strong>
              <span>Fork, run validate, commit one file, open the pull request.</span>
            </Link>
          </li>
          <li>
            <Link href="/architecture">
              <strong>Architecture</strong>
              <span>Build-time read of the markdown, the schema check, the static export.</span>
            </Link>
          </li>
        </ul>
      </section>

      <section className="doc" aria-labelledby="recent-title">
        <h2 id="recent-title">On the wall</h2>
        {participants.length === 0 ? (
          <p>
            No cards yet. The first one is a file under{" "}
            <code>participants/2026-nov/</code>.
          </p>
        ) : (
          <div className="table-wrap">
            <table className="people">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Semester</th>
                  <th>GitHub</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((person) => (
                  <tr key={`${person.cohort}/${person.username}`}>
                    <td>{person.name || person.username}</td>
                    <td>{person.department || "—"}</td>
                    <td>{semesterLabel(person.semester) || "—"}</td>
                    <td>
                      <a
                        href={`https://github.com/${encodeURIComponent(person.username)}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        @{person.username}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
