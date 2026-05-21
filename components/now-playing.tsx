"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Track {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string | null;
  songUrl?: string;
  progressMs?: number;
  durationMs?: number;
  fetchedAt?: number;
  error?: boolean;
}

const POLL_INTERVAL = 1_000;

function formatTime(ms: number): string {
  const total = Math.floor(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function NowPlaying() {
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  // Ticks every second to advance progress locally between API polls.
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const res = await fetch("/api/spotify");
        const data: Track = await res.json();
        if (active) setTrack(data);
      } catch {
        if (active) setTrack({ isPlaying: false, error: true });
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    const pollId = setInterval(load, POLL_INTERVAL);
    const tickId = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      active = false;
      clearInterval(pollId);
      clearInterval(tickId);
    };
  }, []);

  if (loading) {
    return <p className="font-sans text-[14px] text-muted">…</p>;
  }

  if (!track || track.error || !track.title) {
    return (
      <p className="font-sans text-[14px] text-muted">
        nothing to show right now
      </p>
    );
  }

  const durationMs = track.durationMs ?? 0;
  // While playing, advance from the last known position by wall-clock time.
  const elapsedMs = track.isPlaying
    ? Math.min(
        (track.progressMs ?? 0) + (now - (track.fetchedAt ?? now)),
        durationMs,
      )
    : 0;
  const percent = durationMs > 0 ? (elapsedMs / durationMs) * 100 : 0;
  const showProgress = track.isPlaying && durationMs > 0;

  return (
    <a
      href={track.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 max-w-md"
    >
      {track.albumImageUrl && (
        <Image
          src={track.albumImageUrl}
          alt={track.album ?? track.title}
          width={48}
          height={48}
          className="w-12 h-12 object-cover shrink-0"
          unoptimized
        />
      )}
      <span className="flex flex-col gap-1.5 min-w-0 flex-1">
        <span className="font-sans text-[11px] tracking-wide text-muted">
          {track.isPlaying ? "playing now" : "last played"}
        </span>
        <span className="font-sans text-[14px] text-foreground leading-snug truncate group-hover:underline">
          {track.title} — {track.artist}
        </span>

        {showProgress && (
          <span className="flex items-center gap-2 mt-0.5">
            <span className="h-px flex-1 bg-warm-border relative overflow-hidden">
              <span
                className="absolute inset-y-0 left-0 bg-foreground"
                style={{ width: `${percent}%` }}
              />
            </span>
            <span className="font-sans text-[10px] tabular-nums text-muted shrink-0">
              {formatTime(elapsedMs)} / {formatTime(durationMs)}
            </span>
          </span>
        )}
      </span>
    </a>
  );
}
