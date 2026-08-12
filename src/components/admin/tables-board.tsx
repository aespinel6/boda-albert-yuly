"use client";

import { useMemo, useState, useTransition } from "react";
import { Armchair, Users2, Baby, AlertTriangle } from "lucide-react";
import type { Guest } from "@/lib/types";
import { wedding } from "@/lib/config";
import { groupByTable } from "@/lib/pricing";
import { setGuestTable } from "@/app/actions/admin";

/** Distribución del salón: cuántas personas hay en cada mesa. */
export function TablesBoard({ guests }: { guests: Guest[] }) {
  const [pending, startTransition] = useTransition();
  const [cupo, setCupo] = useState(10);

  const { tables, unassigned } = useMemo(() => groupByTable(guests), [guests]);
  const sentados = tables.reduce((n, t) => n + t.people, 0);

  function asignar(id: string, mesa: string) {
    startTransition(() => {
      setGuestTable(id, mesa);
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border px-6 py-4">
        <div>
          <h2 className="font-serif text-2xl leading-tight">Mesas del salón</h2>
          <p className="text-sm text-muted-foreground">
            {sentados} personas ubicadas · {unassigned.people} por ubicar
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          Cupo por mesa
          <input
            type="number"
            min={1}
            max={30}
            value={cupo}
            onChange={(e) => setCupo(Number(e.target.value) || 1)}
            className="h-9 w-16 rounded-lg border border-input bg-background px-2 text-sm tabular-nums text-foreground"
          />
        </label>
      </div>

      {/* Sin asignar */}
      {unassigned.guests.length > 0 && (
        <div className="border-b border-border bg-gold/5 px-6 py-4">
          <p className="flex items-center gap-2 text-sm font-medium text-foreground">
            <AlertTriangle className="size-4 text-gold" />
            Sin mesa asignada ({unassigned.guests.length} invitaciones ·{" "}
            {unassigned.people} personas)
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {unassigned.guests.map((g) => (
              <div
                key={g.id}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5"
              >
                <span className="text-sm">{g.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({g.adults + g.children})
                </span>
                <select
                  value=""
                  disabled={pending}
                  onChange={(e) => asignar(g.id, e.target.value)}
                  className="h-7 rounded border border-input bg-background px-1 text-xs"
                  aria-label={`Asignar mesa a ${g.name}`}
                >
                  <option value="">Asignar…</option>
                  {wedding.tables.map((t) => (
                    <option key={t} value={t}>
                      {t}
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
          const lleno = t.people > cupo;
          return (
            <div
              key={t.name}
              className={`rounded-xl border p-4 ${
                lleno ? "border-destructive/40 bg-destructive/5" : "border-border bg-background"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-sm font-semibold">
                  <Armchair className="size-4 text-gold" />
                  {t.name}
                </span>
                <span
                  className={`text-sm tabular-nums ${
                    lleno ? "font-semibold text-destructive" : "text-muted-foreground"
                  }`}
                >
                  {t.people}/{cupo}
                </span>
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
                        className="h-6 w-6 flex-none appearance-none rounded border border-input bg-background text-center text-[10px] text-muted-foreground"
                        aria-label={`Cambiar mesa de ${g.name}`}
                        title="Cambiar de mesa"
                      >
                        <option value="">Sin mesa</option>
                        {wedding.tables.map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
