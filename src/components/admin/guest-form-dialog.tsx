"use client";

import { useState, useTransition, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, UserPlus, Plus, Trash2 } from "lucide-react";
import type { Guest } from "@/lib/types";
import { wedding } from "@/lib/config";
import { saveGuest } from "@/app/actions/admin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const GROUPS = [
  { value: "familia", label: "Familia" },
  { value: "amigos", label: "Amigos" },
  { value: "trabajo", label: "Trabajo" },
  { value: "otros", label: "Otros" },
];

type Row = { name: string; kind: "adult" | "child"; meal: string };

export function GuestFormDialog({
  guest,
  trigger,
}: {
  guest?: Guest;
  trigger: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const isEdit = !!guest;

  // Acompañantes = party sin el principal (primer elemento)
  const [rows, setRows] = useState<Row[]>(() =>
    (guest?.party ?? []).slice(1).map((m) => ({ name: m.name, kind: m.kind, meal: m.meal ?? '' }))
  );

  const addRow = () => setRows((r) => [...r, { name: "", kind: "adult", meal: "" }]);
  const delRow = (i: number) => setRows((r) => r.filter((_, x) => x !== i));
  const setRow = (i: number, patch: Partial<Row>) =>
    setRows((r) => r.map((x, n) => (n === i ? { ...x, ...patch } : x)));

  const adults = 1 + rows.filter((r) => r.name.trim() && r.kind === "adult").length;
  const children = rows.filter((r) => r.name.trim() && r.kind === "child").length;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("companions", JSON.stringify(rows.filter((r) => r.name.trim())));
    setError(null);
    startTransition(async () => {
      const res = await saveGuest(guest?.id ?? null, formData);
      if (res.ok) setOpen(false);
      else setError(res.error ?? "No se pudo guardar.");
    });
  }

  return (
    <>
      <span onClick={() => setOpen(true)}>{trigger}</span>

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
                  <div className="mb-5 flex items-start justify-between">
                    <div>
                      <h2 className="font-serif text-2xl">
                        {isEdit ? "Editar invitación" : "Nueva invitación"}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {adults} adulto{adults !== 1 && "s"}
                        {children > 0 && ` · ${children} niño${children !== 1 ? "s" : ""}`}
                        {" · "}
                        {adults + children} persona{adults + children !== 1 && "s"}
                      </p>
                    </div>
                    <button
                      onClick={() => setOpen(false)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
                      aria-label="Cerrar"
                    >
                      <X className="size-5" />
                    </button>
                  </div>

                  <form onSubmit={onSubmit} className="space-y-4">
                    <Field label="Invitado principal" htmlFor="name">
                      <Input
                        id="name"
                        name="name"
                        defaultValue={guest?.name ?? ""}
                        placeholder="Carlos Pérez"
                        autoFocus
                        required
                      />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Teléfono" htmlFor="phone" hint="Sin +57">
                        <Input
                          id="phone"
                          name="phone"
                          defaultValue={guest?.phone?.replace(/^57/, "") ?? ""}
                          placeholder="3001112233"
                          inputMode="tel"
                        />
                      </Field>
                      <Field label="Grupo" htmlFor="group">
                        <select
                          id="group"
                          name="group"
                          defaultValue={guest?.group ?? "otros"}
                          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {GROUPS.map((g) => (
                            <option key={g.value} value={g.value}>
                              {g.label}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Mesa" htmlFor="table_name">
                        <select
                          id="table_name"
                          name="table_name"
                          defaultValue={guest?.table_name ?? ""}
                          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="">Sin asignar</option>
                          {wedding.tables.map((t) => (
                            <option key={t.name} value={t.name}>
                              {t.name}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Plato del principal" htmlFor="meal">
                        <select
                          id="meal"
                          name="meal"
                          defaultValue={guest?.party?.[0]?.meal ?? ""}
                          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {wedding.meals
                            .filter((m) => m.for === "adult")
                            .map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.label}
                              </option>
                            ))}
                        </select>
                      </Field>
                    </div>

                    {/* Acompañantes con nombre */}
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">
                          Acompañantes
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={addRow}
                          className="h-7 text-xs"
                        >
                          <Plus className="size-3.5" /> Añadir
                        </Button>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Solo estas personas podrán confirmar en la tarjeta.
                      </p>

                      <div className="mt-2 space-y-2">
                        {rows.length === 0 && (
                          <p className="rounded-lg border border-dashed border-border px-3 py-3 text-center text-xs text-muted-foreground">
                            Sin acompañantes — va solo.
                          </p>
                        )}
                        {rows.map((r, i) => (
                          <div
                            key={i}
                            className="rounded-lg border border-border bg-muted/30 p-2"
                          >
                            <div className="flex items-center gap-2">
                              <Input
                                value={r.name}
                                onChange={(e) => setRow(i, { name: e.target.value })}
                                placeholder="Nombre del acompañante"
                                className="flex-1 bg-background"
                              />
                              <select
                                value={r.kind}
                                onChange={(e) =>
                                  setRow(i, {
                                    kind: e.target.value as Row["kind"],
                                    meal: "", // el plato vuelve al de por defecto
                                  })
                                }
                                className="h-10 rounded-lg border border-input bg-background px-2 text-xs"
                              >
                                <option value="adult">Adulto</option>
                                <option value="child">Niño</option>
                              </select>
                              <button
                                type="button"
                                onClick={() => delRow(i)}
                                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-destructive"
                                aria-label="Quitar"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                            <select
                              value={r.meal}
                              onChange={(e) => setRow(i, { meal: e.target.value })}
                              className="mt-2 h-9 w-full rounded-lg border border-input bg-background px-2 text-xs"
                              aria-label={`Plato de ${r.name || "acompañante"}`}
                            >
                              <option value="">
                                Plato por defecto ({r.kind === "child" ? "niño" : "adulto"})
                              </option>
                              {wedding.meals
                                .filter((m) => m.for === r.kind)
                                .map((m) => (
                                  <option key={m.id} value={m.id}>
                                    {m.label}
                                  </option>
                                ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>

                    {error && <p className="text-sm text-destructive">{error}</p>}

                    <div className="flex justify-end gap-2 pt-1">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setOpen(false)}
                        disabled={pending}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" variant="gold" disabled={pending}>
                        {pending ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <UserPlus className="size-4" />
                        )}
                        {isEdit ? "Guardar cambios" : "Añadir invitación"}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
