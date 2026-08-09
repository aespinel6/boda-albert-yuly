export type GuestStatus = "pending" | "confirmed" | "declined";

export type GuestGroup = "familia" | "amigos" | "trabajo" | "otros";

/** Persona del grupo del invitado (el primero es el invitado principal). */
export interface PartyMember {
  name: string;
  kind: "adult" | "child";
  /** Si asistirá. Antes de confirmar todos vienen en true (preseleccionados). */
  attending: boolean;
}

/** Fila de la tabla `guests` en Supabase */
export interface Guest {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  group: GuestGroup;
  allowed_guests: number; // cupos totales permitidos (= adults + children)
  adults: number; // adultos en el grupo del invitado
  children: number; // niños en el grupo del invitado
  /** Lista nominal fija: quiénes están invitados (principal + acompañantes). */
  party: PartyMember[];
  token: string;
  status: GuestStatus;
  sent: boolean; // invitación enviada por WhatsApp
  companions: number | null; // cuántos asistirán realmente
  message: string | null;
  dietary: string | null;
  confirmed_at: string | null;
  arrived: boolean; // llegó el día del evento
  created_at: string;
}

/** Datos que envía el formulario RSVP */
export interface RsvpInput {
  token: string;
  attending: boolean;
  /** Nombres (de la lista fija) que sí asistirán. */
  attendees: string[];
}

export interface DashboardStats {
  total: number;
  confirmed: number;
  pending: number;
  declined: number;
  totalAttendees: number; // suma de acompañantes confirmados
  sent: number;
}
