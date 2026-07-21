"use client";

import { useEffect, useRef, useState } from "react";

const MAX_EDGE = 2000;
const QUALITY = 0.85;
const PASSWORD_KEY = "snapshot-password";

type Aspect = "portrait" | "landscape" | "square";
type Mode = "snapshot" | "work";

const CATEGORIES = ["drawings", "tattoos", "software", "design", "client work"] as const;

async function loadImage(file: File): Promise<ImageBitmap | HTMLImageElement> {
  try {
    return await createImageBitmap(file);
  } catch {
    // Safari can fail createImageBitmap on HEIC but still decode it in an <img>.
    const img = new Image();
    img.src = URL.createObjectURL(file);
    await img.decode();
    return img;
  }
}

/** Re-encodes a phone photo down to a committable JPEG; also reports its aspect. */
async function compress(file: File): Promise<{ base64: string; aspect: Aspect }> {
  const src = await loadImage(file);
  const w = "naturalWidth" in src ? src.naturalWidth : src.width;
  const h = "naturalHeight" in src ? src.naturalHeight : src.height;

  const scale = Math.min(1, MAX_EDGE / Math.max(w, h));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no canvas context");
  ctx.drawImage(src, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", QUALITY),
  );
  if (!blob) throw new Error("could not encode image");

  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }

  const ratio = w / h;
  const aspect: Aspect = ratio > 1.15 ? "landscape" : ratio < 0.87 ? "portrait" : "square";
  return { base64: btoa(binary), aspect };
}

