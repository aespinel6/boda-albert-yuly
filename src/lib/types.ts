/** `virtual` = nos acompaña en línea: cuenta como asistente pero NO ocupa plato. */
export type GuestStatus = "pending" | "confirmed" | "declined" | "virtual";

export type GuestGroup = "familia" | "amigos" | "trabajo" | "otros";

/** Persona del grupo del invitado (el primero es el invitado principal). */
export interface PartyMember {
  name: string;
  kind: "adult" | "child";
  /** Si asistirá. Antes de confirmar todos vienen en true (preseleccionados). */
  attending: boolean;
  /** Id del plato asignado (ver `wedding.meals`). Si falta, se usa el de por defecto. */
  meal?: string;
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
  /** Mesa asignada en el salón (ver `wedding.tables`). */
  table_name: string | null;
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

/** Respuesta del invitado: presencial, en línea, o no asiste. */
export type RsvpMode = "presencial" | "virtual" | "no";

/** Datos que envía el formulario RSVP */
export interface RsvpInput {
  token: string;
  mode: RsvpMode;
  /** Nombres (de la lista fija) que sí asistirán. */
  attendees: string[];
}

export interface DashboardStats {
  total: number;
  confirmed: number;
  pending: number;
  declined: number;
  virtual: number; // invitaciones que nos acompañan en línea
  totalAttendees: number; // personas confirmadas presencialmente
  virtualAttendees: number; // personas que se conectan (sin plato)
  sent: number;
  /** Invitaciones ya ubicadas en una mesa. */
  seated: number;
  /** Invitaciones que todavia no tienen mesa (excluye a los que no asisten). */
  unseated: number;
}
