"use client";

type GazettePost = {
  id: string;
  message: string;
  createdAt: string;
  eventDate: string | null;
  author: { display_name: string; relationship: string | null } | null;
  photos: string[];
};

export function GazettePage({
  familyName,
  familyCode,
  recipientName,
  recipientTerm,
  recipientCity,
  monthLabel,
  year,
  posts,
}: {
  familyName: string;
  familyCode: string;
  recipientName: string;
  recipientTerm: string;
  recipientCity: string;
  monthLabel: string;
  year: number;
  posts: GazettePost[];
}) {
  return (
    <div className="bg-parchment print:bg-white">
      <article className="max-w-[820px] mx-auto bg-cream shadow-photo print:shadow-none paper-grain">
        {/* Masthead / portada */}
        <header className="border-b-[3px] border-inkwell p-10 text-center">
          <p className="font-body uppercase tracking-[0.3em] text-xs text-tobacco font-semibold mb-4">
            Edición de {monthLabel} · {year}
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-black leading-none mb-4">
            <span className="italic font-normal">La</span>{" "}
            <span className="font-black">{familyName}</span>
          </h1>
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="h-px w-16 bg-inkwell/40" />
            <span className="font-body italic text-tobacco">gaceta familiar</span>
            <span className="h-px w-16 bg-inkwell/40" />
          </div>
          <p className="font-body italic text-body-lg text-inkwell">
            Para {recipientTerm}{" "}
            <span className="font-display not-italic font-bold">{recipientName}</span>
            {recipientCity && <>, en {recipientCity}</>}.
          </p>
          <p className="font-body uppercase tracking-widest text-xs text-tobacco mt-6">
            Código · {familyCode}
          </p>
        </header>

        {/* Contenido */}
        {posts.length === 0 ? (
          <div className="p-16 text-center">
            <p className="font-display italic text-3xl text-tobacco mb-3">
              Aún no hay páginas para {monthLabel}.
            </p>
            <p className="font-body italic text-body text-tobacco">
              Cuando la familia publique, la gaceta se irá llenando sola.
            </p>
          </div>
        ) : (
          <div className="p-10 space-y-12">
            {posts.map((p, idx) => {
              const featured = idx === 0;
              return (
                <section
                  key={p.id}
                  className={`${idx > 0 ? "pt-10 border-t-2 border-inkwell/10" : ""}`}
                >
                  {/* Photo layout */}
                  {p.photos.length > 0 && (
                    <div
                      className={
                        featured || p.photos.length === 1
                          ? "mb-5"
                          : p.photos.length === 2
                            ? "grid grid-cols-2 gap-3 mb-5"
                            : p.photos.length === 3
                              ? "grid grid-cols-3 gap-3 mb-5"
                              : "grid grid-cols-2 md:grid-cols-4 gap-3 mb-5"
                      }
                    >
                      {featured ? (
                        <div className="space-y-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.photos[0]}
                            alt=""
                            className="w-full aspect-[16/10] object-cover border-2 border-inkwell/10"
                          />
                          {p.photos.length > 1 && (
                            <div className={`grid grid-cols-${Math.min(p.photos.length - 1, 4)} gap-3`}>
                              {p.photos.slice(1).map((u, i) => (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  key={i}
                                  src={u}
                                  alt=""
                                  className="w-full aspect-square object-cover border-2 border-inkwell/10"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        p.photos.map((u, i) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={i}
                            src={u}
                            alt=""
                            className="w-full aspect-square object-cover border-2 border-inkwell/10"
                          />
                        ))
                      )}
                    </div>
                  )}

                  {/* Byline */}
                  <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
                    <p className="font-body uppercase tracking-widest text-xs text-tobacco font-semibold">
                      Por <span className="text-inkwell">{p.author?.display_name ?? "la familia"}</span>
                      {p.author?.relationship && (
                        <span className="italic normal-case font-normal"> · {p.author.relationship}</span>
                      )}
                    </p>
                    <p className="font-body italic text-sm text-tobacco">
                      {new Date(p.eventDate || p.createdAt).toLocaleDateString("es-CO", {
                        day: "numeric",
                        month: "long",
                      })}
                    </p>
                  </div>

                  {/* Message */}
                  <p
                    className={`font-body text-inkwell whitespace-pre-wrap ${
                      featured ? "text-body-lg leading-relaxed first-letter:font-display first-letter:text-6xl first-letter:font-black first-letter:float-left first-letter:mr-2 first-letter:leading-[0.9]" : "text-body"
                    }`}
                  >
                    {p.message}
                  </p>
                </section>
              );
            })}
          </div>
        )}

        {/* Colofón */}
        <footer className="border-t-[3px] border-inkwell p-8 text-center">
          <p className="font-body italic text-sm text-tobacco">
            Hecho con cariño por la familia · I Love my abuela
          </p>
        </footer>
      </article>

      <div className="mt-8 flex justify-center print:hidden">
        <button
          onClick={() => window.print()}
          className="btn-secondary inline-flex items-center gap-2"
        >
          Imprimir o guardar PDF
        </button>
      </div>
    </div>
  );
}
