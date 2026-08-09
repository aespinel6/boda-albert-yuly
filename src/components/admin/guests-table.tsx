"use client";

import { useMemo, useState, useTransition } from "react";
import {
  Search, Download, MessageCircle, Check, Copy, Users2, Pencil,
} from "lucide-react";
import type { Guest, GuestStatus } from "@/lib/types";
import {
  whatsappLink, whatsappMessage, invitationUrl, formatDateTime, firstName,
} from "@/lib/utils";
import { toggleSent } from "@/app/actions/admin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GuestFormDialog } from "./guest-form-dialog";
import { DeleteGuestButton } from "./delete-guest-button";

const STATUS_LABEL: Record<GuestStatus, string> = {
  confirmed: "Confirmó",
  pending: "Pendiente",
  declined: "No asiste",
};
const STATUS_VARIANT: Record<GuestStatus, "confirmed" | "pending" | "declined"> = {
  confirmed: "confirmed",
  pending: "pending",
  declined: "declined",
};

type StatusFilter = "all" | GuestStatus;

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function GuestsTable({ guests }: { guests: Guest[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [group, setGroup] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const groups = useMemo(
    () => Array.from(new Set(guests.map((g) => g.group))),
    [guests]
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return guests
      .filter((g) => {
        if (status !== "all" && g.status !== status) return false;
        if (group !== "all" && g.group !== group) return false;
        if (q && !g.name.toLowerCase().includes(q) && !(g.phone ?? "").includes(q))
          return false;
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" }));
  }, [guests, query, status, group]);

  function sendWhatsapp(g: Guest) {
    const link = whatsappLink(g.phone, whatsappMessage(g.name, g.token));
    window.open(link, "_blank", "noopener");
    if (!g.sent) startTransition(() => toggleSent(g.id, true));
  }

  async function copyLink(g: Guest) {
    await navigator.clipboard.writeText(invitationUrl(g.token));
    setCopiedId(g.id);
    setTimeout(() => setCopiedId((c) => (c === g.id ? null : c)), 1800);
  }

  async function exportExcel() {
    const XLSX = await import("xlsx");
    const rows = filtered.map((g) => ({
      Nombre: g.name,
      Teléfono: g.phone ?? "",
      Grupo: g.group,
      Estado: STATUS_LABEL[g.status],
      "Cupos permitidos": g.allowed_guests,
      Asisten: g.companions ?? "",
      Restricción: g.dietary ?? "",
      Mensaje: g.message ?? "",
      Enviada: g.sent ? "Sí" : "No",
      "Confirmó el": formatDateTime(g.confirmed_at),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Invitados");
    XLSX.writeFile(wb, `invitados-boda-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  const statusFilters: Array<[StatusFilter, string]> = [
    ["all", "Todos"],
    ["confirmed", "Confirmados"],
    ["pending", "Pendientes"],
    ["declined", "No asisten"],
  ];

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      {/* Barra de herramientas */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre o teléfono"
            className="w-full pl-9 sm:w-64"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {statusFilters.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setStatus(key)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                status === key
                  ? "border-twilight bg-twilight text-white"
                  : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {groups.length > 1 && (
          <select
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            className="h-9 rounded-lg border border-border bg-background px-2.5 text-xs capitalize"
          >
            <option value="all">Todos los grupos</option>
            {groups.map((g) => (
              <option key={g} value={g} className="capitalize">
                {g}
              </option>
            ))}
          </select>
        )}

        <Button variant="outline" size="sm" className="ml-auto" onClick={exportExcel}>
          <Download className="size-4" /> Exportar
        </Button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="[&>th]:whitespace-nowrap [&>th]:px-4 [&>th]:py-3 [&>th]:text-left [&>th]:text-[11px] [&>th]:font-semibold [&>th]:uppercase [&>th]:tracking-wider [&>th]:text-muted-foreground">
              <th>Invitado</th>
              <th>Grupo</th>
              <th>Estado</th>
              <th className="text-center">Personas</th>
              <th>Mensaje</th>
              <th className="text-center">Enviada</th>
              <th className="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((g) => (
              <tr key={g.id} className="border-t border-border/70 transition-colors hover:bg-muted/40">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 flex-none items-center justify-center rounded-full bg-gold/15 text-xs font-semibold text-gold">
                      {initials(g.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{g.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {g.phone ?? "sin teléfono"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-md bg-muted px-2 py-0.5 text-xs capitalize text-muted-foreground">
                    {g.group}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={STATUS_VARIANT[g.status]}>{STATUS_LABEL[g.status]}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div
                    className={`flex items-center justify-center gap-1 tabular-nums ${
                      g.status === "confirmed" ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    <Users2 className="size-3.5 opacity-60" />
                    <span className="font-medium">{g.adults + g.children}</span>
                    <span className="text-xs opacity-70">
                      ({g.adults}A{g.children > 0 ? ` · ${g.children}N` : ""})
                    </span>
                  </div>
                </td>
                <td className="max-w-[180px] truncate px-4 py-3 text-muted-foreground" title={g.message ?? ""}>
                  {g.message || "—"}
                </td>
                <td className="px-4 py-3 text-center">
                  {g.sent ? (
                    <Check className="mx-auto size-4 text-emerald-600" />
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <GuestFormDialog
                      guest={g}
                      trigger={
                        <Button variant="ghost" size="icon" className="size-8" title="Editar">
                          <Pencil className="size-4" />
                        </Button>
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      title="Copiar enlace"
                      onClick={() => copyLink(g)}
                    >
                      {copiedId === g.id ? (
                        <Check className="size-4 text-emerald-600" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                    </Button>
                    <Button
                      variant="whatsapp"
                      size="sm"
                      disabled={pending}
                      onClick={() => sendWhatsapp(g)}
                      title={`Enviar a ${firstName(g.name)}`}
                    >
                      <MessageCircle className="size-4" />
                      <span className="hidden lg:inline">WhatsApp</span>
                    </Button>
                    <DeleteGuestButton id={g.id} name={g.name} />
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-14 text-center text-muted-foreground">
                  {guests.length === 0
                    ? "Aún no hay invitados. Añade el primero con el botón de arriba."
                    : "No hay invitados que coincidan con el filtro."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
        Mostrando {filtered.length} de {guests.length} invitados
      </div>
    </div>
  );
}
