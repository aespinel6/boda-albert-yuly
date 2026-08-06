import Link from "next/link";
import { Monogram } from "@/components/invitation/monogram";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-twilight px-6 text-center text-white">
      <Monogram tone="light" showDate />
      <h1 className="mt-8 font-serif text-3xl sm:text-4xl">
        No encontramos tu invitación
      </h1>
      <p className="mt-3 max-w-md text-white/70">
        El enlace puede estar incompleto o vencido. Si crees que es un error,
        escríbenos por WhatsApp y con gusto te ayudamos.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-lg border border-white/30 px-6 py-3 text-sm hover:bg-white/10"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
