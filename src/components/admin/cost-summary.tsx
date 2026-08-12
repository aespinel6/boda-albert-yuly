"use client";

import { useEffect, useMemo, useState } from "react";
import { Users2, Baby, UtensilsCrossed, Check } from "lucide-react";
import type { Guest } from "@/lib/types";
import {
  computeCost,
  computeProjection,
  defaultPrices,
  formatCOP,
  type CostSummary as Summary,
  type Prices,
} from "@/lib/pricing";
import { wedding } from "@/lib/config";

const STORAGE_KEY = "boda_precios_platos";

export function CostSummary({ guests }: { guests: Guest[] }) {
  const [prices, setPrices] = useState<Prices>(() => defaultPrices());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPrices({ ...defaultPrices(), ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(prices));
  }, [prices, loaded]);

  const confirmed = useMemo(() => computeCost(guests, prices), [guests, prices]);
  const projection = useMemo(() => computeProjection(guests, prices), [guests, prices]);
  const pending = projection.guests - confirmed.guests;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-6 py-4">
        <h2 className="font-serif text-2xl leading-tight">Platos y presupuesto</h2>
        <p className="text-sm text-muted-foreground">
          Estimado mientras confirman, y el total ya confirmado.
        </p>
      </div>

      <div className="space-y-6 p-6">
        {/* Precios editables */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Precio por plato
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {wedding.meals.map((m) => (
              <PriceInput
                key={m.id}
                label={m.label}
                Icon={m.for === "child" ? Baby : Users2}
                value={prices[m.id] ?? m.price}
                onChange={(v) => setPrices((p) => ({ ...p, [m.id]: v }))}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPrices(defaultPrices())}
            className="mt-2 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Restablecer precios
          </button>
        </div>

        {/* Dos escenarios */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Estimado total (proyección) */}
          <ResultCard
            variant="projection"
            title="Estimado total"
            subtitle={`Si asisten todos los invitados (${projection.guests})`}
            data={projection}
            prices={prices}
            footer={
              pending > 0
                ? `${pending} invitación(es) por confirmar`
                : "Todos han respondido"
            }
          />
          {/* Confirmado */}
          <ResultCard
            variant="confirmed"
            title="Confirmado"
            subtitle={`Invitados que ya dijeron sí (${confirmed.guests})`}
            data={confirmed}
            prices={prices}
            footer="ya confirmados"
          />
        </div>
      </div>
    </div>
  );
}

function ResultCard({
  variant,
  title,
  subtitle,
  data,
  prices,
  footer,
}: {
  variant: "projection" | "confirmed";
  title: string;
  subtitle: string;
  data: Summary;
  prices: Prices;
  footer: string;
}) {
  const projection = variant === "projection";
  return (
    <div
      className={
        projection
          ? "rounded-2xl bg-gradient-to-br from-twilight to-twilight-soft p-6 text-white"
          : "rounded-2xl border border-border bg-background p-6 text-foreground"
      }
    >
      <div className="flex items-center gap-2">
        {projection ? (
          <UtensilsCrossed className="size-4 text-gold-light" />
        ) : (
          <Check className="size-4 text-emerald-600" />
        )}
        <span className="text-xs font-semibold uppercase tracking-wider">{title}</span>
      </div>
      <p className={projection ? "mt-0.5 text-xs text-white/60" : "mt-0.5 text-xs text-muted-foreground"}>
        {subtitle}
      </p>

      <div className="mt-4 flex items-end gap-2">
        <span className="font-serif text-5xl tabular-nums leading-none">
          {data.people}
        </span>
        <span className={projection ? "mb-1 text-sm text-white/70" : "mb-1 text-sm text-muted-foreground"}>
          platos
        </span>
      </div>
      <p className={projection ? "mt-1 text-sm text-white/75" : "mt-1 text-sm text-muted-foreground"}>
        {data.adults} adultos · {data.children} niños
      </p>

      <div
        className={
          projection
            ? "mt-4 flex items-center justify-between border-t border-white/15 pt-3"
            : "mt-4 flex items-center justify-between border-t border-border pt-3"
        }
      >
        <span className={projection ? "text-sm text-white/80" : "text-sm text-muted-foreground"}>
          Total comida
        </span>
        <span
          className={
            projection
              ? "font-serif text-2xl tabular-nums text-gold-light"
              : "font-serif text-2xl tabular-nums text-foreground"
          }
        >
          {formatCOP(data.total)}
        </span>
      </div>

      {/* Desglose por tipo de plato */}
      {data.byMeal.length > 0 && (
        <ul
          className={
            projection
              ? "mt-3 space-y-1 border-t border-white/15 pt-3 text-xs text-white/75"
              : "mt-3 space-y-1 border-t border-border pt-3 text-xs text-muted-foreground"
          }
        >
          {data.byMeal.map((m) => (
            <li key={m.id} className="flex items-center justify-between gap-3">
              <span className="min-w-0 truncate">
                {m.count} × {m.label}
              </span>
              <span className="flex-none tabular-nums">{formatCOP(m.total)}</span>
            </li>
          ))}
        </ul>
      )}

      <p className={projection ? "mt-2 text-xs text-white/50" : "mt-2 text-xs text-muted-foreground"}>
        {footer}
      </p>
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
