import "server-only";
import { nanoid } from "nanoid";
import { isDemoMode } from "./utils";
import { demoStore } from "./demo-data";
import { createSupabaseAdmin } from "./supabase/admin";
import type {
  DashboardStats,
  Guest,
  GuestGroup,
  PartyMember,
  RsvpInput,
} from "./types";

export interface GuestInput {
  name: string;
  phone?: string | null;
  email?: string | null;
  group: GuestGroup;
  /** Acompañantes con nombre (sin incluir al principal). */
  companions: Array<{ name: string; kind: "adult" | "child" }>;
}

/** Arma la lista fija: principal + acompañantes, todos preseleccionados. */
function buildParty(name: string, companions: GuestInput["companions"]) {
  const party: PartyMember[] = [
    { name: name.trim(), kind: "adult", attending: true },
    ...companions
      .filter((c) => c.name.trim())
      .map((c) => ({ name: c.name.trim(), kind: c.kind, attending: true })),
  ];
  const adults = party.filter((p) => p.kind === "adult").length;
  const children = party.filter((p) => p.kind === "child").length;
  return { party, adults, children, allowed_guests: adults + children };
}

/**
 * Capa de acceso a datos de invitados.
 * Cambia automáticamente entre MODO DEMO (en memoria) y Supabase.
 */

export async function getGuestByToken(token: string): Promise<Guest | null> {
  if (isDemoMode()) return demoStore.findByToken(token);

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .eq("token", token)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as Guest | null;
}

export async function listGuests(): Promise<Guest[]> {
  if (isDemoMode()) return demoStore.list();

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as Guest[];
}

export async function saveRsvp(input: RsvpInput): Promise<Guest> {
  const guest = await getGuestByToken(input.token);
  if (!guest) throw new Error("Invitado no encontrado");

  // Solo se aceptan nombres que ya estaban en la lista fija del invitado.
  const chosen = new Set(input.attendees);
  const party = (guest.party ?? []).map((m) => ({
    ...m,
    attending: input.attending && chosen.has(m.name),
  }));

  const going = party.filter((m) => m.attending);
  const adults = going.filter((m) => m.kind === "adult").length;
  const children = going.filter((m) => m.kind === "child").length;

  const patch = {
    status: input.attending ? ("confirmed" as const) : ("declined" as const),
    party,
    adults,
    children,
    companions: adults + children,
    confirmed_at: new Date().toISOString(),
  };

  if (isDemoMode()) {
    const updated = demoStore.update(guest.id, patch);
    if (!updated) throw new Error("No se pudo guardar");
    return updated;
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("guests")
    .update(patch)
    .eq("token", input.token)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Guest;
}

export async function markSent(id: string, sent = true): Promise<void> {
  if (isDemoMode()) {
    demoStore.update(id, { sent });
    return;
  }
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("guests").update({ sent }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function createGuest(input: GuestInput): Promise<Guest> {
  const base = {
    name: input.name.trim(),
    phone: input.phone?.trim() || null,
    email: input.email?.trim() || null,
    group: input.group,
    ...buildParty(input.name, input.companions),
    token: nanoid(10),
  };

  if (isDemoMode()) {
    const now = new Date().toISOString();
    return demoStore.create({
      id: nanoid(8),
      ...base,
      status: "pending",
      sent: false,
      companions: null,
      message: null,
      dietary: null,
      confirmed_at: null,
      arrived: false,
      created_at: now,
    });
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.from("guests").insert(base).select().single();
  if (error) throw new Error(error.message);
  return data as Guest;
}

export async function updateGuest(id: string, input: GuestInput): Promise<Guest> {
  const patch = {
    name: input.name.trim(),
    phone: input.phone?.trim() || null,
    email: input.email?.trim() || null,
    group: input.group,
    ...buildParty(input.name, input.companions),
  };

  if (isDemoMode()) {
    const updated = demoStore.update(id, patch);
    if (!updated) throw new Error("Invitado no encontrado");
    return updated;
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("guests")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Guest;
}

export async function deleteGuest(id: string): Promise<void> {
  if (isDemoMode()) {
    demoStore.remove(id);
    return;
  }
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("guests").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export function computeStats(guests: Guest[]): DashboardStats {
  const confirmed = guests.filter((g) => g.status === "confirmed");
  return {
    total: guests.length,
    confirmed: confirmed.length,
    pending: guests.filter((g) => g.status === "pending").length,
    declined: guests.filter((g) => g.status === "declined").length,
    totalAttendees: confirmed.reduce(
      (sum, g) => sum + (g.adults ?? 0) + (g.children ?? 0),
      0
    ),
    sent: guests.filter((g) => g.sent).length,
  };
}
