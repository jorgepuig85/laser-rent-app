import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Centro de Belleza | Depilación Láser en Santa Rosa y Miguel Riglos",
  description: "Expertos en depilación láser Soprano y ADSS en La Pampa. Tecnología de punta, soporte técnico y capacitación profesional en Santa Rosa y Miguel Riglos.",
  icons: {
    icon: "https://pbvxslvihypfblbfyqle.supabase.co/storage/v1/object/public/equipos_imagenes/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased flex min-h-screen flex-col bg-white overflow-x-hidden`}
      >
        <Providers>
          <Navbar />
          <main className="flex-1 transition-colors duration-1000">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
