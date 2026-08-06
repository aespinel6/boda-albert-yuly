"use client";

import { useState, useTransition, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, UserPlus } from "lucide-react";
import type { Guest } from "@/lib/types";
import { saveGuest } from "@/app/actions/admin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const GROUPS = [
  { value: "familia", label: "Familia" },
  { value: "amigos", label: "Amigos" },
  { value: "trabajo", label: "Trabajo" },
  { value: "otros", label: "Otros" },
];

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

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
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
                  className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h2 className="font-serif text-2xl">
                        {isEdit ? "Editar invitado" : "Nuevo invitado"}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {isEdit
                          ? "Actualiza los datos del invitado."
                          : "Se generará su enlace único automáticamente."}
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
                    <Field label="Nombre completo" htmlFor="name">
                      <Input
                        id="name"
                        name="name"
                        defaultValue={guest?.name ?? ""}
                        placeholder="Carlos Pérez"
                        autoFocus
                        required
                      />
                    </Field>

                    <Field label="Teléfono (WhatsApp)" htmlFor="phone" hint="Con código de país, ej: 573001112233">
                      <Input
                        id="phone"
                        name="phone"
                        defaultValue={guest?.phone ?? ""}
                        placeholder="573001112233"
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

                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Adultos" htmlFor="adults" hint="Mínimo 1">
                        <Input
                          id="adults"
                          name="adults"
                          type="number"
                          min={1}
                          max={20}
                          defaultValue={guest?.adults ?? 1}
                          required
                        />
                      </Field>

                      <Field label="Niños" htmlFor="children" hint="Precio reducido">
                        <Input
                          id="children"
                          name="children"
                          type="number"
                          min={0}
                          max={20}
                          defaultValue={guest?.children ?? 0}
                          required
                        />
                      </Field>
                    </div>

                    {error && <p className="text-sm text-destructive">{error}</p>}

                    <div className="flex justify-end gap-2 pt-2">
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
                        {isEdit ? "Guardar cambios" : "Añadir invitado"}
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
