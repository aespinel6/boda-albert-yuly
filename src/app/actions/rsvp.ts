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
    adults: formData.get("adults") ?? 0,
    children: formData.get("children") ?? 0,
    message: formData.get("message") ?? "",
    dietary: formData.get("dietary") ?? "",
  });

  if (!parsed.success) {
    return { ok: false, error: "Revisa los datos e inténtalo de nuevo." };
  }

  const guest = await getGuestByToken(parsed.data.token);
  if (!guest) {
    return { ok: false, error: "No encontramos tu invitación." };
  }

  // Validación de cupos: al menos 1 adulto y sin exceder los pases permitidos
  let adults = 0;
  let children = 0;
  if (parsed.data.attending) {
    adults = Math.min(Math.max(parsed.data.adults, 1), guest.allowed_guests);
    children = Math.min(
      Math.max(parsed.data.children, 0),
      guest.allowed_guests - adults
    );
  }

  try {
    await saveRsvp({
      token: parsed.data.token,
      attending: parsed.data.attending,
      adults,
      children,
      message: parsed.data.message,
      dietary: parsed.data.dietary,
    });
    revalidatePath(`/i/${parsed.data.token}`);
    revalidatePath("/admin");
    return { ok: true, attending: parsed.data.attending };
  } catch {
    return { ok: false, error: "No se pudo guardar tu confirmación. Intenta de nuevo." };
  }
}
