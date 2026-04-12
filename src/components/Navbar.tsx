import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabaseServer";
import { signIn, signOut } from "@/app/auth/actions";
import { LogOut, UserCircle } from "lucide-react";

import { LoginRedirectInput } from "./LoginRedirectInput";
import { Suspense } from "react";

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
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
          <Link href="/equipos" className="hidden sm:inline-flex transition-colors hover:text-primary">
            Equipos
          </Link>
          <Link href="/precios" className="hidden sm:inline-flex transition-colors hover:text-primary">
            Precios
          </Link>

          {user ? (
            <div className="flex items-center gap-4 border-l pl-4 ml-2">
              <Link href="/alquiler" className="transition-colors font-semibold text-slate-800 hover:text-primary">
                Alquilar
              </Link>
              <Link href="/dashboard" className="transition-colors hover:text-primary hidden sm:block">
                Reservas
              </Link>
              <form action={signOut}>
                <Button variant="ghost" size="sm" type="submit" className="text-slate-600 hover:text-red-600 transition-colors">
                  <LogOut className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Salir</span>
                </Button>
              </form>
            </div>
          ) : (
            <form action={signIn}>
              <Suspense fallback={null}>
                <LoginRedirectInput />
              </Suspense>
              <Button type="submit" className="bg-slate-900 text-white rounded-full px-6">
                <UserCircle className="mr-2 h-4 w-4" />
                Login Profesional
              </Button>
            </form>
          )}
        </nav>
      </div>
    </header>
  );
}
