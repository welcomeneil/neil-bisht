const API = "https://api.github.com";

function repo(): string {
  const r = process.env.GITHUB_REPO;
  if (!r) throw new Error("GITHUB_REPO is not set");
  return r;
}

function branch(): string {
  return process.env.GITHUB_BRANCH || "main";
}

async function gh<T>(path: string, init?: RequestInit): Promise<T> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is not set");

  const res = await fetch(`${API}/repos/${repo()}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub ${init?.method ?? "GET"} ${path} → ${res.status}: ${body.slice(0, 300)}`);
  }
  return res.json() as Promise<T>;
}

/** Reads a file from the tip of the branch, not from this deployment's bundle. */
export async function readFile(path: string): Promise<string> {
  const data = await gh<{ content: string; encoding: string }>(
    `/contents/${path}?ref=${branch()}`,
  );
  if (data.encoding !== "base64") throw new Error(`unexpected encoding: ${data.encoding}`);
  return Buffer.from(data.content, "base64").toString("utf-8");
}

export interface FileWrite {
  path: string;
  content: string;
  encoding: "utf-8" | "base64";
}

/**
 * Writes every file in one commit via the Git Data API. The Contents API would
 * need a commit per file, and each commit triggers its own Vercel deploy.
 */
export async function commitFiles(files: FileWrite[], message: string): Promise<string> {
  const ref = await gh<{ object: { sha: string } }>(`/git/ref/heads/${branch()}`);
  const parentSha = ref.object.sha;

  const parent = await gh<{ tree: { sha: string } }>(`/git/commits/${parentSha}`);

  const blobs = await Promise.all(
    files.map((f) =>
      gh<{ sha: string }>("/git/blobs", {
        method: "POST",
        body: JSON.stringify({ content: f.content, encoding: f.encoding }),
      }),
    ),
  );

  const tree = await gh<{ sha: string }>("/git/trees", {
    method: "POST",
    body: JSON.stringify({
      base_tree: parent.tree.sha,
      tree: files.map((f, i) => ({
        path: f.path,
        mode: "100644",
        type: "blob",
        sha: blobs[i].sha,
      })),
    }),
  });

  const commit = await gh<{ sha: string }>("/git/commits", {
    method: "POST",
    body: JSON.stringify({ message, tree: tree.sha, parents: [parentSha] }),
  });

  // Non-forced: fails if someone pushed since we read the ref, rather than
  // silently dropping their commit.
  await gh(`/git/refs/heads/${branch()}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha, force: false }),
  });

  return commit.sha;
}
