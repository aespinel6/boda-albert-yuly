import Link from "next/link";
import Image from "next/image";
import { isDemoMode } from "@/lib/utils";
import { Monogram } from "@/components/invitation/monogram";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  const demo = isDemoMode();

  return (
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-twilight px-6 text-center text-white">
      <Image
        src="/photos/silhouette.jpeg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-twilight/70 to-twilight" />

      <div className="relative z-10 flex flex-col items-center">
        <Monogram tone="light" />
        <h1 className="mt-8 font-serif text-5xl leading-none sm:text-7xl">
          Albert <span className="italic text-gold-light">&amp;</span> Yuly
        </h1>
        <div className="horizon my-6" />
        <p className="max-w-md text-white/80">
          Nuestra invitación es personal: cada invitado recibe su propio enlace
          por WhatsApp.
        </p>

        {demo && (
          <div className="mt-10 flex flex-col items-center gap-3">
            <span className="rounded-full border border-gold/40 px-4 py-1 text-xs uppercase tracking-[0.2em] text-gold-light">
              Modo demo
            </span>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/i/demo-carlos"
                className={buttonVariants({ variant: "gold" })}
              >
                Ver invitación de ejemplo
              </Link>
              <Link
                href="/admin"
                className={buttonVariants({
                  variant: "outline",
                  className: "border-white/30 text-white hover:bg-white/10",
                })}
              >
                Panel de administración
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
