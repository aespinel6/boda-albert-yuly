import "server-only";
import { isDemoMode } from "./utils";
import { createSupabaseAdmin } from "./supabase/admin";
import type { Capacities } from "./pricing";

/**
 * Ajustes del panel que deben verse igual en cualquier dispositivo
 * (puestos por mesa y mesas agregadas). Se guardan como JSON en un bucket
 * PRIVADO de Supabase Storage, así no hace falta crear tablas nuevas. El
 * bucket se crea solo la primera vez que se guarda algo.
 */
const BUCKET = "panel";
const SEATS_FILE = "mesas.json";

// Modo demo: en memoria, igual que los invitados.
const demo = globalThis as unknown as { __demoSeats?: Capacities };

/** Lee el archivo; null si todavía no existe. Cualquier otro fallo lanza error. */
async function readSeats(): Promise<Capacities | null> {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  // La CDN de Supabase sirve la descarga desde caché aunque el archivo haya
  // cambiado: una URL distinta en cada lectura obliga a leer lo recién guardado.
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/${BUCKET}/${SEATS_FILE}?v=${crypto.randomUUID()}`,
    { headers: { Authorization: `Bearer ${key}`, apikey: key }, cache: "no-store" }
  );
  if (res.ok) return (await res.json()) as Capacities;

  // Sin archivo (o sin bucket) = todavía no se ha guardado nada.
  if (/not.?found|NoSuchKey/i.test(await res.text())) return null;
  throw new Error(`No se pudieron leer los puestos de las mesas (${res.status}).`);
}

/** Sube el archivo completo (la primera vez crea el bucket privado). */
async function writeSeats(seats: Capacities): Promise<void> {
  const supabase = createSupabaseAdmin();
  const upload = () =>
    supabase.storage.from(BUCKET).upload(SEATS_FILE, JSON.stringify(seats), {
      upsert: true,
      contentType: "application/json",
      cacheControl: "0",
    });

  let { error } = await upload();
  if (error) {
    const { error: sinBucket } = await supabase.storage.getBucket(BUCKET);
    if (!sinBucket) throw new Error(error.message);
    const created = await supabase.storage.createBucket(BUCKET, { public: false });
    if (created.error) throw new Error(created.error.message);
    ({ error } = await upload());
  }
  if (error) throw new Error(error.message);
}

/** Puestos por mesa guardados, o null si nunca se han guardado. */
export async function getTableSeats(): Promise<Capacities | null> {
  if (isDemoMode()) return demo.__demoSeats ?? null;
  return readSeats();
}

/** Cambia los puestos de una o varias mesas (o agrega mesas), conservando las demás. */
export async function saveTableSeats(changes: Capacities): Promise<void> {
  if (isDemoMode()) {
    demo.__demoSeats = { ...(demo.__demoSeats ?? {}), ...changes };
    return;
  }
  await writeSeats({ ...((await readSeats()) ?? {}), ...changes });
}

/** Quita una mesa agregada desde el panel. */
export async function removeTableSeats(name: string): Promise<void> {
  const seats = { ...((isDemoMode() ? demo.__demoSeats : await readSeats()) ?? {}) };
  delete seats[name];
  if (isDemoMode()) {
    demo.__demoSeats = seats;
    return;
  }
  await writeSeats(seats);
}
