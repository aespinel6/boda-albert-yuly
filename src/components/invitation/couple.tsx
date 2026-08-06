import Image from "next/image";
import { User, Camera } from "lucide-react";
import { wedding } from "@/lib/config";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";
import { ScrollDownButton } from "./scroll-down-button";

interface Person {
  id: string;
  label: string;
  name: string;
  bio: string;
  photo: string;
}

export function Couple() {
  const groom: Person = {
    id: "novio",
    label: "El Novio",
    name: wedding.couple.groom,
    bio: wedding.couple.groomBio,
    photo: wedding.couple.groomPhoto,
  };
  const bride: Person = {
    id: "novia",
    label: "La Novia",
    name: wedding.couple.bride,
    bio: wedding.couple.brideBio,
    photo: wedding.couple.bridePhoto,
  };

  return (
    <>
      {/* Novio: texto izquierda · foto derecha */}
      <PersonSection person={groom} imageSide="right" buttonLabel="La novia" />
      {/* Novia: foto izquierda · texto derecha */}
      <PersonSection person={bride} imageSide="left" buttonLabel="Continuar" />
    </>
  );
}

function PersonSection({
  person,
  imageSide,
  buttonLabel,
}: {
  person: Person;
  imageSide: "left" | "right";
  buttonLabel: string;
}) {
  const textAlign =
    imageSide === "right"
      ? "sm:items-start sm:text-left"
      : "sm:items-end sm:text-right";

  return (
    <section
      id={person.id}
      className="snap-start relative flex min-h-[100svh] items-center overflow-hidden bg-salt-50 py-8 text-twilight"
    >
      <div className="container">
        <Reveal>
          <div className="mx-auto grid max-w-4xl items-center gap-8 sm:grid-cols-2 sm:gap-14">
            {/* Imagen */}
            <div
              className={cn(
                "order-1",
                imageSide === "right" ? "sm:order-2" : "sm:order-1"
              )}
            >
              <Portrait person={person} />
            </div>

            {/* Texto */}
            <div
              className={cn(
                "order-2 flex flex-col items-center text-center",
                textAlign,
                imageSide === "right" ? "sm:order-1" : "sm:order-2"
              )}
            >
              <span className="eyebrow">{person.label}</span>
              <h3 className="mt-2 font-serif text-2xl leading-tight sm:mt-3 sm:text-4xl">
                {person.name}
              </h3>
              <div className="mt-3 h-px w-16 bg-gold-soft/70" />
              <div className="mt-3 max-w-sm space-y-2.5 text-sm leading-relaxed text-twilight/70 sm:mt-4 sm:text-[15px]">
                {person.bio.split(/\n\n+/).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <ScrollDownButton label={buttonLabel} tone="dark" variant="inline" />
      </div>
    </section>
  );
}

function Portrait({ person }: { person: Person }) {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[176px] overflow-hidden rounded-2xl shadow-xl sm:max-w-xs">
      {person.photo ? (
        <Image
          src={person.photo}
          alt={person.name}
          fill
          sizes="(max-width: 640px) 80vw, 320px"
          className="object-cover"
        />
      ) : (
        // Imagen de referencia (reemplazar por la foto real)
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-twilight via-twilight-soft to-mirror text-white">
          <span className="flex size-16 items-center justify-center rounded-full bg-white/10">
            <User className="size-8 text-gold-light" />
          </span>
          <span className="flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-white/70">
            <Camera className="size-3.5" /> Foto de referencia
          </span>
          <span className="text-sm text-white/50">{person.label}</span>
        </div>
      )}
    </div>
  );
}
