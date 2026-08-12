import { Users, Check, Clock, X, UserCheck, Send, Video, Armchair } from "lucide-react";
import type { DashboardStats } from "@/lib/types";

export function StatsCards({ stats }: { stats: DashboardStats }) {
  const pct = (n: number) => (stats.total ? Math.round((n / stats.total) * 100) : 0);

  const cards = [
    { label: "Invitados", value: stats.total, Icon: Users, tint: "text-mirror", bar: "bg-mirror", width: 100 },
    { label: "Confirmados", value: stats.confirmed, Icon: Check, tint: "text-emerald-600", bar: "bg-emerald-500", width: pct(stats.confirmed) },
    { label: "Virtuales", value: stats.virtual, Icon: Video, tint: "text-mirror", bar: "bg-mirror", width: pct(stats.virtual) },
    { label: "Pendientes", value: stats.pending, Icon: Clock, tint: "text-gold", bar: "bg-gold", width: pct(stats.pending) },
    { label: "No asisten", value: stats.declined, Icon: X, tint: "text-destructive", bar: "bg-destructive", width: pct(stats.declined) },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      {cards.map(({ label, value, Icon, tint, bar, width }) => (
        <div
          key={label}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-center gap-2">
            <span className={`flex size-8 items-center justify-center rounded-lg bg-muted ${tint}`}>
              <Icon className="size-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {label}
            </span>
          </div>
          <p className="mt-3 font-serif text-4xl tabular-nums leading-none">{value}</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className={`h-full rounded-full ${bar}`} style={{ width: `${width}%` }} />
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">{pct(value)}% del total</p>
        </div>
      ))}

      <div className="col-span-2 grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-4">
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-gradient-to-br from-twilight to-twilight-soft p-5 text-white shadow-sm">
          <span className="flex size-11 flex-none items-center justify-center rounded-xl bg-white/10 text-gold-light">
            <UserCheck className="size-5" />
          </span>
          <div>
            <p className="text-sm text-white/70">Asistentes confirmados (con acompañantes)</p>
            <p className="font-serif text-3xl tabular-nums">{stats.totalAttendees} personas</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <span className="flex size-11 flex-none items-center justify-center rounded-xl bg-mirror/15 text-mirror">
            <Video className="size-5" />
          </span>
          <div>
            <p className="text-sm text-muted-foreground">Nos ven en línea (sin plato)</p>
            <p className="font-serif text-3xl tabular-nums">
              {stats.virtualAttendees} personas
            </p>
          </div>
        </div>

        <div
          className={`flex items-center gap-4 rounded-2xl border p-5 shadow-sm ${
            stats.unseated > 0
              ? "border-gold/40 bg-gold/5"
              : "border-emerald-500/40 bg-emerald-500/5"
          }`}
        >
          <span
            className={`flex size-11 flex-none items-center justify-center rounded-xl ${
              stats.unseated > 0
                ? "bg-gold/15 text-gold"
                : "bg-emerald-500/15 text-emerald-600"
            }`}
          >
            <Armchair className="size-5" />
          </span>
          <div>
            <p className="text-sm text-muted-foreground">
              {stats.unseated > 0
                ? `Ubicados en mesa · faltan ${stats.unseated}`
                : "Todos ubicados en mesa"}
            </p>
            <p className="font-serif text-3xl tabular-nums">
              {stats.seated}{" "}
              <span className="text-xl text-muted-foreground">/ {stats.total}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <span className="flex size-11 flex-none items-center justify-center rounded-xl bg-gold/10 text-gold">
            <Send className="size-5" />
          </span>
          <div>
            <p className="text-sm text-muted-foreground">Invitaciones enviadas</p>
            <p className="font-serif text-3xl tabular-nums">
              {stats.sent} <span className="text-xl text-muted-foreground">/ {stats.total}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
