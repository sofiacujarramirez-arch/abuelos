import Link from "next/link";
import { Newspaper } from "lucide-react";

const MONTHS_ES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

type Edition = {
  id: string;
  period_start: string;
  public_slug: string | null;
};

export function GazetteArchive({
  familyId,
  editions,
  currentMonth,
  currentYear,
}: {
  familyId: string;
  editions: Edition[];
  currentMonth: number;
  currentYear: number;
}) {
  const past = editions
    .map((e) => {
      const d = new Date(e.period_start);
      return { ...e, month: d.getUTCMonth() + 1, year: d.getUTCFullYear() };
    })
    .filter((e) => !(e.month === currentMonth && e.year === currentYear))
    .sort((a, b) => b.period_start.localeCompare(a.period_start));

  if (past.length === 0) return null;

  return (
    <div>
      <h3 className="font-display text-2xl font-bold mb-4">
        <span className="italic font-normal">Ediciones</span> anteriores
      </h3>
      <ul className="space-y-2">
        {past.slice(0, 6).map((e) => (
          <li key={e.id}>
            <Link
              href={`/app/${familyId}/gaceta?month=${e.month}&year=${e.year}`}
              className="flex items-center gap-3 bg-white border-2 border-inkwell/10 hover:border-inkwell p-3 transition group"
            >
              <Newspaper className="w-4 h-4 text-tobacco group-hover:text-inkwell" />
              <span className="font-body text-inkwell capitalize">
                {MONTHS_ES[e.month - 1]} {e.year}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
