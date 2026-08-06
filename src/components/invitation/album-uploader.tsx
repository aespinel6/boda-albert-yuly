"use client";

import { useActionState, useRef } from "react";
import { Upload, Loader2, CheckCircle2 } from "lucide-react";
import { uploadAlbumPhotos, type UploadState } from "@/app/actions/album";
import { Button } from "@/components/ui/button";

export function AlbumUploader({ token }: { token: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState<UploadState, FormData>(
    uploadAlbumPhotos,
    null
  );

  return (
    <form ref={formRef} action={action} className="flex flex-col items-center gap-4">
      <input type="hidden" name="token" value={token} />
      <label className="flex w-full max-w-md cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-white/25 bg-white/5 px-6 py-10 text-center text-white/80 transition-colors hover:border-gold/50 hover:bg-white/10">
        <Upload className="size-8 text-gold-light" />
        <span className="font-medium">Toca para elegir tus fotos</span>
        <span className="text-xs text-white/50">Puedes seleccionar varias a la vez</span>
        <input
          type="file"
          name="photos"
          accept="image/*"
          multiple
          className="hidden"
          onChange={() => formRef.current?.requestSubmit()}
        />
      </label>

      {pending && (
        <span className="inline-flex items-center gap-2 text-sm text-white/80">
          <Loader2 className="size-4 animate-spin" /> Subiendo fotos…
        </span>
      )}
      {state?.ok && (
        <span className="inline-flex items-center gap-1.5 text-sm text-emerald-300">
          <CheckCircle2 className="size-4" /> ¡Gracias! Subiste {state.count} foto(s).
        </span>
      )}
      {state?.ok === false && (
        <span className="text-sm text-gold-light">{state.error}</span>
      )}
    </form>
  );
}
