export interface Participant {
  cohort: string;      // folder name, e.g. "2026-nov"
  username: string;    // GitHub username
  name: string;
  studentId: string;
  semester: string;
  department: string;
  skills: string[];
  bio: string;
}
