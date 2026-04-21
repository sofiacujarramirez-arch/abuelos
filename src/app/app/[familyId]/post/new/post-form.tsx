"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { createPostAction } from "./actions";

const MIN_PHOTOS = 3;
const MAX_PHOTOS = 5;
const MAX_MB = 15;

type Preview = { file: File; url: string; width?: number; height?: number };

export function PostForm({ familyId }: { familyId: string }) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [message, setMessage] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [error, setError] = useState<string>();
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleFiles(files: FileList | null) {
    if (!files) return;
    setError(undefined);

    const remaining = MAX_PHOTOS - previews.length;
    const toAdd = Array.from(files).slice(0, remaining);
    const next: Preview[] = [];

    for (const file of toAdd) {
      if (!file.type.startsWith("image/")) {
        setError("Solo imágenes, por favor.");
        continue;
      }
      if (file.size > MAX_MB * 1024 * 1024) {
        setError(`Cada foto máximo ${MAX_MB}MB.`);
        continue;
      }
      next.push({ file, url: URL.createObjectURL(file) });
    }
    setPreviews((p) => [...p, ...next]);
    if (fileInput.current) fileInput.current.value = "";
  }

  function removePreview(idx: number) {
    setPreviews((p) => {
      URL.revokeObjectURL(p[idx].url);
      return p.filter((_, i) => i !== idx);
    });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(undefined);

    if (previews.length < MIN_PHOTOS) {
      setError(`Sube al menos ${MIN_PHOTOS} fotos.`);
      return;
    }
    if (!message.trim()) {
      setError("Escribe un mensaje para la abuela.");
      return;
    }

    setUploading(true);
    const supabase = createClient();
    const { data: userRes } = await supabase.auth.getUser();
    const userId = userRes.user?.id;
    if (!userId) {
      setError("Tu sesión expiró.");
      setUploading(false);
      return;
    }

    const uploaded: { path: string; width?: number; height?: number }[] = [];
    try {
      const timestamp = Date.now();
      for (let i = 0; i < previews.length; i++) {
        const p = previews[i];
        const ext = p.file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${familyId}/${userId}/${timestamp}-${i}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("family-photos")
          .upload(path, p.file, { contentType: p.file.type, upsert: false });
        if (upErr) throw new Error(upErr.message);
        uploaded.push({ path, width: p.width, height: p.height });
      }
    } catch (err) {
      setError(`Falló la subida: ${err instanceof Error ? err.message : "error"}`);
      setUploading(false);
      return;
    }
    setUploading(false);

    startTransition(async () => {
      const result = await createPostAction({
        familyId,
        message: message.trim(),
        photos: uploaded,
        eventDate: eventDate || null,
      });
      if (result && "error" in result) setError(result.error);
      else router.refresh();
    });
  }

  const busy = uploading || pending;
  const countOk = previews.length >= MIN_PHOTOS && previews.length <= MAX_PHOTOS;

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div>
        <div className="flex items-baseline justify-between mb-3">
          <label className="font-body text-base font-semibold text-inkwell">
            Fotos <span className="font-normal italic text-tobacco">(entre {MIN_PHOTOS} y {MAX_PHOTOS})</span>
          </label>
          <span className={`font-body text-sm italic ${countOk ? "text-garden" : "text-tobacco"}`}>
            {previews.length} / {MAX_PHOTOS}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {previews.map((p, i) => (
            <div key={p.url} className="relative aspect-square bg-cream border-2 border-inkwell/10 overflow-hidden group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removePreview(i)}
                disabled={busy}
                className="absolute top-2 right-2 bg-inkwell/80 text-parchment rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition disabled:opacity-30"
                aria-label="Quitar foto"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

          {previews.length < MAX_PHOTOS && (
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={busy}
              className="aspect-square border-2 border-dashed border-inkwell/30 hover:border-inkwell bg-white flex flex-col items-center justify-center gap-2 font-body text-tobacco hover:text-inkwell transition disabled:opacity-50"
            >
              <ImagePlus className="w-8 h-8" />
              <span className="italic text-sm">Agregar foto</span>
            </button>
          )}
        </div>

        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      <label className="block">
        <span className="font-body text-base font-semibold text-inkwell mb-2 block">
          Mensaje para la abuela
        </span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={500}
          rows={5}
          className="w-full bg-white border-2 border-inkwell/15 focus:border-inkwell px-4 py-3 font-body text-body focus:outline-none transition resize-none"
          placeholder="Abuelita, estas fotos son del cumpleaños de Mateo. Te extrañamos mucho y..."
        />
        <span className="font-body italic text-sm text-tobacco mt-1 block text-right">
          {message.length} / 500
        </span>
      </label>

      <label className="block max-w-xs">
        <span className="font-body text-base font-semibold text-inkwell mb-2 block">
          Fecha del evento <span className="font-normal italic text-tobacco">(opcional)</span>
        </span>
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          className="w-full bg-white border-2 border-inkwell/15 focus:border-inkwell px-4 py-3 font-body text-body focus:outline-none transition"
        />
      </label>

      {error && (
        <div className="bg-envelope-tint border-l-4 border-envelope p-4 font-body text-body text-envelope">
          {error}
        </div>
      )}

      <div className="flex gap-4 pt-4 border-t-2 border-inkwell/10">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={busy}
          className="btn-ghost"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={busy || !countOk || !message.trim()}
          className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {uploading && <><Loader2 className="w-4 h-4 animate-spin" /> Subiendo fotos...</>}
          {pending && <><Loader2 className="w-4 h-4 animate-spin" /> Publicando...</>}
          {!busy && "Publicar en la gaceta"}
        </button>
      </div>
    </form>
  );
}
