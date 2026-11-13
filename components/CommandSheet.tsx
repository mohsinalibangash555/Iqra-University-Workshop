"use client";

import { useState } from "react";
import { GIT_GROUPS } from "@/lib/git-commands";

function CopyButton({ text }: { text: string }) {
  const [label, setLabel] = useState("Copy");

  return (
    <button
      type="button"
      className="copy"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setLabel("Copied");
        } catch {
          setLabel("Failed");
        }
        window.setTimeout(() => setLabel("Copy"), 1400);
      }}
    >
      {label}
    </button>
  );
}

export default function CommandSheet() {
  return (
    <div className="sheet">
      <nav className="toc" aria-label="On this page">
        {GIT_GROUPS.map((group) => (
          <a key={group.id} href={`#${group.id}`}>
            {group.title}
          </a>
        ))}
      </nav>

      {GIT_GROUPS.map((group) => (
        <section key={group.id} id={group.id} className="cmd-group">
          <h2>{group.title}</h2>
          <p>{group.note}</p>
          <div className="table-wrap">
            <table className="cmd-table">
              <thead>
                <tr>
                  <th>Command</th>
                  <th>What it does</th>
                  <th>
                    <span className="sr-only">Copy</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {group.commands.map((command) => (
                  <tr key={command.command}>
                    <td>
                      <code>{command.command}</code>
                    </td>
                    <td>{command.purpose}</td>
                    <td>
                      <CopyButton text={command.command} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
