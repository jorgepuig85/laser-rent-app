"use client";

import Link from "next/link";
import Image from "next/image";
import { NavbarAuth } from "./NavbarAuth";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[--seasonal-primary]/20 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="https://aftweonqhxvbcujexyre.supabase.co/storage/v1/object/public/equipos_imagenes/logo-laser-rent.svg"
            alt="Centro de Belleza Logo"
            width={150}
            height={40}
            className="h-10 w-auto"
            priority
            sizes="150px"
          />
        </Link>
        <nav className="hidden md:flex items-center gap-4 sm:gap-6 text-sm font-medium">
          <Link href="/equipos" className="transition-colors hover:text-[--seasonal-primary]">
            Equipos
          </Link>
          <Link href="/precios" className="transition-colors hover:text-[--seasonal-primary]">
            Precios
          </Link>
          <NavbarAuth />
        </nav>

        {/* Hamburger Menu Button */}
        <div className="flex items-center md:hidden gap-2">
          <NavbarAuth isMobileView={true} onCloseMenu={() => setIsMobileMenuOpen(false)} />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Abrir menú de navegación"
            className="p-2 text-stone-600 hover:text-[--seasonal-primary] transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-[--seasonal-primary]/20 shadow-lg p-4 flex flex-col gap-4">
          <Link 
            href="/equipos" 
            className="text-stone-800 font-medium py-2 border-b border-stone-100"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Equipos
          </Link>
          <Link 
            href="/precios" 
            className="text-stone-800 font-medium py-2 border-b border-stone-100"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Precios
          </Link>
          
          <div className="pt-2">
            <NavbarAuth 
              isMobileMenu={true} 
              onCloseMenu={() => setIsMobileMenuOpen(false)} 
            />
          </div>
        </div>
      )}
    </header>
  );
}
