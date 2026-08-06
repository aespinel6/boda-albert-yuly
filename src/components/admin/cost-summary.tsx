"use client";

import { useEffect, useMemo, useState } from "react";
import { Users2, Baby, UtensilsCrossed, Wallet } from "lucide-react";
import type { Guest } from "@/lib/types";
import { computeCost, formatCOP, type Prices } from "@/lib/pricing";
import { wedding } from "@/lib/config";

const STORAGE_KEY = "boda_prices";

export function CostSummary({ guests }: { guests: Guest[] }) {
  const [prices, setPrices] = useState<Prices>({
    adult: wedding.pricing.adult,
    child: wedding.pricing.child,
  });
  const [loaded, setLoaded] = useState(false);

  // Cargar precios guardados
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPrices({ ...prices, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Guardar al cambiar
  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(prices));
  }, [prices, loaded]);

  const cost = useMemo(() => computeCost(guests, prices), [guests, prices]);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-6 py-4">
        <h2 className="font-serif text-2xl leading-tight">Resumen de confirmados</h2>
        <p className="text-sm text-muted-foreground">
          Personas y costo estimado de comida — solo invitados que ya confirmaron.
        </p>
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-[1fr_1.2fr]">
        {/* Precios editables */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Precio por persona
          </p>
          <div className="grid grid-cols-2 gap-3">
            <PriceInput
              label="Adulto"
              Icon={Users2}
              value={prices.adult}
              onChange={(adult) => setPrices((p) => ({ ...p, adult }))}
            />
            <PriceInput
              label="Niño"
              Icon={Baby}
              value={prices.child}
              onChange={(child) => setPrices((p) => ({ ...p, child }))}
            />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Los precios se guardan en este dispositivo. Ajústalos según tu salón.
          </p>
        </div>

        {/* Totales */}
        <div className="rounded-2xl bg-gradient-to-br from-twilight to-twilight-soft p-6 text-white">
          <div className="grid grid-cols-3 gap-4 text-center">
            <Stat label="Adultos" value={cost.adults} />
            <Stat label="Niños" value={cost.children} />
            <Stat label="Personas" value={cost.people} highlight />
          </div>

          <div className="my-5 h-px bg-white/15" />

          <div className="space-y-2 text-sm text-white/80">
            <Line
              label={`${cost.adults} adultos × ${formatCOP(prices.adult)}`}
              value={formatCOP(cost.adultsCost)}
            />
            <Line
              label={`${cost.children} niños × ${formatCOP(prices.child)}`}
              value={formatCOP(cost.childrenCost)}
            />
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-4">
            <span className="flex items-center gap-2 text-sm text-white/80">
              <UtensilsCrossed className="size-4 text-gold-light" />
              Total estimado comida
            </span>
            <span className="font-serif text-3xl tabular-nums text-gold-light">
              {formatCOP(cost.total)}
            </span>
          </div>

          <p className="mt-3 flex items-center gap-1.5 text-xs text-white/50">
            <Wallet className="size-3.5" />
            Basado en {cost.guests} invitación(es) confirmada(s).
          </p>
        </div>
      </div>
    </div>
  );
}

function PriceInput({
  label,
  value,
  onChange,
  Icon,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
        <Icon className="size-4 text-gold" /> {label}
      </span>
      <div className="flex items-center rounded-lg border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
        <span className="pl-3 text-sm text-muted-foreground">$</span>
        <input
          type="number"
          min={0}
          step={1000}
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-full bg-transparent px-2 py-2 text-sm tabular-nums outline-none"
        />
      </div>
    </label>
  );
}

function Stat({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div>
      <p
        className={`font-serif text-4xl tabular-nums leading-none ${
          highlight ? "text-gold-light" : ""
        }`}
      >
        {value}
      </p>
      <p className="mt-1 text-xs uppercase tracking-wider text-white/60">{label}</p>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
