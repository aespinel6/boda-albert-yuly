"use client";

import { useState, useTransition, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Loader2, Check, Video, Clock, Users2, Baby, AlertTriangle, type LucideIcon,
} from "lucide-react";
import type { Guest, RsvpMode } from "@/lib/types";
import { wedding } from "@/lib/config";
import { formatDateTime } from "@/lib/utils";
import { setGuestRsvp } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";

type Mode = RsvpMode | "pending";

const MODES: Array<{ value: Mode; label: string; Icon: LucideIcon }> = [
  { value: "presencial", label: "Asiste", Icon: Check },
  { value: "virtual", label: "En línea", Icon: Video },
  { value: "no", label: "No asiste", Icon: X },
  { value: "pending", label: "Sin respuesta", Icon: Clock },
];

function modeOf(g: Guest): Mode {
  if (g.status === "confirmed") return "presencial";
  if (g.status === "virtual") return "virtual";
  if (g.status === "declined") return "no";
  return "pending";
}

/**
 * Registra desde el panel la respuesta de un invitado que confirmó por
 * WhatsApp, en persona o por teléfono (sin pasar por su tarjeta).
 */
export function RsvpAdminDialog({
  guest,
  trigger,
}: {
  guest: Guest;
  trigger: ReactNode;
}) {
  const party = guest.party ?? [];
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("pending");
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Cada vez que se abre, parte de la respuesta que está guardada.
  function abrir() {
    const respondio = guest.status === "confirmed" || guest.status === "virtual";
    setMode(modeOf(guest));
    setSelected(party.filter((m) => !respondio || m.attending).map((m) => m.name));
    setError(null);
    setOpen(true);
  }

  const toggle = (name: string) =>
    setSelected((s) => (s.includes(name) ? s.filter((n) => n !== name) : [...s, name]));

  const conLista = mode === "presencial" || mode === "virtual";
  const sinSilla = mode === "presencial" && guest.table_name === wedding.virtualTable;

  function guardar() {
    setError(null);
    startTransition(async () => {
      const res = await setGuestRsvp(guest.id, mode, conLista ? selected : []);
      if (res.ok) setOpen(false);
      else setError(res.error ?? "No se pudo guardar.");
    });
  }

  return (
    <>
      <span onClick={abrir}>{trigger}</span>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-twilight/50 p-4 backdrop-blur-sm"
                onClick={() => !pending && setOpen(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 12 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="font-serif text-2xl">Confirmación</h2>
                      <p className="truncate text-sm text-muted-foreground">{guest.name}</p>
                    </div>
                    <button
                      onClick={() => setOpen(false)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
                      aria-label="Cerrar"
                    >
                      <X className="size-5" />
                    </button>
                  </div>

                  <p className="text-sm font-medium text-foreground">¿Qué respondió?</p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {MODES.map(({ value, label, Icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setMode(value)}
                        className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                          mode === value
                            ? "border-twilight bg-twilight text-white"
                            : "border-border text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <Icon className="size-4" /> {label}
                      </button>
                    ))}
                  </div>

                  {conLista && party.length > 0 && (
                    <div className="mt-5">
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm font-medium text-foreground">
                          {mode === "virtual" ? "¿Quiénes se conectan?" : "¿Quiénes asisten?"}
                        </span>
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {selected.length} de {party.length}
                        </span>
                      </div>
                      <ul className="mt-2 space-y-1.5">
                        {party.map((m) => {
                          const on = selected.includes(m.name);
                          const Icon = m.kind === "child" ? Baby : Users2;
                          return (
                            <li key={m.name}>
                              <label
                                className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 transition-colors ${
                                  on ? "border-gold/50 bg-gold/10" : "border-border opacity-60"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={on}
                                  onChange={() => toggle(m.name)}
                                  className="size-4 accent-gold"
                                />
                                <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                                  {m.name}
                                </span>
                                <Icon className="size-4 flex-none text-muted-foreground" />
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {sinSilla && (
                    <p className="mt-4 flex gap-2 rounded-lg bg-gold/10 px-3 py-2 text-xs text-foreground">
                      <AlertTriangle className="mt-0.5 size-3.5 flex-none text-gold" />
                      Está en la {wedding.virtualTable}: no tendrá silla ni plato. Cambia
                      su mesa en el tablero de mesas.
                    </p>
                  )}
                  {mode === "pending" && guest.status !== "pending" && (
                    <p className="mt-4 text-xs text-muted-foreground">
                      Se borrará la respuesta y todo el grupo volverá a quedar invitado.
                    </p>
                  )}

                  {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">
                      {guest.confirmed_at
                        ? `Respondió: ${formatDateTime(guest.confirmed_at)}`
                        : "Aún no ha respondido"}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => setOpen(false)}
                        disabled={pending}
                      >
                        Cancelar
                      </Button>
                      <Button variant="gold" onClick={guardar} disabled={pending}>
                        {pending ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Check className="size-4" />
                        )}
                        Guardar
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
