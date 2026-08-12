import { wedding } from "./config";
import type { Guest, PartyMember } from "./types";

/** Precio por tipo de plato: { adulto: 65000, a: 50000, nino: 30000 } */
export type Prices = Record<string, number>;

/** Precios de partida (los de la config), listos para editar en el panel. */
export function defaultPrices(): Prices {
  return Object.fromEntries(wedding.meals.map((m) => [m.id, m.price]));
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

/** Precio del plato de una persona (el editado en el panel, o el de la config). */
function mealPrice(member: PartyMember, prices: Prices): number {
  const id = member.meal || defaultMealFor(member.kind);
  const editado = prices[id];
  if (typeof editado === "number" && editado >= 0) return editado;
  return wedding.meals.find((m) => m.id === id)?.price ?? 0;
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
      const price = typeof prices[m.id] === "number" ? prices[m.id] : m.price;
      return { id: m.id, label: m.label, count, price, total: count * price };
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
  /** Puestos totales de la mesa. */
  seats: number;
  /** Puestos libres (nunca negativo). */
  free: number;
  /** Se pasó del cupo. */
  over: boolean;
  /** Mesa sin sillas: los que nos ven en línea. */
  isVirtual: boolean;
}

/** Personas de una invitación que se conectan (no ocupan silla ni plato). */
export function onlineCountOf(g: Guest): number {
  if (g.status !== "virtual") return 0;
  const party = g.party ?? [];
  return party.filter((m) => m.attending).length || party.length;
}

/** Cuántas sillas ocupa una invitación (los virtuales y ausentes no ocupan). */
export function seatsUsedBy(g: Guest): number {
  if (g.status === "declined" || g.status === "virtual") return 0;
  return eaters(g, true).length;
}

/** Capacidad por mesa: la de la config, salvo que el panel la haya cambiado. */
export type Capacities = Record<string, number>;

export function seatsOf(name: string, capacities?: Capacities): number {
  const custom = capacities?.[name];
  if (typeof custom === "number" && custom > 0) return custom;
  return wedding.tables.find((t) => t.name === name)?.seats ?? 6;
}

/** Agrupa las invitaciones por mesa, en el orden definido en la config. */
export function groupByTable(
  guests: Guest[],
  capacities?: Capacities
): {
  tables: TableSummary[];
  unassigned: Omit<TableSummary, "seats" | "free" | "over" | "isVirtual">;
} {
  const porMesa = new Map<string, Guest[]>();
  const sinMesa: Guest[] = [];

  for (const g of guests) {
    const t = g.table_name?.trim();
    if (!t) sinMesa.push(g);
    else porMesa.set(t, [...(porMesa.get(t) ?? []), g]);
  }

  const personas = (list: Guest[]) =>
    list.reduce((n, g) => n + seatsUsedBy(g), 0);

  // Mesas de la config, luego cualquier otra, y de última la mesa virtual.
  const configuradas: string[] = wedding.tables.map((t) => t.name);
  const virtual = wedding.virtualTable;
  const nombres = [
    ...configuradas,
    ...[...porMesa.keys()].filter(
      (n) => !configuradas.includes(n) && n !== virtual
    ),
    virtual,
  ];

  return {
    tables: nombres.map((name) => {
      const list = porMesa.get(name) ?? [];
      const isVirtual = name === virtual;
      // La mesa virtual no tiene sillas: cuenta a quienes se conectan.
      const people = isVirtual
        ? list.reduce((n, g) => n + (onlineCountOf(g) || seatsUsedBy(g)), 0)
        : personas(list);
      const seats = isVirtual ? 0 : seatsOf(name, capacities);
      return {
        name,
        guests: list,
        people,
        confirmed: list.filter((g) => g.status === "confirmed").length,
        seats,
        free: isVirtual ? Number.MAX_SAFE_INTEGER : Math.max(0, seats - people),
        over: isVirtual ? false : people > seats,
        isVirtual,
      };
    }),
    unassigned: {
      name: "Sin mesa",
      guests: sinMesa,
      people: personas(sinMesa),
      confirmed: sinMesa.filter((g) => g.status === "confirmed").length,
    },
  };
}

/**
 * Distribuye automáticamente las invitaciones sin mesa.
 * Mantiene juntos a los grupos (una invitación nunca se parte) y prefiere
 * mesas donde ya hay gente del mismo grupo (familia, amigos…).
 */
export function autoAssign(
  guests: Guest[],
  capacities?: Capacities
): Record<string, string> {
  const { tables, unassigned } = groupByTable(guests, capacities);
  const libre = new Map(tables.map((t) => [t.name, t.free]));
  const grupos = new Map(
    tables.map((t) => [t.name, new Set(t.guests.map((g) => g.group))])
  );

  const asignaciones: Record<string, string> = {};

  // Los que nos ven en línea van a la mesa virtual (no ocupan silla).
  for (const g of unassigned.guests) {
    if (g.status === "virtual") asignaciones[g.id] = wedding.virtualTable;
  }

  // Los grupos grandes primero: encajan mejor (bin packing "first fit decreasing").
  const pendientes = unassigned.guests
    .filter((g) => g.status !== "virtual" && seatsUsedBy(g) > 0)
    .sort((a, b) => seatsUsedBy(b) - seatsUsedBy(a));

  for (const g of pendientes) {
    const necesita = seatsUsedBy(g);
    const candidatas = tables
      .filter((t) => !t.isVirtual) // la mesa virtual no tiene sillas
      .map((t) => t.name)
      .filter((n) => (libre.get(n) ?? 0) >= necesita);
    if (candidatas.length === 0) continue; // no cabe en ninguna mesa

    // Las mesas se llenan en orden (Mesa principal, Mesa 1, Mesa 2…), pero si
    // ya hay gente del mismo grupo en alguna con espacio, se sienta con ellos.
    const conSuGente = candidatas.find((n) => grupos.get(n)?.has(g.group));
    const elegida = conSuGente ?? candidatas[0];

    asignaciones[g.id] = elegida;
    libre.set(elegida, (libre.get(elegida) ?? 0) - necesita);
    grupos.get(elegida)?.add(g.group);
  }

  return asignaciones;
}

/** Formatea un número como pesos colombianos: 50000 → "$50.000". */
export function formatCOP(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value || 0);
}
