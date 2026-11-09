import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Simulator } from "@/components/Simulator";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bite · Delivery a tu salón",
  description:
    "La primera app de delivery escolar: pide a los locales del campus y recibe tu comida en tu salón.",
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  appleWebApp: { capable: true, title: "Bite", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#ff5b14",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-MX" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        {children}
        <Simulator />
      </body>
    </html>
  );
}
