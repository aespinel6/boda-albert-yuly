"use client";

import { useState, useTransition } from "react";
import { Trash2, Check, X, Loader2 } from "lucide-react";
import { removeGuest } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";

export function DeleteGuestButton({ id, name }: { id: string; name: string }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <span className="hidden text-xs text-muted-foreground sm:inline">¿Eliminar?</span>
        <Button
          variant="destructive"
          size="icon"
          className="size-8"
          disabled={pending}
          title={`Eliminar a ${name}`}
          onClick={() =>
            startTransition(async () => {
              await removeGuest(id);
              setConfirming(false);
            })
          }
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          disabled={pending}
          onClick={() => setConfirming(false)}
          title="Cancelar"
        >
          <X className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-8 text-muted-foreground hover:text-destructive"
      onClick={() => setConfirming(true)}
      title={`Eliminar a ${name}`}
    >
      <Trash2 className="size-4" />
    </Button>
  );
}
