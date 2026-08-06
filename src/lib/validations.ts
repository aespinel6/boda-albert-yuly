import { z } from "zod";

export const rsvpSchema = z.object({
  token: z.string().min(1),
  attending: z.boolean(),
  adults: z.coerce.number().int().min(0).max(40),
  children: z.coerce.number().int().min(0).max(40),
  message: z.string().max(500).optional().or(z.literal("")),
  dietary: z.string().max(300).optional().or(z.literal("")),
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
  adults: z.coerce.number().int().min(1, "Mínimo 1 adulto").max(20).default(1),
  children: z.coerce.number().int().min(0).max(20).default(0),
});

export type GuestFormValues = z.infer<typeof guestFormSchema>;
