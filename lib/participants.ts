import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Participant } from "./types";

const ROOT = path.join(process.cwd(), "participants");

// Read every participants/<cohort>/<username>.md at build time.
// One file per person is what keeps contributions conflict-free.
export function getParticipants(): Participant[] {
  if (!fs.existsSync(ROOT)) return [];
  const all: Participant[] = [];

  for (const cohort of fs.readdirSync(ROOT)) {
    const dir = path.join(ROOT, cohort);
    if (!fs.statSync(dir).isDirectory()) continue;

    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".md")) continue;
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      all.push({
        cohort,
        username: String(data.github || file.replace(/\.md$/, "")),
        name: String(data.name || ""),
        studentId: String(data.id || ""),
        semester: String(data.semester || ""),
        department: String(data.department || ""),
        skills: Array.isArray(data.skills) ? data.skills.map(String) : [],
        bio: content.trim(),
      });
    }
  }
  return all.sort((a, b) => a.name.localeCompare(b.name));
}

export function getCohorts(parts: Participant[]): string[] {
  return Array.from(new Set(parts.map((p) => p.cohort))).sort().reverse();
}
