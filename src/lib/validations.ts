import { z } from "zod";

export const rsvpSchema = z.object({
  token: z.string().min(1),
  mode: z.enum(["presencial", "virtual", "no"]),
  /** Nombres marcados (deben existir en la lista fija del invitado). */
  attendees: z.array(z.string().min(1)).max(40),
});

export type RsvpValues = z.infer<typeof rsvpSchema>;

export const guestFormSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(120),
  phone: z
    .string()
    .max(20)
    .optional()
    .or(z.literal(""))
    .default(""),
  group: z.enum(["familia", "amigos", "trabajo", "otros"]).default("otros"),
  companions: z
    .array(
      z.object({
        name: z.string().min(1).max(120),
        kind: z.enum(["adult", "child"]),
      })
    )
    .max(20)
    .default([]),
});

export type GuestFormValues = z.infer<typeof guestFormSchema>;
