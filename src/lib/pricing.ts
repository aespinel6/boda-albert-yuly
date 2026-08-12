import { wedding } from "./config";
import type { Guest, PartyMember } from "./types";

export interface Prices {
  adult: number;
  child: number;
}

export interface CostSummary {
  guests: number; // invitaciones contadas
  adults: number;
  children: number;
  people: number; // adultos + niños
  adultsCost: number;
  childrenCost: number;
  total: number;
  /** Cuántos platos de cada tipo hay que preparar. */
  byMeal: Array<{ id: string; label: string; count: number; price: number; total: number }>;
}

/** Plato por defecto según sea adulto o niño. */
export function defaultMealFor(kind: PartyMember["kind"]): string {
  const m =
    wedding.meals.find((x) => x.for === kind && x.default) ??
    wedding.meals.find((x) => x.for === kind);
  return m?.id ?? "";
}

/** Precio de un plato; si el plato no existe cae al precio general. */
function mealPrice(member: PartyMember, prices: Prices): number {
  const id = member.meal || defaultMealFor(member.kind);
  const meal = wedding.meals.find((m) => m.id === id);
  if (meal) return meal.price;
  return member.kind === "child" ? prices.child : prices.adult;
}

/** Personas de una invitación que ocupan plato. */
function eaters(g: Guest, soloConfirmados: boolean): PartyMember[] {
  const party = g.party ?? [];
  // Si aún no ha respondido, se proyecta con todo el grupo invitado.
  if (g.status === "pending") return party;
  return soloConfirmados ? party.filter((m) => m.attending) : party;
}

function summarize(list: Guest[], prices: Prices): CostSummary {
  let adults = 0;
  let children = 0;
  let adultsCost = 0;
  let childrenCost = 0;
  const counts = new Map<string, number>();

  for (const g of list) {
    for (const m of eaters(g, true)) {
      const price = mealPrice(m, prices);
      const id = m.meal || defaultMealFor(m.kind);
      counts.set(id, (counts.get(id) ?? 0) + 1);
      if (m.kind === "child") {
        children++;
        childrenCost += price;
      } else {
        adults++;
        adultsCost += price;
      }
    }
  }

  const byMeal = wedding.meals
    .map((m) => {
      const count = counts.get(m.id) ?? 0;
      return { id: m.id, label: m.label, count, price: m.price, total: count * m.price };
    })
    .filter((m) => m.count > 0);

  return {
    guests: list.length,
    adults,
    children,
    people: adults + children,
    adultsCost,
    childrenCost,
    total: adultsCost + childrenCost,
    byMeal,
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

export interface TableSummary {
  name: string;
  guests: Guest[];
  people: number;
  confirmed: number;
}

/** Agrupa las invitaciones por mesa, en el orden definido en la config. */
export function groupByTable(guests: Guest[]): {
  tables: TableSummary[];
  unassigned: TableSummary;
} {
  const porMesa = new Map<string, Guest[]>();
  const sinMesa: Guest[] = [];

  for (const g of guests) {
    const t = g.table_name?.trim();
    if (!t) sinMesa.push(g);
    else porMesa.set(t, [...(porMesa.get(t) ?? []), g]);
  }

  const resumen = (name: string, list: Guest[]): TableSummary => ({
    name,
    guests: list,
    // Personas que ocuparán silla: si ya respondió, las que asisten.
    people: list.reduce(
      (n, g) =>
        n +
        (g.status === "declined" || g.status === "virtual"
          ? 0
          : eaters(g, true).length),
      0
    ),
    confirmed: list.filter((g) => g.status === "confirmed").length,
  });

  // Mesas de la config primero (aunque estén vacías), luego cualquier otra.
  const configuradas: readonly string[] = wedding.tables;
  const nombres = [
    ...configuradas,
    ...[...porMesa.keys()].filter((n) => !configuradas.includes(n)),
  ];

  return {
    tables: nombres.map((n) => resumen(n, porMesa.get(n) ?? [])),
    unassigned: resumen("Sin mesa", sinMesa),
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
