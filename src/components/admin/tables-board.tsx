"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  Armchair, Users2, Baby, AlertTriangle, Wand2, Eraser, Loader2, Lock,
} from "lucide-react";
import type { Guest } from "@/lib/types";
import { wedding } from "@/lib/config";
import { groupByTable, seatsOf, seatsUsedBy, type Capacities } from "@/lib/pricing";
import { setGuestTable, autoAssignTables, clearAllTables } from "@/app/actions/admin";
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

  const sentados = tables.reduce((n, t) => n + t.people, 0);
  const puestos = tables.reduce((n, t) => n + t.seats, 0);

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
      // La mesa actual siempre se puede mantener.
      full: t.name !== actual && t.free < necesita,
      free: t.free,
    }));
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border px-6 py-4">
        <div>
          <h2 className="font-serif text-2xl leading-tight">Mesas del salón</h2>
          <p className="text-sm text-muted-foreground">
            {sentados} de {puestos} puestos ocupados · {unassigned.people} personas por ubicar
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
                      {t.name} {t.full ? "(llena)" : `· ${t.free} libres`}
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
          const llena = t.free === 0 && !t.over;
          return (
            <div
              key={t.name}
              className={`rounded-xl border p-4 ${
                t.over
                  ? "border-destructive/40 bg-destructive/5"
                  : llena
                    ? "border-emerald-500/40 bg-emerald-500/5"
                    : "border-border bg-background"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-sm font-semibold">
                  <Armchair className="size-4 text-gold" />
                  {t.name}
                </span>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-sm tabular-nums ${
                      t.over
                        ? "font-semibold text-destructive"
                        : llena
                          ? "font-medium text-emerald-600"
                          : "text-muted-foreground"
                    }`}
                  >
                    {t.people}/{t.seats}
                  </span>
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
                </div>
              </div>

              {t.guests.length === 0 ? (
                <p className="mt-3 text-xs text-muted-foreground">Mesa vacía</p>
              ) : (
                <ul className="mt-3 space-y-1.5">
                  {t.guests.map((g) => (
                    <li key={g.id} className="flex items-center gap-2 text-sm">
                      <span className="min-w-0 flex-1 truncate">{g.name}</span>
                      <span className="flex flex-none items-center gap-1 text-xs text-muted-foreground">
                        {g.adults > 0 && (
                          <>
                            <Users2 className="size-3" />
                            {g.adults}
                          </>
                        )}
                        {g.children > 0 && (
                          <>
                            <Baby className="size-3" />
                            {g.children}
                          </>
                        )}
                      </span>
                      <select
                        value={t.name}
                        disabled={pending}
                        onChange={(e) => asignar(g.id, e.target.value)}
                        className="h-6 max-w-[26px] flex-none rounded border border-input bg-background text-[10px] text-muted-foreground"
                        aria-label={`Cambiar mesa de ${g.name}`}
                        title="Cambiar de mesa"
                      >
                        <option value="">Sin mesa</option>
                        {opcionesPara(g, t.name).map((o) => (
                          <option key={o.name} value={o.name} disabled={o.full}>
                            {o.name} {o.full ? "(llena)" : `· ${o.free} libres`}
                          </option>
                        ))}
                      </select>
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
