import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "T3 Professional PWA",
    short_name: "T3PWA",
    description: "Production grade T3 Stack Progressive Web App",
    start_url: "/",
    display: "standalone",
    background_color: "#07111f",
    theme_color: "#0ea5e9",
    icons: [
      { src: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
