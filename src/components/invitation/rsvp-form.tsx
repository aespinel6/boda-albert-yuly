"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { Check, X, Heart, Loader2, Users2, Baby, Minus, Plus } from "lucide-react";
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
  const [attending, setAttending] = useState<boolean | null>(
    guest.status === "confirmed" ? true : guest.status === "declined" ? false : null
  );
  const maxCupos = guest.allowed_guests;
  const [adults, setAdults] = useState(
    guest.adults && guest.adults > 0 ? Math.min(guest.adults, maxCupos) : 1
  );
  const [children, setChildren] = useState(
    guest.children ? Math.min(guest.children, maxCupos - 1) : 0
  );

  const [editing, setEditing] = useState(false);
  const alreadyDone = guest.status !== "pending";
  const success = state?.ok === true;
  const total = adults + children;

  function changeAdults(delta: number) {
    const a = Math.min(Math.max(adults + delta, 1), maxCupos);
    setAdults(a);
    if (children > maxCupos - a) setChildren(maxCupos - a);
  }
  function changeChildren(delta: number) {
    setChildren(Math.min(Math.max(children + delta, 0), maxCupos - adults));
  }

  // Vista de agradecimiento tras confirmar (o si ya había confirmado)
  if (!editing && (success || (alreadyDone && !state))) {
    const goes = success ? state.attending : guest.status === "confirmed";
    const confAdults = success ? adults : guest.adults;
    const confChildren = success ? children : guest.children;
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
          {goes && (
            <p className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-salt-200/90">
              <Users2 className="size-4 text-gold-light" />
              Confirmaste {confAdults} {confAdults === 1 ? "adulto" : "adultos"}
              {confChildren > 0 && ` · ${confChildren} ${confChildren === 1 ? "niño" : "niños"}`}
            </p>
          )}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-xs text-salt-200/60 underline underline-offset-4 hover:text-salt-200"
            >
              Cambiar mi respuesta
            </button>
          </div>
        </motion.div>
      </RsvpShell>
    );
  }

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

        <form action={formAction} className="mx-auto mt-8 w-full max-w-md">
          <input type="hidden" name="token" value={guest.token} />
          <input type="hidden" name="attending" value={String(attending ?? "")} />

          {/* Elección Sí / No */}
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

          <AnimatePresence>
            {attending === true && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-6 space-y-5 text-left">
                  {maxCupos > 1 && (
                    <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-white">
                          ¿Quiénes asistirán?
                        </label>
                        <span className="text-xs text-salt-200/70">
                          {total} de {maxCupos} pases
                        </span>
                      </div>
                      <div className="mt-3 space-y-2.5">
                        <Stepper
                          Icon={Users2}
                          label="Adultos"
                          value={adults}
                          onDec={() => changeAdults(-1)}
                          onInc={() => changeAdults(1)}
                          canDec={adults > 1}
                          canInc={total < maxCupos}
                        />
                        <Stepper
                          Icon={Baby}
                          label="Niños"
                          value={children}
                          onDec={() => changeChildren(-1)}
                          onInc={() => changeChildren(1)}
                          canDec={children > 0}
                          canInc={total < maxCupos}
                        />
                      </div>
                    </div>
                  )}
                  <input type="hidden" name="adults" value={adults} />
                  <input type="hidden" name="children" value={children} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {attending === false && (
            <>
              <input type="hidden" name="adults" value={0} />
              <input type="hidden" name="children" value={0} />
            </>
          )}

          {attending !== null && (
            <Button
              type="submit"
              variant="gold"
              size="lg"
              disabled={pending}
              className="mt-7 w-full"
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

function Stepper({
  Icon,
  label,
  value,
  onDec,
  onInc,
  canDec,
  canInc,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  onDec: () => void;
  onInc: () => void;
  canDec: boolean;
  canInc: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-sm text-salt-200/90">
        <Icon className="size-4 text-gold-light" /> {label}
      </span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDec}
          disabled={!canDec}
          aria-label={`Menos ${label}`}
          className="flex size-9 items-center justify-center rounded-lg border border-white/25 text-white transition-colors hover:bg-white/10 disabled:opacity-30"
        >
          <Minus className="size-4" />
        </button>
        <span className="w-6 text-center font-serif text-xl tabular-nums text-white">
          {value}
        </span>
        <button
          type="button"
          onClick={onInc}
          disabled={!canInc}
          aria-label={`Más ${label}`}
          className="flex size-9 items-center justify-center rounded-lg border border-white/25 text-white transition-colors hover:bg-white/10 disabled:opacity-30"
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
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
