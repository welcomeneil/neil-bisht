import { createHash, timingSafeEqual, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { commitFiles, readFile } from "@/lib/github";
import { snapshottablePieces, type PieceLog } from "@/lib/work";

export const dynamic = "force-dynamic";

const LOG_PATH = "content/snapshots.json";
const MAX_BASE64 = 8_000_000; // ~6MB decoded; a compressed phone photo is well under

function authorized(supplied: unknown): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || typeof supplied !== "string") return false;
  // Hash first so both buffers are 32 bytes; timingSafeEqual throws on mismatch.
  const a = createHash("sha256").update(supplied).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return bad("invalid json");
  }

  if (!authorized(body.password)) return bad("unauthorized", 401);

  const { slug, date, message, note, imageBase64, markDone } = body;

  // Constrain slug to a known piece — it becomes a path component below.
  const known = snapshottablePieces().map((p) => p.slug);
  if (typeof slug !== "string" || !known.includes(slug)) return bad("unknown piece");

  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return bad("bad date");
  if (typeof message !== "string" || !message.trim()) return bad("message required");
  if (message.length > 200) return bad("message too long");
  if (note !== undefined && typeof note !== "string") return bad("bad note");
  if (typeof imageBase64 !== "string" || !imageBase64) return bad("image required");
  if (imageBase64.length > MAX_BASE64) return bad("image too large", 413);
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(imageBase64)) return bad("image not base64");

  const filename = `${date}-${randomBytes(2).toString("hex")}.jpg`;
  const imagePath = `public/work/${slug}/${filename}`;

  try {
    // Read the log from the branch tip, not the bundled copy, so concurrent
    // uploads from a stale deployment can't clobber each other.
    const logs = JSON.parse(await readFile(LOG_PATH)) as Record<string, PieceLog>;
    const existing = logs[slug] ?? { snapshots: [] };

    existing.snapshots = [
      ...existing.snapshots,
      {
        date,
        message: message.trim(),
        imageUrl: `/work/${slug}/${filename}`,
        ...(typeof note === "string" && note.trim() ? { note: note.trim() } : {}),
      },
    ].sort((a, b) => a.date.localeCompare(b.date));

    existing.status = markDone === true ? "done" : "wip";
    logs[slug] = existing;

    const sha = await commitFiles(
      [
        { path: imagePath, content: imageBase64, encoding: "base64" },
        {
          path: LOG_PATH,
          content: JSON.stringify(logs, null, 2) + "\n",
          encoding: "utf-8",
        },
      ],
      `snapshot(${slug}): ${message.trim()}`,
    );

    return NextResponse.json({ ok: true, sha: sha.slice(0, 7) });
  } catch (err) {
    console.error("snapshot commit failed", err);
    return bad(err instanceof Error ? err.message : "commit failed", 500);
  }
}
