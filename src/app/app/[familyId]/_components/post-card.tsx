import Image from "next/image";

type Photo = { storage_path: string; display_order: number };
type Author = { display_name: string; relationship: string | null };

export function PostCard({
  message,
  createdAt,
  eventDate,
  author,
  photos,
  signedUrls,
}: {
  message: string;
  createdAt: string;
  eventDate?: string | null;
  author?: Author;
  photos: Photo[];
  signedUrls: Record<string, string>;
}) {
  const sorted = [...photos].sort((a, b) => a.display_order - b.display_order);
  const urls = sorted
    .map((p) => signedUrls[p.storage_path])
    .filter((u): u is string => !!u);

  const gridClass =
    urls.length === 1
      ? "grid-cols-1"
      : urls.length === 2
        ? "grid-cols-2"
        : urls.length === 3
          ? "grid-cols-3"
          : "grid-cols-2 md:grid-cols-4";

  return (
    <article className="bg-white border-2 border-inkwell/10 shadow-photo overflow-hidden">
      {urls.length > 0 && (
        <div className={`grid ${gridClass} gap-0.5 bg-inkwell/10`}>
          {urls.map((u, i) => (
            <div
              key={i}
              className={`relative bg-cream ${urls.length === 1 ? "aspect-[4/3]" : "aspect-square"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      <div className="p-6">
        {author && (
          <p className="font-body uppercase tracking-widest text-xs text-tobacco font-semibold mb-3">
            {author.display_name}
            {author.relationship && <span className="italic normal-case font-normal"> · {author.relationship}</span>}
          </p>
        )}
        <p className="font-body text-body text-inkwell whitespace-pre-wrap">{message}</p>
        <p className="font-body italic text-sm text-tobacco mt-4">
          {new Date(eventDate || createdAt).toLocaleDateString("es-CO", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
    </article>
  );
}