function todayLocal(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

type Status =
  | { kind: "idle" }
  | { kind: "working"; text: string }
  | { kind: "done"; sha: string }
  | { kind: "error"; text: string };

const inputClass =
  "w-full bg-transparent border border-warm-border px-3 py-2.5 font-sans text-[14px] text-foreground placeholder:text-muted focus:border-foreground focus:outline-none transition-colors duration-200";
const labelClass =
  "font-sans text-[11px] tracking-[0.15em] uppercase text-muted mb-2 block";

export default function AdminForm({
  pieces,
}: {
  pieces: { slug: string; title: string }[];
}) {
  const [mode, setMode] = useState<Mode>("snapshot");
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const formRef = useRef<HTMLFormElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Uncontrolled defaults depend on the browser clock / storage, so set them
  // after mount rather than prefilling into the prerendered HTML.
  useEffect(() => {
    if (dateRef.current && !dateRef.current.value) dateRef.current.value = todayLocal();
    if (yearRef.current && !yearRef.current.value) {
      yearRef.current.value = String(new Date().getFullYear());
    }
    const saved = localStorage.getItem(PASSWORD_KEY);
    if (saved && passwordRef.current) passwordRef.current.value = saved;
  }, []);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return file ? URL.createObjectURL(file) : null;
    });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const file = form.get("photo");

    if (!(file instanceof File) || file.size === 0) {
      setStatus({ kind: "error", text: "pick a photo" });
      return;
    }
    const password = String(form.get("password") ?? "");

    try {
      setStatus({ kind: "working", text: "compressing…" });
      const { base64, aspect } = await compress(file);

      setStatus({ kind: "working", text: "committing…" });
      const endpoint = mode === "work" ? "/api/work" : "/api/snapshots";
      const payload =
        mode === "work"
          ? {
              password,
              category: form.get("category"),
              title: form.get("title"),
              year: form.get("year"),
              overview: form.get("overview"),
              role: form.get("role"),
              link: form.get("link"),
              repo: form.get("repo"),
              wip: form.get("wip") === "on",
              aspect,
              imageBase64: base64,
            }
          : {
              password,
              slug: form.get("slug"),
              date: form.get("date"),
              message: form.get("message"),
              note: form.get("note"),
              markDone: form.get("markDone") === "on",
              imageBase64: base64,
            };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "upload failed");

      localStorage.setItem(PASSWORD_KEY, password);
      setStatus({ kind: "done", sha: data.sha });
      setPreview((old) => {
        if (old) URL.revokeObjectURL(old);
        return null;
      });
      formRef.current?.reset();
      if (dateRef.current) dateRef.current.value = todayLocal();
      if (yearRef.current) yearRef.current.value = String(new Date().getFullYear());
      if (passwordRef.current) passwordRef.current.value = password;
    } catch (err) {
      setStatus({
        kind: "error",
        text: err instanceof Error ? err.message : "upload failed",
      });
    }
  }

  const busy = status.kind === "working";

  const tab = (m: Mode, label: string) => (
    <button
      type="button"
      onClick={() => {
        setMode(m);
        setStatus({ kind: "idle" });
      }}
      className={`font-sans text-[11px] tracking-wide px-4 py-1.5 border transition-all duration-200 ${
        mode === m
          ? "border-foreground text-foreground"
          : "border-warm-border text-muted hover:border-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );

  return (
    <main className="min-h-screen pt-0 md:pt-16">
      <div className="max-w-lg mx-auto px-8 md:px-12">
        <section className="pt-10 md:pt-28 pb-6">
          <h1 className="font-sans text-[clamp(32px,5vw,48px)] font-light tracking-tight leading-tight text-foreground">
            {mode === "work" ? "new work" : "new snapshot"}
          </h1>
        </section>

        <div className="flex gap-1 pb-8">
          {tab("snapshot", "add snapshot")}
          {tab("work", "new tile")}
        </div>

        <div className="border-t border-warm-border mb-8" />

        <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-7 pb-24">
          {mode === "work" && (
            <>
              <div>
                <label htmlFor="category" className={labelClass}>
                  Category
                </label>
                <select id="category" name="category" required className={inputClass}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="title" className={labelClass}>
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  maxLength={80}
                  placeholder="tonal study III"
                  className={inputClass}
                />
              </div>
            </>
          )}

          {mode === "snapshot" && (
            <div>
              <label htmlFor="slug" className={labelClass}>
                Piece
              </label>
              <select id="slug" name="slug" required className={inputClass}>
                {pieces.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="photo" className={labelClass}>
              Photo
            </label>
            <input
              id="photo"
              name="photo"
              type="file"
              accept="image/*"
              required
              onChange={onPickFile}
              className="w-full font-sans text-[13px] text-muted file:mr-4 file:border file:border-warm-border file:bg-transparent file:px-4 file:py-2 file:font-sans file:text-[11px] file:uppercase file:tracking-[0.12em] file:text-foreground"
            />
            {preview && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={preview}
                alt="selected"
                className="mt-4 w-full object-contain max-h-72 border border-warm-border"
              />
            )}
          </div>

          {mode === "snapshot" && (
            <>
              <div>
                <label htmlFor="message" className={labelClass}>
                  What changed
                </label>
                <input
                  id="message"
                  name="message"
                  type="text"
                  required
                  maxLength={200}
                  placeholder="pushed the darks under the plume"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="note" className={labelClass}>
                  Note (optional)
                </label>
                <textarea id="note" name="note" rows={3} className={`${inputClass} resize-none`} />
              </div>
              <div>
                <label htmlFor="date" className={labelClass}>
                  Date
                </label>
                <input ref={dateRef} id="date" name="date" type="date" required className={inputClass} />
              </div>
              <label className="flex items-center gap-3 font-sans text-[13px] text-foreground">
                <input type="checkbox" name="markDone" className="accent-accent" />
                mark this piece finished
              </label>
            </>
          )}

          {mode === "work" && (
            <>
              <div>
                <label htmlFor="year" className={labelClass}>
                  Year
                </label>
                <input ref={yearRef} id="year" name="year" type="text" inputMode="numeric" maxLength={4} className={inputClass} />
              </div>
              <div>
                <label htmlFor="overview" className={labelClass}>
                  Overview (optional)
                </label>
                <input
                  id="overview"
                  name="overview"
                  type="text"
                  maxLength={600}
                  placeholder="one line — what it is"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="role" className={labelClass}>
                  Notes / intent (optional)
                </label>
                <textarea id="role" name="role" rows={4} maxLength={1200} className={`${inputClass} resize-none`} />
              </div>
              <div>
                <label htmlFor="link" className={labelClass}>
                  Link (optional)
                </label>
                <input id="link" name="link" type="url" placeholder="https://…" className={inputClass} />
              </div>
              <div>
                <label htmlFor="repo" className={labelClass}>
                  Repo (optional)
                </label>
                <input id="repo" name="repo" type="url" placeholder="https://github.com/…" className={inputClass} />
              </div>
              <label className="flex items-center gap-3 font-sans text-[13px] text-foreground">
                <input type="checkbox" name="wip" className="accent-accent" />
                work in progress — start a snapshot log
              </label>
            </>
          )}

          <div>
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <input
              ref={passwordRef}
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="border border-foreground text-foreground font-sans text-[11px] tracking-[0.15em] uppercase py-3.5 hover:bg-foreground hover:text-background transition-colors duration-200 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-foreground"
          >
            {busy ? status.text : mode === "work" ? "create tile" : "commit snapshot"}
          </button>

          {status.kind === "done" && (
            <p className="font-sans text-[12px] tracking-wide text-accent">
              committed {status.sha} — deploying now.
            </p>
          )}
          {status.kind === "error" && (
            <p className="font-sans text-[12px] tracking-wide text-foreground border-l-2 border-foreground pl-3">
              {status.text}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
