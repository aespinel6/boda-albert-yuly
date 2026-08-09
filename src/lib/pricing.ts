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

function summarize(list: Guest[], prices: Prices): CostSummary {
  const adults = list.reduce((s, g) => s + (g.adults ?? 0), 0);
  const children = list.reduce((s, g) => s + (g.children ?? 0), 0);
  return {
    guests: list.length,
    adults,
    children,
    people: adults + children,
    adultsCost: adults * prices.adult,
    childrenCost: children * prices.child,
    total: adults * prices.adult + children * prices.child,
  };
}

/** Resumen de personas y costo — SOLO invitados con status "confirmed". */
export function computeCost(guests: Guest[], prices: Prices): CostSummary {
  return summarize(
    guests.filter((g) => g.status === "confirmed"),
    prices
  );
}

/**
 * Proyección de platos: todos menos los que no asisten y los virtuales
 * (los virtuales cuentan como invitados, pero no ocupan plato).
 */
export function computeProjection(guests: Guest[], prices: Prices): CostSummary {
  return summarize(
    guests.filter((g) => g.status !== "declined" && g.status !== "virtual"),
    prices
  );
}

/** Formatea un número como pesos colombianos: 50000 → "$50.000". */
export function formatCOP(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value || 0);
}
