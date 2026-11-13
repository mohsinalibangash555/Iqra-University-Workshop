import { REPO_URL } from "./site";

export type NavChild = {
  href: string;
  label: string;
};

export type NavItem = {
  href: string;
  label: string;
  detail: string;
  external?: boolean;
  children?: NavChild[];
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const NAV: NavGroup[] = [
  {
    label: "Workshop",
    items: [
      {
        href: "/",
        label: "Overview",
        detail: "Counts, cohort, where to go next",
      },
      {
        href: "/roster",
        label: "Roster",
        detail: "Search every card on the wall",
      },
    ],
  },
  {
    label: "Reference",
    items: [
      {
        href: "/git",
        label: "Git commands",
        detail: "The sheet to keep open while you work",
        children: [
          { href: "/git#setup", label: "Setup" },
          { href: "/git#inspect", label: "Inspect" },
          { href: "/git#commit", label: "Commit" },
          { href: "/git#branch", label: "Branch" },
          { href: "/git#sync", label: "Sync" },
          { href: "/git#workshop", label: "This workshop" },
          { href: "/git#undo", label: "Undo" },
        ],
      },
      {
        href: "/workflow",
        label: "Submit a card",
        detail: "Fork, validate, commit, pull request",
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        href: "/architecture",
        label: "Architecture",
        detail: "How a markdown file becomes a card",
      },
      {
        href: REPO_URL,
        label: "Repository",
        detail: "umar9991/Iqra-University-Workshop",
        external: true,
      },
    ],
  },
];

export function normalizePath(path: string): string {
  if (!path) return "/";
  const bare = path.split("?")[0].split("#")[0].replace(/\/+$/, "");
  return bare === "" ? "/" : bare;
}

export function findCurrent(pathname: string): { group: string; item: NavItem } | null {
  const path = normalizePath(pathname);
  for (const group of NAV) {
    for (const item of group.items) {
      if (!item.external && normalizePath(item.href) === path) {
        return { group: group.label, item };
      }
    }
  }
  return null;
}
