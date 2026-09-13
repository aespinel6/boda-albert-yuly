import "server-only";
import { isDemoMode } from "./utils";
import { createSupabaseAdmin } from "./supabase/admin";
import type { Capacities } from "./pricing";

/**
 * Ajustes del panel que deben verse igual en cualquier dispositivo
 * (puestos por mesa). Se guardan como JSON en un bucket PRIVADO de
 * Supabase Storage, así no hace falta crear tablas nuevas. El bucket se
 * crea solo la primera vez que se guarda algo.
 */
const BUCKET = "panel";
const SEATS_FILE = "mesas.json";

type Supabase = ReturnType<typeof createSupabaseAdmin>;

// Modo demo: en memoria, igual que los invitados.
const demo = globalThis as unknown as { __demoSeats?: Capacities };

/** Lee el archivo; null si todavía no existe. Cualquier otro fallo lanza error. */
async function readSeats(supabase: Supabase): Promise<Capacities | null> {
  const { data: files, error: listError } = await supabase.storage
    .from(BUCKET)
    .list("", { search: SEATS_FILE });

  if (listError) {
    const { error: sinBucket } = await supabase.storage.getBucket(BUCKET);
    if (sinBucket) return null; // aún no se ha guardado nada
    throw new Error(listError.message);
  }
  if (!files?.some((f) => f.name === SEATS_FILE)) return null;

  const { data, error } = await supabase.storage.from(BUCKET).download(SEATS_FILE);
  if (error || !data) throw new Error(error?.message ?? "No se pudo leer las mesas");
  return JSON.parse(await data.text()) as Capacities;
}

/** Puestos por mesa guardados, o null si nunca se han guardado. */
export async function getTableSeats(): Promise<Capacities | null> {
  if (isDemoMode()) return demo.__demoSeats ?? null;
  return readSeats(createSupabaseAdmin());
}

/** Cambia los puestos de una o varias mesas, conservando las demás. */
export async function saveTableSeats(changes: Capacities): Promise<void> {
  if (isDemoMode()) {
    demo.__demoSeats = { ...(demo.__demoSeats ?? {}), ...changes };
    return;
  }

  const supabase = createSupabaseAdmin();
  const seats = { ...((await readSeats(supabase)) ?? {}), ...changes };
  const upload = () =>
    supabase.storage.from(BUCKET).upload(SEATS_FILE, JSON.stringify(seats), {
      upsert: true,
      contentType: "application/json",
      cacheControl: "0",
    });

  let { error } = await upload();
  if (error) {
    // Primera vez: se crea el bucket privado y se reintenta.
    const { error: sinBucket } = await supabase.storage.getBucket(BUCKET);
    if (!sinBucket) throw new Error(error.message);
    const created = await supabase.storage.createBucket(BUCKET, { public: false });
    if (created.error) throw new Error(created.error.message);
    ({ error } = await upload());
  }
  if (error) throw new Error(error.message);
}
