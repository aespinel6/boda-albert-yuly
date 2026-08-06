"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  ADMIN_COOKIE,
  checkPassword,
  createSessionToken,
} from "@/lib/auth";
import { guestFormSchema } from "@/lib/validations";
import {
  createGuest,
  updateGuest,
  deleteGuest,
  markSent,
} from "@/lib/guests";

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

export type GuestActionState = { ok: boolean; error?: string };

export async function saveGuest(
  id: string | null,
  formData: FormData
): Promise<GuestActionState> {
  const parsed = guestFormSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone") ?? "",
    group: formData.get("group") ?? "otros",
    adults: formData.get("adults") ?? 1,
    children: formData.get("children") ?? 0,
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  try {
    if (id) {
      await updateGuest(id, parsed.data);
    } else {
      await createGuest(parsed.data);
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
