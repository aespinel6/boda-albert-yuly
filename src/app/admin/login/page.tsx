"use client";

import { useActionState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";
import { login, type LoginState } from "@/app/actions/admin";
import { Monogram } from "@/components/invitation/monogram";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/admin";
  const [state, action, pending] = useActionState<LoginState, FormData>(login, null);

  return (
    <form action={action} className="w-full max-w-sm">
      <input type="hidden" name="next" value={next} />
      <label htmlFor="password" className="text-sm font-medium text-foreground">
        Contraseña del panel
      </label>
      <Input
        id="password"
        name="password"
        type="password"
        autoFocus
        required
        placeholder="••••••••"
        className="mt-2"
      />
      {state?.error && <p className="mt-2 text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} className="mt-5 w-full">
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
        Entrar
      </Button>
    </form>
  );
}

export default function AdminLogin() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-twilight px-6 text-white">
      <Monogram tone="light" />
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <h1 className="text-center font-serif text-2xl">Panel de administración</h1>
        <p className="mt-1 text-center text-sm text-white/60">Albert &amp; Yuly</p>
        <div className="mt-6 [&_label]:text-white [&_input]:border-white/20 [&_input]:bg-white/5 [&_input]:text-white [&_input]:placeholder:text-white/40">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
