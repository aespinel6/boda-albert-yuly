import type { Guest } from "./types";

export interface Prices {
  adult: number;
  child: number;
}

export interface CostSummary {
  guests: number; // invitaciones confirmadas
  adults: number;
  children: number;
  people: number; // adultos + niños
  adultsCost: number;
  childrenCost: number;
  total: number;
}

/** Resumen de personas y costo — SOLO invitados con status "confirmed". */
export function computeCost(guests: Guest[], prices: Prices): CostSummary {
  const confirmed = guests.filter((g) => g.status === "confirmed");
  const adults = confirmed.reduce((s, g) => s + (g.adults ?? 0), 0);
  const children = confirmed.reduce((s, g) => s + (g.children ?? 0), 0);
  return {
    guests: confirmed.length,
    adults,
    children,
    people: adults + children,
    adultsCost: adults * prices.adult,
    childrenCost: children * prices.child,
    total: adults * prices.adult + children * prices.child,
  };
}

/** Formatea un número como pesos colombianos: 50000 → "$50.000". */
export function formatCOP(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value || 0);
}
