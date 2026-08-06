import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Albert & Yuly — Nuestra boda",
    short_name: "Albert & Yuly",
    description: "Invitación digital de boda · 26 de septiembre de 2026",
    start_url: "/",
    display: "standalone",
    background_color: "#1C2740",
    theme_color: "#1C2740",
    orientation: "portrait",
    icons: [
      { src: "/icons/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icons/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
