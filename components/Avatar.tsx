"use client";

import { useState } from "react";
import { initials } from "@/lib/format";

export default function Avatar({
  username,
  name,
  size = 56,
}: {
  username: string;
  name: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);
  const style = { width: size, height: size, fontSize: Math.round(size * 0.34) };

  if (failed || !username) {
    return (
      <span className="avatar avatar-fallback" style={style} aria-hidden="true">
        {initials(name, username)}
      </span>
    );
  }

  return (
    <img
      className="avatar"
      src={`https://github.com/${encodeURIComponent(username)}.png?size=${size * 2}`}
      alt=""
      width={size}
      height={size}
      style={style}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
