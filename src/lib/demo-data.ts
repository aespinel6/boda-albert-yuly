import type { Guest } from "./types";

/**
 * Datos de ejemplo para el MODO DEMO (sin Supabase).
 * Se guardan en memoria durante la sesión del servidor: las confirmaciones
 * funcionan mientras el proceso siga vivo, pero se reinician al reiniciar.
 */
const now = new Date().toISOString();

export const demoGuests: Guest[] = [
  {
    id: "1", name: "Carlos Pérez", phone: "573001112233", email: "carlos@mail.com",
    group: "amigos", allowed_guests: 2, adults: 2, children: 0, party: [{ name: "Carlos Pérez", kind: "adult", attending: true }, { name: "Ana Pérez", kind: "adult", attending: true }], token: "demo-carlos", status: "confirmed",
    sent: true, companions: 2, message: "¡Con gusto! Ahí estaremos 🎉",
    dietary: "Sin gluten", confirmed_at: now, arrived: false, created_at: now,
  },
  {
    id: "2", name: "María Gómez", phone: "573004445566", email: null,
    group: "familia", allowed_guests: 4, adults: 3, children: 1, party: [{ name: "María Gómez", kind: "adult", attending: true }, { name: "Pedro Gómez", kind: "adult", attending: true }, { name: "Luis Gómez", kind: "adult", attending: true }, { name: "Sofi Gómez", kind: "child", attending: true }], token: "demo-maria", status: "pending",
    sent: true, companions: null, message: null, dietary: null,
    confirmed_at: null, arrived: false, created_at: now,
  },
  {
    id: "3", name: "Andrés Ruiz", phone: "573007778899", email: null,
    group: "trabajo", allowed_guests: 1, adults: 1, children: 0, party: [{ name: "Andrés Ruiz", kind: "adult", attending: true }], token: "demo-andres", status: "declined",
    sent: true, companions: 0, message: "Lo siento, tengo un viaje esa fecha.",
    dietary: null, confirmed_at: now, arrived: false, created_at: now,
  },
  {
    id: "4", name: "Laura Díaz", phone: "573001234567", email: null,
    group: "familia", allowed_guests: 3, adults: 2, children: 1, party: [{ name: "Laura Díaz", kind: "adult", attending: true }, { name: "Jorge Díaz", kind: "adult", attending: true }, { name: "Mati Díaz", kind: "child", attending: true }], token: "demo-laura", status: "confirmed",
    sent: true, companions: 3, message: "Vamos los 3 ❤️", dietary: null,
    confirmed_at: now, arrived: false, created_at: now,
  },
  {
    id: "5", name: "Jorge Salas", phone: "573009876543", email: null,
    group: "amigos", allowed_guests: 2, adults: 2, children: 0, party: [{ name: "Jorge Salas", kind: "adult", attending: true }, { name: "Esposa", kind: "adult", attending: true }], token: "demo-jorge", status: "pending",
    sent: false, companions: null, message: null, dietary: null,
    confirmed_at: null, arrived: false, created_at: now,
  },
];

/** Store mutable en memoria para el modo demo. */
class DemoStore {
  private guests: Guest[] = demoGuests.map((g) => ({ ...g }));

  list(): Guest[] {
    return this.guests.map((g) => ({ ...g }));
  }

  findByToken(token: string): Guest | null {
    return this.guests.find((g) => g.token === token) ?? null;
  }

  update(id: string, patch: Partial<Guest>): Guest | null {
    const g = this.guests.find((x) => x.id === id);
    if (!g) return null;
    Object.assign(g, patch);
    return { ...g };
  }

  create(guest: Guest): Guest {
    this.guests.push({ ...guest });
    return { ...guest };
  }

  remove(id: string): boolean {
    const i = this.guests.findIndex((x) => x.id === id);
    if (i === -1) return false;
    this.guests.splice(i, 1);
    return true;
  }
}

// Singleton persistente entre hot-reloads en dev
const globalForDemo = globalThis as unknown as { __demoStore?: DemoStore };
export const demoStore = globalForDemo.__demoStore ?? new DemoStore();
if (process.env.NODE_ENV !== "production") globalForDemo.__demoStore = demoStore;
