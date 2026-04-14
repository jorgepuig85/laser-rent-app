"use client";

import Link from "next/link";
import Image from "next/image";
import { NavbarAuth } from "./NavbarAuth";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[--seasonal-primary]/20 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="https://pbvxslvihypfblbfyqle.supabase.co/storage/v1/object/public/equipos_imagenes/logo-laser-rent.svg"
            alt="Centro de Belleza Logo"
            width={150}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6 text-sm font-medium">
          <Link href="/equipos" className="hidden sm:inline-flex transition-colors hover:text-[--seasonal-primary]">
            Equipos
          </Link>
          <Link href="/precios" className="hidden sm:inline-flex transition-colors hover:text-[--seasonal-primary]">
            Precios
          </Link>

          <NavbarAuth />
        </nav>
      </div>
    </header>
  );
}
