import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Handful Recipes",
    short_name: "Handful",
    description: "Some recipes were never written.",
    start_url: "/",
    display: "standalone",
    background_color: "#FCF7EF",
    theme_color: "#93452F",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
