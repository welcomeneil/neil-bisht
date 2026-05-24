const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTLY_PLAYED_ENDPOINT =
  "https://api.spotify.com/v1/me/player/recently-played?limit=1";

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

export interface Track {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string | null;
  songUrl: string;
  progressMs: number;
  durationMs: number;
}

interface SpotifyArtist {
  name: string;
}

interface SpotifyTrackItem {
  name: string;
  artists: SpotifyArtist[];
  album?: { name?: string; images?: { url: string }[] };
  external_urls?: { spotify?: string };
  duration_ms?: number;
}

// Cache the access token across requests — it lives an hour, so frequent
// polling shouldn't re-mint it every time.
let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Missing Spotify credentials");
  }

  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.value;
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to refresh Spotify access token");
  }

  const data = (await res.json()) as {
    access_token: string;
    expires_in: number;
  };
  // Refresh a minute early to avoid using a token that expires mid-request.
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return data.access_token;
}

function mapTrack(
  item: SpotifyTrackItem,
  isPlaying: boolean,
  progressMs: number,
): Track {
  return {
    isPlaying,
    title: item.name,
    artist: item.artists.map((a) => a.name).join(", "),
    album: item.album?.name ?? "",
    albumImageUrl: item.album?.images?.[0]?.url ?? null,
    songUrl: item.external_urls?.spotify ?? "",
    progressMs,
    durationMs: item.duration_ms ?? 0,
  };
}

// Sticky cache of the last successful lookup. Lets us degrade gracefully
// when Spotify rate-limits (429) or briefly errors — the UI keeps showing
// the last known track instead of falling back to "nothing to show".
let lastTrack: Track | null = null;

/**
 * Returns the currently playing track, or the most recently played track
 * if nothing is playing. On transient failure (rate limit, network), falls
 * back to the last successful result. Returns null only if we've never
 * had a successful lookup.
 */
export async function getNowPlaying(): Promise<Track | null> {
  try {
    const accessToken = await getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };

    // Currently playing — 200 with a body when active, 204 when idle.
    const nowRes = await fetch(NOW_PLAYING_ENDPOINT, {
      headers,
      cache: "no-store",
    });

    if (nowRes.status === 200) {
      const data = (await nowRes.json()) as {
        item?: SpotifyTrackItem;
        is_playing?: boolean;
        currently_playing_type?: string;
        progress_ms?: number;
      };
      if (data.item && data.currently_playing_type === "track") {
        const track = mapTrack(
          data.item,
          Boolean(data.is_playing),
          data.progress_ms ?? 0,
        );
        lastTrack = track;
        return track;
      }
    }

    // Nothing playing — fall back to the most recent track.
    const recentRes = await fetch(RECENTLY_PLAYED_ENDPOINT, {
      headers,
      cache: "no-store",
    });

    if (recentRes.ok) {
      const data = (await recentRes.json()) as {
        items?: { track: SpotifyTrackItem }[];
      };
      const item = data.items?.[0]?.track;
      if (item) {
        const track = mapTrack(item, false, 0);
        lastTrack = track;
        return track;
      }
    }
  } catch {
    // Fall through to the cached value below.
  }

  // Either rate-limited, errored, or both endpoints returned empty —
  // serve the last known track if we have one.
  return lastTrack;
}
