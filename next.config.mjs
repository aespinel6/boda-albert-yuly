/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Calidades usadas en la app (requerido desde Next 16)
    qualities: [60, 75, 80, 82, 90],
    remotePatterns: [
      // Supabase Storage (álbum colaborativo / fotos subidas)
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // permite subir fotos al álbum
    },
  },
};

export default nextConfig;
