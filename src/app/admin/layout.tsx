import { LogOut } from "lucide-react";
import { logout } from "@/app/actions/admin";
import { Providers } from "@/components/providers";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-20 border-b border-border bg-twilight text-white">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-serif text-xl leading-none tracking-wide">
                A<span className="italic text-gold-light">&amp;</span>Y
              </span>
              <span className="h-6 w-px bg-white/20" />
              <div>
                <p className="text-sm font-medium leading-none">Albert &amp; Yuly</p>
                <p className="text-xs text-white/60">Panel de administración</p>
              </div>
            </div>
            <form action={logout}>
              <Button
                variant="ghost"
                size="sm"
                type="submit"
                className="text-white/80 hover:bg-white/10 hover:text-white"
              >
                <LogOut className="size-4" /> Salir
              </Button>
            </form>
          </div>
        </header>
        <div className="container py-8">{children}</div>
      </div>
    </Providers>
  );
}
