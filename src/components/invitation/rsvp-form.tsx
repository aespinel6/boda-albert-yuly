"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { Check, X, Heart, Loader2, Users2, Baby } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Guest } from "@/lib/types";
import { firstName } from "@/lib/utils";
import { wedding } from "@/lib/config";
import { submitRsvp, type RsvpState } from "@/app/actions/rsvp";
import { Button } from "@/components/ui/button";
import { Reveal } from "./reveal";

export function RsvpForm({ guest }: { guest: Guest }) {
  const [state, formAction, pending] = useActionState<RsvpState, FormData>(
    submitRsvp,
    null
  );
  const party = guest.party ?? [];
  const alreadyDone = guest.status !== "pending";

  const [attending, setAttending] = useState<boolean | null>(
    guest.status === "confirmed" ? true : guest.status === "declined" ? false : null
  );
  // Preseleccionados: si ya confirmó, respeta su elección; si no, todos marcados.
  const [selected, setSelected] = useState<string[]>(() =>
    guest.status === "confirmed"
      ? party.filter((m) => m.attending).map((m) => m.name)
      : party.map((m) => m.name)
  );
  const [editing, setEditing] = useState(false);

  const success = state?.ok === true;
  const toggle = (name: string) =>
    setSelected((s) => (s.includes(name) ? s.filter((n) => n !== name) : [...s, name]));

  // ── Vista de agradecimiento ──────────────────────────────────
  if (!editing && (success || (alreadyDone && !state))) {
    const goes = success ? state.attending : guest.status === "confirmed";
    const going = success
      ? party.filter((m) => selected.includes(m.name))
      : party.filter((m) => m.attending);

    return (
      <RsvpShell>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-gold/20 text-gold-light">
            {goes ? <Heart className="size-8" /> : <Check className="size-8" />}
          </span>
          <h2 className="mt-6 font-serif text-3xl sm:text-4xl">
            {goes ? "¡Gracias por confirmar!" : "Gracias por avisarnos"}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-salt-200/90">
            {goes
              ? "Nos hace muy felices saber que nos acompañarás. ¡Nos vemos muy pronto! 💫"
              : "Lamentamos que no puedas acompañarnos, pero agradecemos tu respuesta con cariño."}
          </p>

          {goes && going.length > 0 && (
            <div className="mx-auto mt-6 max-w-xs rounded-2xl border border-white/15 bg-white/5 p-4 text-left">
              <p className="mb-2 text-center text-[10px] uppercase tracking-[0.2em] text-gold-light">
                Asistirán {going.length}
              </p>
              <ul className="space-y-1.5">
                {going.map((m) => (
                  <li key={m.name} className="flex items-center gap-2 text-sm text-salt-200/90">
                    <Check className="size-3.5 flex-none text-gold-light" />
                    {m.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="button"
            onClick={() => setEditing(true)}
            className="mt-6 text-xs text-salt-200/60 underline underline-offset-4 hover:text-salt-200"
          >
            Cambiar mi respuesta
          </button>
        </motion.div>
      </RsvpShell>
    );
  }

  // ── Formulario ───────────────────────────────────────────────
  return (
    <RsvpShell>
      <Reveal className="w-full text-center">
        <p className="eyebrow text-gold-light">Confirma tu asistencia</p>
        <h2 className="mt-3 font-serif text-4xl sm:text-5xl">
          Hola, {firstName(guest.name)} 👋
        </h2>
        <p className="mt-3 text-salt-200/90">¿Nos acompañarás en este día tan especial?</p>
        <p className="mt-1 text-xs text-salt-200/60">
          Por favor confirma antes del {wedding.rsvpDeadline.display}
        </p>

        <form action={formAction} className="mx-auto mt-7 w-full max-w-md">
          <input type="hidden" name="token" value={guest.token} />
          <input type="hidden" name="attending" value={String(attending ?? "")} />

          {/* Sí / No */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setAttending(true)}
              className={`flex-1 rounded-xl border px-5 py-4 font-medium transition-all ${
                attending === true
                  ? "border-gold bg-gold text-twilight"
                  : "border-white/25 bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              <Check className="mr-1.5 inline size-4" /> Sí, ahí estaré
            </button>
            <button
              type="button"
              onClick={() => setAttending(false)}
              className={`flex-1 rounded-xl border px-5 py-4 font-medium transition-all ${
                attending === false
                  ? "border-white bg-white text-twilight"
                  : "border-white/25 bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              <X className="mr-1.5 inline size-4" /> No podré asistir
            </button>
          </div>

          {/* Lista fija de invitados */}
          <AnimatePresence>
            {attending === true && party.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-5 rounded-2xl border border-white/15 bg-white/5 p-4 text-left">
                  <div className="flex items-baseline justify-between">
                    <p className="text-sm font-medium text-white">
                      ¿Quiénes asistirán?
                    </p>
                    <span className="text-xs text-salt-200/70">
                      {selected.length} de {party.length}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-salt-200/60">
                    Desmarca a quien no pueda asistir.
                  </p>

                  <ul className="mt-3 space-y-2">
                    {party.map((m) => {
                      const on = selected.includes(m.name);
                      const Icon = m.kind === "child" ? Baby : Users2;
                      return (
                        <li key={m.name}>
                          <label
                            className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors ${
                              on
                                ? "border-gold/60 bg-gold/10"
                                : "border-white/15 bg-transparent opacity-60"
                            }`}
                          >
                            <input
                              type="checkbox"
                              name="attendees"
                              value={m.name}
                              checked={on}
                              onChange={() => toggle(m.name)}
                              className="sr-only"
                            />
                            <span
                              className={`flex size-5 flex-none items-center justify-center rounded-md border ${
                                on
                                  ? "border-gold bg-gold text-twilight"
                                  : "border-white/40 text-transparent"
                              }`}
                              aria-hidden
                            >
                              <Check className="size-3.5" strokeWidth={3} />
                            </span>
                            <span className="min-w-0 flex-1 text-sm text-white">
                              {m.name}
                            </span>
                            <Icon className="size-4 flex-none text-salt-200/50" />
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {attending !== null && (
            <Button
              type="submit"
              variant="gold"
              size="lg"
              disabled={pending}
              className="mt-6 w-full"
            >
              {pending ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Guardando…
                </>
              ) : (
                "Confirmar respuesta"
              )}
            </Button>
          )}

          {state?.ok === false && (
            <p className="mt-3 text-sm text-red-300">{state.error}</p>
          )}
        </form>
      </Reveal>
    </RsvpShell>
  );
}

function RsvpShell({ children }: { children: React.ReactNode }) {
  return (
    <section
      id="rsvp"
      className="snap-start relative flex min-h-[100svh] items-center justify-center overflow-hidden py-16"
    >
      <Image
        src="/photos/kiss-golden.jpeg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-twilight/80" />
      <div className="container relative z-10 flex justify-center text-white">
        {children}
      </div>
    </section>
  );
}
