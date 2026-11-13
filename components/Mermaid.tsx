"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Mermaid } from "mermaid";
// Mermaid hovers call selection.transition(). That method is added by
// d3-transition. Mermaid only imports `select` from d3, so the patch never runs.
import "d3-transition";

let mermaidPromise: Promise<Mermaid> | null = null;
let renderQueue: Promise<void> = Promise.resolve();

function enqueue(task: () => Promise<void>): Promise<void> {
  const job = renderQueue.then(task, task);
  renderQueue = job.then(
    () => undefined,
    () => undefined
  );
  return job;
}

function readToken(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function loadMermaid(): Promise<Mermaid> {
  if (!mermaidPromise) {
    mermaidPromise = import("d3-transition")
      .then(() => import("mermaid"))
      .then((mod) => {
        const mermaid = mod.default;
        const font = readToken("--font-body");
        mermaid.initialize({
          startOnLoad: false,
          theme: "neutral",
          securityLevel: "loose",
          themeVariables: {
            fontFamily: font ? `${font}, sans-serif` : "sans-serif",
            background: readToken("--paper"),
            primaryColor: readToken("--card"),
            primaryTextColor: readToken("--ink"),
            primaryBorderColor: readToken("--navy"),
            secondaryColor: readToken("--paper"),
            secondaryTextColor: readToken("--ink"),
            secondaryBorderColor: readToken("--navy-600"),
            tertiaryColor: readToken("--mist"),
            tertiaryTextColor: readToken("--ink"),
            tertiaryBorderColor: readToken("--navy"),
            lineColor: readToken("--navy-600"),
            textColor: readToken("--ink"),
            mainBkg: readToken("--card"),
            nodeBorder: readToken("--navy"),
            clusterBkg: readToken("--paper"),
            clusterBorder: readToken("--navy"),
            titleColor: readToken("--navy"),
            nodeTextColor: readToken("--ink"),
          },
        });
        return mermaid;
      });
  }
  return mermaidPromise;
}

function showAtNaturalSize(node: HTMLElement) {
  const svg = node.querySelector("svg");
  if (!svg) return;
  const width = svg.viewBox.baseVal.width;
  const height = svg.viewBox.baseVal.height;
  if (!width || !height) return;
  svg.setAttribute("width", String(Math.ceil(width)));
  svg.setAttribute("height", String(Math.ceil(height)));
  svg.style.maxWidth = "none";
  svg.style.width = `${Math.ceil(width)}px`;
  svg.style.height = `${Math.ceil(height)}px`;
}

export default function Mermaid({
  chart,
  label = "Iqra University GitHub organization",
  scroll = false,
}: {
  chart: string;
  label?: string;
  scroll?: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const reactId = useId().replace(/:/g, "");
  const renderSeq = useRef(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    const node = document.createElement("div");
    node.className = "mermaid";
    node.id = `diagram-${reactId}-${++renderSeq.current}`;
    node.textContent = chart;
    host.replaceChildren(node);

    enqueue(async () => {
      if (cancelled || !node.isConnected) return;
      const mermaid = await loadMermaid();
      if (cancelled || !node.isConnected) return;
      await mermaid.run({ nodes: [node], suppressErrors: true });
      if (!cancelled && scroll) showAtNaturalSize(node);
    }).catch(() => {
      if (!cancelled) setFailed(true);
    });

    return () => {
      cancelled = true;
      host.replaceChildren();
    };
  }, [chart, reactId, scroll]);

  return (
    <div className="diagram-scroll" role="img" aria-label={label}>
      <div ref={hostRef} />
      {failed && <p>This diagram could not be drawn.</p>}
    </div>
  );
}
