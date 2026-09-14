import "server-only";
import { isDemoMode } from "./utils";
import { createSupabaseAdmin } from "./supabase/admin";
import type { Capacities } from "./pricing";

/**
 * Ajustes del panel que deben verse igual en cualquier dispositivo
 * (puestos por mesa, mesas agregadas y mesas cerradas). Se guardan como
 * JSON en un bucket PRIVADO de Supabase Storage, así no hace falta crear
 * tablas nuevas. El bucket se crea solo la primera vez que se guarda algo.
 */
const BUCKET = "panel";
const SEATS_FILE = "mesas.json";
const CLOSED_FILE = "mesas-cerradas.json";

// Modo demo: en memoria, igual que los invitados.
const demo = globalThis as unknown as {
  __demoSeats?: Capacities;
  __demoClosed?: string[];
};

/** Lee un archivo JSON; null si todavía no existe. Cualquier otro fallo lanza error. */
async function readJson<T>(file: string): Promise<T | null> {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  // La CDN de Supabase sirve la descarga desde caché aunque el archivo haya
  // cambiado: una URL distinta en cada lectura obliga a leer lo recién guardado.
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/${BUCKET}/${file}?v=${crypto.randomUUID()}`,
    { headers: { Authorization: `Bearer ${key}`, apikey: key }, cache: "no-store" }
  );
  if (res.ok) return (await res.json()) as T;

  // Sin archivo (o sin bucket) = todavía no se ha guardado nada.
  if (/not.?found|NoSuchKey/i.test(await res.text())) return null;
  throw new Error(`No se pudieron leer los ajustes de las mesas (${res.status}).`);
}

/** Sube un archivo JSON completo (la primera vez crea el bucket privado). */
async function writeJson(file: string, data: unknown): Promise<void> {
  const supabase = createSupabaseAdmin();
  const upload = () =>
    supabase.storage.from(BUCKET).upload(file, JSON.stringify(data), {
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
  return readJson<Capacities>(SEATS_FILE);
}

/** Cambia los puestos de una o varias mesas (o agrega mesas), conservando las demás. */
export async function saveTableSeats(changes: Capacities): Promise<void> {
  if (isDemoMode()) {
    demo.__demoSeats = { ...(demo.__demoSeats ?? {}), ...changes };
    return;
  }
  await writeJson(SEATS_FILE, { ...((await getTableSeats()) ?? {}), ...changes });
}

/** Quita una mesa agregada desde el panel. */
export async function removeTableSeats(name: string): Promise<void> {
  const seats = { ...((await getTableSeats()) ?? {}) };
  delete seats[name];
  if (isDemoMode()) {
    demo.__demoSeats = seats;
    return;
  }
  await writeJson(SEATS_FILE, seats);
}

/** Mesas cerradas a mano: se dan por completas aunque les queden puestos. */
export async function getClosedTables(): Promise<string[]> {
  if (isDemoMode()) return demo.__demoClosed ?? [];
  return (await readJson<string[]>(CLOSED_FILE)) ?? [];
}

/** Cierra o reabre una mesa. */
export async function saveClosedTable(name: string, closed: boolean): Promise<void> {
  const actuales = await getClosedTables();
  if (actuales.includes(name) === closed) return; // ya estaba así

  const next = closed ? [...actuales, name] : actuales.filter((n) => n !== name);
  if (isDemoMode()) {
    demo.__demoClosed = next;
    return;
  }
  await writeJson(CLOSED_FILE, next);
}
