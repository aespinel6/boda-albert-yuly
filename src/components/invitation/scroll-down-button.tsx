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
    next?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <button
      type="button"
      onClick={go}
      aria-label={label || "Bajar a la siguiente sección"}
      className={cn(
        "z-20 flex flex-col items-center gap-2 transition-colors",
        color,
        variant === "float"
          ? "absolute bottom-7 left-1/2 -translate-x-1/2"
          : "mx-auto mt-6"
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
