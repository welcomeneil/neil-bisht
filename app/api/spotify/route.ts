import { NextResponse } from "next/server";
import { getNowPlaying } from "@/lib/spotify";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const track = await getNowPlaying();
    // fetchedAt lets the client tick progress forward locally between polls.
    return NextResponse.json(
      { ...(track ?? { isPlaying: false }), fetchedAt: Date.now() },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  }
}
