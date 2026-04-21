import Image from "next/image";

export function GazetteShowcase() {
  return (
    <section id="gazette" className="bg-cream py-24 md:py-32 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="pill pop-garden mb-6">La gaceta</span>
            <h2 className="font-display text-display-lg font-black mb-6">
              <span className="italic font-normal">Un periódico</span>
              <br />
              <span className="font-black">hecho de familia.</span>
            </h2>
            <p className="font-body italic text-body-lg text-tobacco mb-6">
              Doce páginas. Letra grande, fácil de leer. Un aire cálido y de herencia —
              como los periódicos de domingo con los que creció tu abuela,
              pero esta vez, las historias son todas de los suyos.
            </p>

            <ul className="space-y-5 font-body text-body text-inkwell">
              <li className="flex gap-4">
                <span className="font-display text-2xl font-black text-envelope">·</span>
                <span>
                  <strong className="font-semibold">Portada</strong>{" "}
                  <span className="italic text-tobacco">— un retrato del mes y los titulares de la familia</span>
                </span>
              </li>
              <li className="flex gap-4">
                <span className="font-display text-2xl font-black text-envelope">·</span>
                <span>
                  <strong className="font-semibold">Páginas centrales</strong>{" "}
                  <span className="italic text-tobacco">— fotos maquetadas como un álbum de recortes, con las palabras de cada uno</span>
                </span>
              </li>
              <li className="flex gap-4">
                <span className="font-display text-2xl font-black text-envelope">·</span>
                <span>
                  <strong className="font-semibold">Calendario</strong>{" "}
                  <span className="italic text-tobacco">— cumpleaños, santos, fiestas — para que no se le olvide ningún nieto</span>
                </span>
              </li>
              <li className="flex gap-4">
                <span className="font-display text-2xl font-black text-envelope">·</span>
                <span>
                  <strong className="font-semibold">Nota escrita a mano</strong>{" "}
                  <span className="italic text-tobacco">— un mensaje personal en la contraportada, firmado por la familia</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Mock gazette */}
          <div className="relative">
            <div className="photo-print-lg tilt-right-sm bg-white p-6 md:p-8">
              <div className="nameplate-border pb-2 mb-4">
                <h3 className="masthead text-4xl md:text-5xl text-inkwell text-center leading-none">
                  La Gaceta <span className="italic font-normal">de</span> Carmen
                </h3>
                <p className="font-body italic text-xs text-tobacco text-center mt-1">
                  Mayo 2026 · Edición No. 7 · Para los suyos en Medellín
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="col-span-2 bg-gradient-to-br from-letter-tint via-gold/30 to-tobacco/40 aspect-[5/4] rounded-sm relative overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&q=80"
                    alt="Family gathering"
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                </div>
                <div className="bg-envelope-tint aspect-[5/4] rounded-sm relative overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&q=80"
                    alt="Child"
                    fill
                    className="object-cover"
                    sizes="150px"
                  />
                </div>
              </div>
              <h4 className="font-display text-xl font-bold leading-tight mb-1">
                Andrés cumplió 6 — y la casa se llenó de globos
              </h4>
              <p className="font-body italic text-sm text-tobacco leading-relaxed mb-3">
                Tu hijo le puso globos azules por toda la sala. Le mandamos un beso grande desde Miami.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-garden-tint aspect-square rounded-sm relative overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1609220136736-443140cffec6?w=300&q=80"
                    alt="Moment"
                    fill
                    className="object-cover"
                    sizes="150px"
                  />
                </div>
                <div className="bg-gold/30 aspect-square rounded-sm relative overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1541689221361-ad95003448dc?w=300&q=80"
                    alt="Moment"
                    fill
                    className="object-cover"
                    sizes="150px"
                  />
                </div>
              </div>
              <p className="font-body italic text-xs text-tobacco text-center mt-4 border-t-2 border-inkwell pt-3">
                Página 3 de 12 · Con cariño de tu familia
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
