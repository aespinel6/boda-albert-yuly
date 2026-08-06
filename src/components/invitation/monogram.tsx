import { cn } from "@/lib/utils";

/**
 * Monograma A & Y — Variante 1 (iniciales con línea de horizonte).
 * Se usa como logo en la portada y en el cierre.
 */
export function Monogram({
  className,
  showDate = false,
  tone = "light",
}: {
  className?: string;
  showDate?: boolean;
  tone?: "light" | "dark";
}) {
  const ink = tone === "light" ? "text-white" : "text-twilight";
  const sub = tone === "light" ? "text-white/70" : "text-twilight/60";

  return (
    <div className={cn("inline-flex flex-col items-center", className)}>
      <div className={cn("font-serif leading-none tracking-wide", ink)}>
        <span className="text-4xl sm:text-5xl">A</span>
        <span className="mx-1 align-middle text-2xl italic text-gold-soft sm:text-3xl">
          &amp;
        </span>
        <span className="text-4xl italic sm:text-5xl">Y</span>
      </div>
      <span className="mt-2 h-px w-24 bg-gold-soft/70" aria-hidden />
      {showDate && (
        <span
          className={cn(
            "mt-2 text-[10px] uppercase tracking-[0.34em]",
            sub
          )}
        >
          26 · 09 · 2026
        </span>
      )}
    </div>
  );
}
