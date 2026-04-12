import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alquiler de Depilación Láser en Santa Rosa, La Pampa | Laser Rent",
  description: "Líderes en alquiler de equipos de depilación láser Soprano en La Pampa. Tecnología de punta, soporte técnico y capacitación para tu centro de estética.",
  icons: {
    icon: "https://pbvxslvihypfblbfyqle.supabase.co/storage/v1/object/public/equipos_imagenes/favicon.png",
  },
};

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased flex min-h-screen flex-col bg-white`}
      >
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
