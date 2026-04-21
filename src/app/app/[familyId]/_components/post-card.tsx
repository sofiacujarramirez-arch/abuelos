"use client";

import Link from "next/link";
import { useState } from "react";
import { MoreHorizontal, Pencil } from "lucide-react";
import { DeletePostButton } from "../post/[postId]/delete-button";

type Photo = { storage_path: string; display_order: number };
type Author = { display_name: string; relationship: string | null };

export function PostCard({
  postId,
  familyId,
  message,
  createdAt,
  eventDate,
  status,
  author,
  photos,
  signedUrls,
  canEdit = false,
}: {
  postId: string;
  familyId: string;
  message: string;
  createdAt: string;
  eventDate?: string | null;
  status?: "draft" | "published" | "in_gazette" | "archived";
  author?: Author;
  photos: Photo[];
  signedUrls: Record<string, string>;
  canEdit?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

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

  const detailHref = `/app/${familyId}/post/${postId}`;

  return (
    <article className="bg-white border-2 border-inkwell/10 shadow-photo overflow-hidden relative">
      <Link href={detailHref} aria-label="Ver post" className="block">
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
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              {status === "draft" && (
                <span className="pill pop-letter text-xs">Borrador</span>
              )}
              {author && (
                <p className="font-body uppercase tracking-widest text-xs text-tobacco font-semibold">
                  {author.display_name}
                  {author.relationship && <span className="italic normal-case font-normal"> · {author.relationship}</span>}
                </p>
              )}
            </div>
          </div>
          <p className="font-body text-body text-inkwell whitespace-pre-wrap">{message}</p>
          <p className="font-body italic text-sm text-tobacco mt-4">
            {new Date(eventDate || createdAt).toLocaleDateString("es-CO", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </Link>

      {canEdit && (
        <div className="absolute top-3 right-3">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setMenuOpen((o) => !o);
            }}
            className="bg-white/90 hover:bg-white border-2 border-inkwell/10 rounded-full p-2 text-inkwell shadow-sm"
            aria-label="Más opciones"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
                aria-hidden
              />
              <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-inkwell/10 shadow-photo-lg py-2 z-50">
                <Link
                  href={`/app/${familyId}/post/${postId}/edit`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 font-body text-inkwell hover:bg-cream transition"
                >
                  <Pencil className="w-4 h-4" /> Editar
                </Link>
                <DeletePostButton familyId={familyId} postId={postId} variant="menu-item" />
              </div>
            </>
          )}
        </div>
      )}
    </article>
  );
}
