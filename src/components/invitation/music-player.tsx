"use client";

import { useEffect, useRef, useState } from "react";
import { Music, VolumeX } from "lucide-react";
import { wedding } from "@/lib/config";

/**
 * Música de fondo con botón de silencio.
 * Los navegadores móviles no permiten reproducir sin una interacción previa,
 * así que arranca en silencio y suena con el primer toque en la invitación.
 */
export function MusicPlayer() {
  const audio = useRef<HTMLAudioElement>(null);
  const [sonando, setSonando] = useState(false);
  const [listo, setListo] = useState(false);
  /** El usuario apagó la música a mano: no volver a arrancarla sola. */
  const apagadaPorElUsuario = useRef(false);

  // Solo el PRIMER toque/scroll intenta arrancar la música. Después de eso
  // (o si el invitado la silencia) nunca vuelve a activarse sola.
  useEffect(() => {
    const arrancar = () => {
      const el = audio.current;
      if (!el || apagadaPorElUsuario.current || !el.paused) return;
      el.volume = 0.35;
      el.play()
        .then(() => setSonando(true))
        .catch(() => {
          /* el navegador lo bloqueó: queda el botón para activarlo */
        });
    };
    const opts = { once: true, passive: true } as const;
    window.addEventListener("pointerdown", arrancar, opts);
    window.addEventListener("touchstart", arrancar, opts);
    window.addEventListener("scroll", arrancar, { ...opts, capture: true });
    setListo(true);
    return () => {
      window.removeEventListener("pointerdown", arrancar);
      window.removeEventListener("touchstart", arrancar);
      window.removeEventListener("scroll", arrancar, true);
    };
  }, []);

  function alternar() {
    const el = audio.current;
    if (!el) return;
    if (!el.paused) {
      apagadaPorElUsuario.current = true; // decisión del invitado: se respeta
      el.pause();
      setSonando(false);
    } else {
      apagadaPorElUsuario.current = false;
      el.volume = 0.35;
      el.play()
        .then(() => setSonando(true))
        .catch(() => setSonando(false));
    }
  }

  return (
    <>
      <audio ref={audio} src={wedding.music.src} loop preload="auto" />
      {listo && (
        <button
          type="button"
          onClick={alternar}
          aria-label={sonando ? "Silenciar música" : "Activar música"}
          title={sonando ? "Silenciar música" : "Activar música"}
          className="fixed right-4 top-[max(1rem,env(safe-area-inset-top))] z-50 flex size-11 items-center justify-center rounded-full border border-white/25 bg-twilight/55 text-gold-light shadow-lg backdrop-blur-md transition-colors hover:bg-twilight/75"
        >
          {sonando ? (
            <Music className="size-[18px] animate-pulse" />
          ) : (
            <VolumeX className="size-[18px]" />
          )}
        </button>
      )}
    </>
  );
}
