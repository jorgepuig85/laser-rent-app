import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-tight">
            LaserRent Pro
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-primary">
            Inicio
          </Link>
          <Link href="/equipos" className="transition-colors hover:text-primary">
            Equipos
          </Link>
          <Link href="/precios" className="transition-colors hover:text-primary">
            Precios
          </Link>
          <Button className="hidden sm:inline-flex" render={<Link href="https://wa.me/5492954631456" target="_blank" rel="noopener noreferrer" />}>
            Contactar
          </Button>
        </nav>
      </div>
    </header>
  );
}
