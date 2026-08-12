"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  Armchair, Users2, Baby, AlertTriangle, Wand2, Eraser, Loader2, Lock, Video,
} from "lucide-react";
import type { Guest } from "@/lib/types";
import { wedding } from "@/lib/config";
import { groupByTable, seatsOf, seatsUsedBy, type Capacities } from "@/lib/pricing";
import {
  setGuestTable,
  autoAssignTables,
  clearAllTables,
  setMemberMeal,
  setTableMeal,
} from "@/app/actions/admin";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "boda_table_seats";

/** Distribución del salón: quién se sienta en cada mesa y cuántos puestos quedan. */
export function TablesBoard({ guests }: { guests: Guest[] }) {
  const [pending, startTransition] = useTransition();
  const [aviso, setAviso] = useState<string | null>(null);

  // Capacidad por mesa (editable, se guarda en este dispositivo)
  const [caps, setCaps] = useState<Capacities>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCaps(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(caps));
  }, [caps, loaded]);

  const { tables, unassigned } = useMemo(
    () => groupByTable(guests, caps),
    [guests, caps]
  );

  const reales = tables.filter((t) => !t.isVirtual);
  const sentados = reales.reduce((n, t) => n + t.people, 0);
  const puestos = reales.reduce((n, t) => n + t.seats, 0);
  const enLinea = tables.find((t) => t.isVirtual)?.people ?? 0;

  function asignar(id: string, mesa: string) {
    setAviso(null);
    startTransition(() => {
      setGuestTable(id, mesa);
    });
  }

  function distribuir() {
    setAviso(null);
    startTransition(async () => {
      const r = await autoAssignTables(caps);
      setAviso(
        r.sinCupo > 0
          ? `Ubicadas ${r.asignados} invitaciones. ${r.sinCupo} no cupieron: amplía alguna mesa.`
          : `Listo: ${r.asignados} invitaciones ubicadas.`
      );
    });
  }

  function limpiar() {
    setAviso(null);
    startTransition(async () => {
      await clearAllTables();
    });
  }

  /** Mesas donde cabe este grupo (para no sobrepasar el cupo). */
  const opcionesPara = (g: Guest, actual?: string) => {
    const necesita = seatsUsedBy(g);
    return tables.map((t) => ({
      name: t.name,
      // La mesa actual siempre se puede mantener; la virtual nunca se llena.
      full: !t.isVirtual && t.name !== actual && t.free < necesita,
      free: t.free,
      isVirtual: t.isVirtual,
    }));
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border px-6 py-4">
        <div>
          <h2 className="font-serif text-2xl leading-tight">Mesas del salón</h2>
          <p className="text-sm text-muted-foreground">
            {sentados} de {puestos} puestos ocupados
            {enLinea > 0 && ` · ${enLinea} en línea`} · {unassigned.people} personas por
            ubicar
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="gold" size="sm" onClick={distribuir} disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
            Distribuir automáticamente
          </Button>
          <Button variant="outline" size="sm" onClick={limpiar} disabled={pending}>
            <Eraser className="size-4" /> Vaciar
          </Button>
        </div>
      </div>

      {aviso && (
        <p className="border-b border-border bg-gold/10 px-6 py-2.5 text-sm text-foreground">
          {aviso}
        </p>
      )}

      {/* Sin asignar */}
      {unassigned.guests.length > 0 && (
        <div className="border-b border-border bg-gold/5 px-6 py-4">
          <p className="flex items-center gap-2 text-sm font-medium text-foreground">
            <AlertTriangle className="size-4 text-gold" />
            Sin mesa ({unassigned.guests.length} invitaciones · {unassigned.people} personas)
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {unassigned.guests.map((g) => (
              <div
                key={g.id}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5"
              >
                <span className="text-sm">{g.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({seatsUsedBy(g)})
                </span>
                <select
                  value=""
                  disabled={pending}
                  onChange={(e) => asignar(g.id, e.target.value)}
                  className="h-7 rounded border border-input bg-background px-1 text-xs"
                  aria-label={`Asignar mesa a ${g.name}`}
                >
                  <option value="">Asignar…</option>
                  {opcionesPara(g).map((t) => (
                    <option key={t.name} value={t.name} disabled={t.full}>
                      {t.name}{" "}
                      {t.isVirtual
                        ? "· en línea"
                        : t.full
                          ? "(llena)"
                          : `· ${t.free} libres`}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mesas */}
      <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
        {tables.map((t) => {
          const llena = !t.isVirtual && t.free === 0 && !t.over;
          return (
            <div
              key={t.name}
              className={`rounded-xl border p-4 ${
                t.isVirtual
                  ? "border-mirror/40 bg-mirror/5"
                  : t.over
                    ? "border-destructive/40 bg-destructive/5"
                    : llena
                      ? "border-emerald-500/40 bg-emerald-500/5"
                      : "border-border bg-background"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-sm font-semibold">
                  {t.isVirtual ? (
                    <Video className="size-4 text-mirror" />
                  ) : (
                    <Armchair className="size-4 text-gold" />
                  )}
                  {t.name}
                </span>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-sm tabular-nums ${
                      t.isVirtual
                        ? "text-mirror"
                        : t.over
                          ? "font-semibold text-destructive"
                          : llena
                            ? "font-medium text-emerald-600"
                            : "text-muted-foreground"
                    }`}
                  >
                    {t.isVirtual ? `${t.people} en línea` : `${t.people}/${t.seats}`}
                  </span>
                  {!t.isVirtual && (
                    <select
                      value={seatsOf(t.name, caps)}
                      onChange={(e) =>
                        setCaps((c) => ({ ...c, [t.name]: Number(e.target.value) }))
                      }
                      className="h-6 rounded border border-input bg-background px-1 text-[11px] text-muted-foreground"
                      aria-label={`Puestos de ${t.name}`}
                      title="Puestos de la mesa"
                    >
                      {wedding.seatOptions.map((n) => (
                        <option key={n} value={n}>
                          {n} p.
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Plato para toda la mesa (los niños conservan el suyo) */}
              {t.guests.length > 0 && !t.isVirtual && (
                <label className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  Plato de la mesa
                  <select
                    value=""
                    disabled={pending}
                    onChange={(e) => {
                      const meal = e.target.value;
                      if (!meal) return;
                      startTransition(() => {
                        setTableMeal(t.name, meal);
                      });
                    }}
                    className="h-6 flex-1 rounded border border-input bg-background px-1 text-[10px]"
                    aria-label={`Poner el mismo plato a toda la ${t.name}`}
                  >
                    <option value="">Aplicar a todos…</option>
                    {wedding.meals
                      .filter((m) => m.for === "adult")
                      .map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.label}
                        </option>
                      ))}
                  </select>
                </label>
              )}

              {t.guests.length === 0 ? (
                <p className="mt-3 text-xs text-muted-foreground">Mesa vacía</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {t.guests.map((g) => (
                    <li key={g.id} className="rounded-lg bg-muted/40 p-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="min-w-0 flex-1 truncate font-medium">
                          {g.name}
                        </span>
                        <select
                          value={t.name}
                          disabled={pending}
                          onChange={(e) => asignar(g.id, e.target.value)}
                          className="h-6 max-w-[70px] flex-none rounded border border-input bg-background text-[10px] text-muted-foreground"
                          aria-label={`Cambiar mesa de ${g.name}`}
                          title="Cambiar de mesa"
                        >
                          <option value="">Sin mesa</option>
                          {opcionesPara(g, t.name).map((o) => (
                            <option key={o.name} value={o.name} disabled={o.full}>
                              {o.name}{" "}
                              {o.isVirtual
                                ? "· en línea"
                                : o.full
                                  ? "(llena)"
                                  : `· ${o.free} libres`}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Plato de cada persona (los de en línea no llevan plato) */}
                      <ul className="mt-1.5 space-y-1">
                        {(g.party ?? []).map((m) => {
                          const sinPlato = t.isVirtual || g.status === "virtual";
                          return (
                            <li
                              key={m.name}
                              className="flex items-center gap-1.5 text-xs"
                            >
                              {m.kind === "child" ? (
                                <Baby className="size-3 flex-none text-muted-foreground" />
                              ) : (
                                <Users2 className="size-3 flex-none text-muted-foreground" />
                              )}
                              <span className="min-w-0 flex-1 truncate text-muted-foreground">
                                {m.name}
                              </span>
                              {sinPlato ? (
                                <span className="flex flex-none items-center gap-1 text-[10px] text-mirror">
                                  <Video className="size-3" /> sin plato
                                </span>
                              ) : (
                                <select
                                  value={m.meal ?? ""}
                                  disabled={pending}
                                  onChange={(e) =>
                                    startTransition(() => {
                                      setMemberMeal(g.id, m.name, e.target.value);
                                    })
                                  }
                                  className="h-6 max-w-[92px] flex-none rounded border border-input bg-background px-1 text-[10px]"
                                  aria-label={`Plato de ${m.name}`}
                                  title="Cambiar plato"
                                >
                                  {wedding.meals
                                    .filter((x) => x.for === m.kind)
                                    .map((x) => (
                                      <option key={x.id} value={x.id}>
                                        {x.label}
                                      </option>
                                    ))}
                                </select>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}

              {llena && (
                <p className="mt-2 flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                  <Lock className="size-3" /> Mesa completa
                </p>
              )}
              {t.over && (
                <p className="mt-2 text-[11px] font-medium text-destructive">
                  Se pasó por {t.people - t.seats} — mueve a alguien o amplía la mesa
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
