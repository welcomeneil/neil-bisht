import { createHash, timingSafeEqual, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { commitFiles, readFile } from "@/lib/github";
import {
  TILE_PALETTE,
  WORK_CATEGORIES,
  slugify,
  type PieceLog,
  type WorkCategory,
  type WorkItem,
} from "@/lib/work";

export const dynamic = "force-dynamic";

const WORK_PATH = "content/work.json";
const LOG_PATH = "content/snapshots.json";
const MAX_BASE64 = 8_000_000; // ~6MB decoded
const ASPECTS = ["portrait", "landscape", "square"] as const;

function authorized(supplied: unknown): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || typeof supplied !== "string") return false;
  const a = createHash("sha256").update(supplied).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function str(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function today(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return bad("invalid json");
  }

  if (!authorized(body.password)) return bad("unauthorized", 401);

  const category = body.category as WorkCategory;
  if (!WORK_CATEGORIES.includes(category)) return bad("unknown category");

  const title = str(body.title, 80);
  if (!title) return bad("title required");

  const aspect = ASPECTS.includes(body.aspect as (typeof ASPECTS)[number])
    ? (body.aspect as WorkItem["aspect"])
    : "square";

  const year = /^\d{4}$/.test(String(body.year)) ? String(body.year) : today().slice(0, 4);
  const overview = str(body.overview, 600);
  const role = str(body.role, 1200);
  const link = str(body.link, 300);
  const repo = str(body.repo, 300);
  if (link && !/^https?:\/\//.test(link)) return bad("link must be a url");
  if (repo && !/^https?:\/\//.test(repo)) return bad("repo must be a url");

  const imageBase64 = body.imageBase64;
  if (typeof imageBase64 !== "string" || !imageBase64) return bad("image required");
  if (imageBase64.length > MAX_BASE64) return bad("image too large", 413);
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(imageBase64)) return bad("image not base64");

  const wip = body.wip === true;
  const firstMessage = str(body.message, 200) || "started";

  try {
    // Read from the branch tip, not the bundle, so concurrent posts don't clobber.
    const items = JSON.parse(await readFile(WORK_PATH)) as WorkItem[];
    const logs = JSON.parse(await readFile(LOG_PATH)) as Record<string, PieceLog>;

    const taken = new Set<string>([
      ...items.map((i) => i.slug).filter((s): s is string => !!s),
      ...Object.keys(logs),
    ]);
    let slug = slugify(title) || "untitled";
    const base = slug;
    for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;

    const id = items.reduce((max, i) => Math.max(max, i.id), 0) + 1;
    const filename = `${today()}-${randomBytes(2).toString("hex")}.jpg`;
    const imageUrl = `/work/${slug}/${filename}`;

    const tile: WorkItem = {
      id,
      title,
      slug,
      category,
      aspect,
      bg: TILE_PALETTE[id % TILE_PALETTE.length],
      year,
      imageUrl,
      ...(overview || role ? { details: { overview, role } } : {}),
      ...(link ? { link } : {}),
      ...(repo ? { repo } : {}),
    };
    items.push(tile);

    const files = [
      { path: `public${imageUrl}`, content: imageBase64, encoding: "base64" as const },
      { path: WORK_PATH, content: JSON.stringify(items, null, 2) + "\n", encoding: "utf-8" as const },
    ];

    if (wip) {
      logs[slug] = {
        status: "wip",
        snapshots: [{ date: today(), message: firstMessage, imageUrl }],
      };
      files.push({
        path: LOG_PATH,
        content: JSON.stringify(logs, null, 2) + "\n",
        encoding: "utf-8" as const,
      });
    }

    const sha = await commitFiles(files, `work(${slug}): add ${category} — ${title}`);

    // Instagram story posting hooks in here once credentials exist.

    return NextResponse.json({ ok: true, sha: sha.slice(0, 7), slug });
  } catch (err) {
    console.error("create work failed", err);
    return bad(err instanceof Error ? err.message : "commit failed", 500);
  }
}
