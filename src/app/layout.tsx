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
  metadataBase: new URL("https://centrodebelleza.com.ar"), // Fallback base URL for metadata
  icons: {
    icon: "https://aftweonqhxvbcujexyre.supabase.co/storage/v1/object/public/equipos_imagenes/favicon.png",
  },
  openGraph: {
    title: "Centro de Belleza | Depilación Láser",
    description: "Expertos en depilación láser Soprano y ADSS en La Pampa. Tecnología de punta y soporte profesional.",
    url: "https://centro-de-belleza.vercel.app",
    siteName: "Centro de Belleza",
    images: [
      {
        url: "https://aftweonqhxvbcujexyre.supabase.co/storage/v1/object/public/equipos_imagenes/hero-profesional.webp",
        width: 1200,
        height: 630,
        alt: "Centro de Belleza - Depilación Láser",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Centro de Belleza | Depilación Láser",
    description: "Tecnología de punta Soprano y ADSS en La Pampa.",
    images: ["https://aftweonqhxvbcujexyre.supabase.co/storage/v1/object/public/equipos_imagenes/hero-profesional.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://aftweonqhxvbcujexyre.supabase.co" />
      </head>
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
