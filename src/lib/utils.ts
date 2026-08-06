import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Devuelve true si la app corre en modo demo (sin Supabase). */
export function isDemoMode(): boolean {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") return true;
  // Sin credenciales de Supabase → demo automático
  return !process.env.NEXT_PUBLIC_SUPABASE_URL;
}

/** Primer nombre para saludos ("Carlos Andrés Pérez" → "Carlos"). */
export function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName;
}

/** Construye la URL única de invitación para un token. */
export function invitationUrl(token: string, baseUrl?: string): string {
  const base =
    baseUrl || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/i/${token}`;
}

/** Mensaje de WhatsApp prellenado para un invitado. */
export function whatsappMessage(name: string, token: string): string {
  const url = invitationUrl(token);
  return (
    `Hola ${firstName(name)} 😊\n\n` +
    `Queremos invitarte a compartir uno de los días más importantes de nuestras vidas. ` +
    `Aquí encontrarás todos los detalles y podrás confirmar tu asistencia.\n\n` +
    `${url}\n\n` +
    `Con cariño,\nAlbert & Yuly ❤️`
  );
}

/** Enlace click-to-chat de WhatsApp (wa.me). */
export function whatsappLink(phone: string | null, message: string): string {
  const clean = (phone || "").replace(/[^\d]/g, "");
  const text = encodeURIComponent(message);
  return clean
    ? `https://wa.me/${clean}?text=${text}`
    : `https://wa.me/?text=${text}`;
}

/** Formatea una fecha ISO a "26 sep 2026, 3:42 p. m." */
export function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}
