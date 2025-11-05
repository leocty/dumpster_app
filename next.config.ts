import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Ignora errores de ESLint durante el build en producción
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Opcional: también puedes ignorar errores de TypeScript
    // ignoreBuildErrors: true,
  },
};

export default nextConfig;
