"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, findCurrent, normalizePath } from "@/lib/nav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const current = findCurrent(pathname);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle("nav-open", open);
    return () => document.documentElement.classList.remove("nav-open");
  }, [open]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={open ? "app nav-open" : "app"}>
      <a className="skip" href="#content">
        Skip to content
      </a>
      {open && (
        <button
          type="button"
          className="scrim"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}
      <aside className="sidebar" id="site-sidebar" aria-label="Sections">
        <Link className="side-brand" href="/">
          <span className="mark" aria-hidden="true">
            IU
          </span>
          <span className="brand-name">
            <strong>Workshop Wall</strong>
            <small>Iqra University · CS</small>
          </span>
        </Link>

        {NAV.map((group) => (
          <div key={group.label} className="side-group">
            <p className="side-label">{group.label}</p>
            <ul>
              {group.items.map((item) => {
                const on =
                  !item.external &&
                  normalizePath(pathname) === normalizePath(item.href);
                const className = on ? "side-link active" : "side-link";
                const inner = (
                  <>
                    <span>{item.label}</span>
                    <small>{item.detail}</small>
                  </>
                );
                return (
                  <li key={item.href}>
                    {item.external ? (
                      <a
                        className={className}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {inner}
                      </a>
                    ) : (
                      <Link className={className} href={item.href} aria-current={on ? "page" : undefined}>
                        {inner}
                      </Link>
                    )}
                    {item.children && (
                      <ul className="side-sub">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link href={child.href}>{child.label}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </aside>

      <div className="app-main">
        <header className="app-top">
          <button
            type="button"
            className="menu-btn"
            aria-expanded={open}
            aria-controls="site-sidebar"
            onClick={() => setOpen((value) => !value)}
          >
            Menu
          </button>
          <p className="crumb">
            {current ? (
              <>
                <span>{current.group}</span>
                <span aria-hidden="true"> / </span>
                <strong>{current.item.label}</strong>
              </>
            ) : (
              <strong>Workshop Wall</strong>
            )}
          </p>
        </header>
        <div className="app-content" id="content">
          {children}
        </div>
      </div>
    </div>
  );
}
