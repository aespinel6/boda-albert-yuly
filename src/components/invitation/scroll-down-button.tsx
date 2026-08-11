"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Botón que baja suavemente a la SIGUIENTE sección (la hermana en el DOM).
 * Así cada paso "para" en el siguiente al presionarlo.
 * - variant "float": fijo abajo al centro (para secciones a pantalla completa).
 * - variant "inline": en el flujo, al final del contenido (para secciones normales).
 */
export function ScrollDownButton({
  label,
  tone = "dark",
  variant = "float",
}: {
  label?: string;
  tone?: "dark" | "light" | "gold";
  variant?: "float" | "inline";
}) {
  const color =
    tone === "light"
      ? "text-white/75 hover:text-white"
      : tone === "gold"
        ? "text-gold/90 hover:text-gold"
        : "text-twilight/55 hover:text-gold";

  function go(e: React.MouseEvent<HTMLButtonElement>) {
    const section = e.currentTarget.closest("section");
    const next = section?.nextElementSibling as HTMLElement | null;
    const scroller = section?.parentElement as HTMLElement | null;
    if (!next || !scroller) return;

    // El scroll lo maneja el contenedor de pantallas (<main>).
    // El desplazamiento suave nativo se cancela con scroll-snap obligatorio,
    // así que lo animamos a mano (y desactivamos el snap mientras dura).
    const from = scroller.scrollTop;
    const to = next.offsetTop;
    if (Math.abs(to - from) < 2) return;

    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (quieto) {
      scroller.scrollTop = to;
      return;
    }

    const snapPrevio = scroller.style.scrollSnapType;
    scroller.style.scrollSnapType = "none";
    const inicio = Date.now();
    const dur = 620;

    const timer = setInterval(() => {
      const p = Math.min((Date.now() - inicio) / dur, 1);
      const suave = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      scroller.scrollTop = from + (to - from) * suave;
      if (p >= 1) {
        clearInterval(timer);
        scroller.scrollTop = to;
        scroller.style.scrollSnapType = snapPrevio;
      }
    }, 16);
  }

  return (
    <button
      type="button"
      onClick={go}
      aria-label={label || "Bajar a la siguiente sección"}
      className={cn(
        "z-20 flex flex-col items-center gap-3.5 transition-colors",
        color,
        variant === "float"
          ? "absolute bottom-[max(1.75rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2"
          : "mx-auto mt-7"
      )}
    >
      {label && (
        <span className="text-[10px] font-medium uppercase tracking-[0.3em]">
          {label}
        </span>
      )}
      <span
        className={cn(
          "flex size-10 items-center justify-center rounded-full border border-current",
          variant === "float" && "animate-bounce"
        )}
      >
        <ChevronDown className="size-5" />
      </span>
    </button>
  );
}
