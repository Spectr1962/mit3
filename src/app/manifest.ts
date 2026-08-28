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
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
  };
}
