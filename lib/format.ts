export function labelCohort(cohort: string): string {
  const match = cohort.match(/^(\d{4})-([a-z]{3})$/i);
  if (!match) return cohort;
  const month = match[2][0].toUpperCase() + match[2].slice(1).toLowerCase();
  return `${month} ${match[1]}`;
}

export function semesterLabel(semester: string): string {
  const value = semester.trim();
  if (!value) return "";
  if (/^\d+$/.test(value)) return `Semester ${value}`;
  return value;
}

export function semesterShort(semester: string): string {
  const value = semester.trim();
  if (!value) return "";
  if (/^\d+$/.test(value)) return `Sem ${value}`;
  return value;
}

export function initials(name: string, username: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return username.slice(0, 2).toUpperCase();
}

export function plural(count: number, singular: string, pluralForm?: string): string {
  return count === 1 ? singular : (pluralForm ?? `${singular}s`);
}
