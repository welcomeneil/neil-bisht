"use client";

import { useSyncExternalStore } from "react";

function relativeFrom(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const then = Date.UTC(y, m - 1, d);
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const days = Math.round((today - then) / 86_400_000);

  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;

  const months = Math.floor(days / 30.44);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;

  const years = Math.floor(days / 365.25);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

// The clock never notifies us; a day-boundary crossing mid-visit can wait.
const subscribe = () => () => {};
const serverSnapshot = () => null;

/**
 * "3 days ago" depends on the wall clock, and the server's is frozen at build
 * time. Render nothing there, fill in on hydration.
 */
export default function TimeAgo({
  date,
  prefix = "updated",
}: {
  date: string;
  prefix?: string;
}) {
  const label = useSyncExternalStore(
    subscribe,
    () => relativeFrom(date),
    serverSnapshot,
  );

  if (!label) return null;
  return (
    <>
      {prefix} {label}
    </>
  );
}
