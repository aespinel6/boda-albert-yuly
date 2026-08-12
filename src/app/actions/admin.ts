"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  ADMIN_COOKIE,
  checkPassword,
  createSessionToken,
} from "@/lib/auth";
import { z } from "zod";
import { guestFormSchema } from "@/lib/validations";
import {
  createGuest,
  updateGuest,
  updateGuestGroup,
  updateGuestTable,
  deleteGuest,
  markSent,
  listGuests,
} from "@/lib/guests";
import { autoAssign, seatsUsedBy } from "@/lib/pricing";

export type LoginState = { error: string } | null;

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  if (!checkPassword(password)) {
    return { error: "Contraseña incorrecta." };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });

  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

export async function toggleSent(id: string, sent: boolean) {
  await markSent(id, sent);
  revalidatePath("/admin");
}

/** Cambio rápido de grupo desde la tabla. */
export async function setGuestGroup(id: string, group: string) {
  const parsed = z
    .enum(["familia", "amigos", "trabajo", "otros"])
    .safeParse(group);
  if (!parsed.success) return { ok: false as const };
  await updateGuestGroup(id, parsed.data);
  revalidatePath("/admin");
  return { ok: true as const };
}

/** Asignación rápida de mesa desde la tabla. */
export async function setGuestTable(id: string, table: string) {
  await updateGuestTable(id, table || null);
  revalidatePath("/admin");
  return { ok: true as const };
}

/** Distribuye automáticamente a quienes no tienen mesa, respetando el cupo. */
export async function autoAssignTables(capacities: Record<string, number>) {
  const guests = await listGuests();
  const asignaciones = autoAssign(guests, capacities);
  const ids = Object.keys(asignaciones);

  for (const id of ids) {
    await updateGuestTable(id, asignaciones[id]);
  }

  const sinCupo =
    guests.filter((g) => !g.table_name && seatsUsedBy(g) > 0).length - ids.length;

  revalidatePath("/admin");
  return { ok: true as const, asignados: ids.length, sinCupo };
}

/** Quita la mesa a todas las invitaciones (para volver a empezar). */
export async function clearAllTables() {
  const guests = await listGuests();
  for (const g of guests) {
    if (g.table_name) await updateGuestTable(g.id, null);
  }
  revalidatePath("/admin");
  return { ok: true as const };
}

export type GuestActionState = { ok: boolean; error?: string };

export async function saveGuest(
  id: string | null,
  formData: FormData
): Promise<GuestActionState> {
  let companions: unknown = [];
  try {
    companions = JSON.parse(String(formData.get("companions") ?? "[]"));
  } catch {
    companions = [];
  }

  const parsed = guestFormSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone") ?? "",
    group: formData.get("group") ?? "otros",
    table_name: formData.get("table_name") ?? "",
    meal: formData.get("meal") ?? "",
    companions,
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  // Teléfono colombiano: guarda con prefijo 57 si viene sin él.
  const digits = parsed.data.phone.replace(/[^\d]/g, "");
  const phone = digits ? (digits.startsWith("57") ? digits : "57" + digits) : "";

  try {
    const payload = { ...parsed.data, phone };
    if (id) {
      await updateGuest(id, payload);
    } else {
      await createGuest(payload);
    }
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "No se pudo guardar.",
    };
  }
}

export async function removeGuest(id: string): Promise<GuestActionState> {
  try {
    await deleteGuest(id);
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "No se pudo eliminar.",
    };
  }
}
