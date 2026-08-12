import { UserPlus } from "lucide-react";
import { listGuests, computeStats } from "@/lib/guests";
import { isDemoMode } from "@/lib/utils";
import { StatsCards } from "@/components/admin/stats-cards";
import { GuestsTable } from "@/components/admin/guests-table";
import { CostSummary } from "@/components/admin/cost-summary";
import { TablesBoard } from "@/components/admin/tables-board";
import { GuestFormDialog } from "@/components/admin/guest-form-dialog";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const guests = await listGuests();
  const stats = computeStats(guests);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl leading-tight">Invitados</h1>
          <p className="text-sm text-muted-foreground">
            Registra invitados, gestiona confirmaciones y envíos.
          </p>
        </div>
        <GuestFormDialog
          trigger={
            <Button variant="gold">
              <UserPlus className="size-4" /> Añadir invitado
            </Button>
          }
        />
      </div>

      {isDemoMode() && (
        <div className="rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-foreground">
          <b>Modo demo.</b> Los invitados que registres aquí se guardan solo
          temporalmente. Conecta Supabase (ver <code>README.md</code>) y pon{" "}
          <code>NEXT_PUBLIC_DEMO_MODE=false</code> para guardarlos de forma permanente.
        </div>
      )}

      <StatsCards stats={stats} />
      <GuestsTable guests={guests} />
      <CostSummary guests={guests} />
      <TablesBoard guests={guests} />
    </div>
  );
}
