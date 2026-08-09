"use server";

import { revalidatePath } from "next/cache";
import { rsvpSchema } from "@/lib/validations";
import { getGuestByToken, saveRsvp } from "@/lib/guests";

export type RsvpState =
  | { ok: true; attending: boolean }
  | { ok: false; error: string }
  | null;

export async function submitRsvp(
  _prev: RsvpState,
  formData: FormData
): Promise<RsvpState> {
  const parsed = rsvpSchema.safeParse({
    token: formData.get("token"),
    attending: formData.get("attending") === "true",
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

  if (parsed.data.attending && attendees.length === 0) {
    return { ok: false, error: "Marca al menos una persona que asistirá." };
  }

  try {
    await saveRsvp({
      token: parsed.data.token,
      attending: parsed.data.attending,
      attendees,
    });
    revalidatePath(`/i/${parsed.data.token}`);
    revalidatePath("/admin");
    return { ok: true, attending: parsed.data.attending };
  } catch {
    return { ok: false, error: "No se pudo guardar tu confirmación. Intenta de nuevo." };
  }
}
