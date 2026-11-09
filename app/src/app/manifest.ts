import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bite · Delivery a tu salón",
    short_name: "Bite",
    description: "Pide a los locales del campus y recibe tu comida en tu salón.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf8f5",
    theme_color: "#ff5b14",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
