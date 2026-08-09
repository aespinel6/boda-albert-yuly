"use server";

import { revalidatePath } from "next/cache";
import { rsvpSchema } from "@/lib/validations";
import { getGuestByToken, saveRsvp } from "@/lib/guests";

import type { RsvpMode } from "@/lib/types";

export type RsvpState =
  | { ok: true; mode: RsvpMode }
  | { ok: false; error: string }
  | null;

export async function submitRsvp(
  _prev: RsvpState,
  formData: FormData
): Promise<RsvpState> {
  const parsed = rsvpSchema.safeParse({
    token: formData.get("token"),
    mode: formData.get("mode"),
    attendees: formData.getAll("attendees").map(String),
  });

  if (!parsed.success) {
    return { ok: false, error: "Revisa los datos e inténtalo de nuevo." };
  }

  const guest = await getGuestByToken(parsed.data.token);
  if (!guest) {
    return { ok: false, error: "No encontramos tu invitación." };
  }

  // Solo se aceptan nombres de la lista fija: nadie puede sumar acompañantes.
  const allowed = new Set((guest.party ?? []).map((m) => m.name));
  const attendees = parsed.data.attendees.filter((n) => allowed.has(n));

  if (parsed.data.mode !== "no" && attendees.length === 0) {
    return { ok: false, error: "Marca al menos una persona." };
  }

  try {
    await saveRsvp({
      token: parsed.data.token,
      mode: parsed.data.mode,
      attendees,
    });
    revalidatePath(`/i/${parsed.data.token}`);
    revalidatePath("/admin");
    return { ok: true, mode: parsed.data.mode };
  } catch {
    return { ok: false, error: "No se pudo guardar tu confirmación. Intenta de nuevo." };
  }
}
