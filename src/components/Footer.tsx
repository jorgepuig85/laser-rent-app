import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-16 bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Columna 1: Branding & Missión */}
          <div className="space-y-6">
            <Image
              src="https://pbvxslvihypfblbfyqle.supabase.co/storage/v1/object/public/equipos_imagenes/logo-laser-rent.svg"
              alt="Laser Rent Logo"
              width={150}
              height={40}
              className="h-10 w-auto opacity-90"
            />
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Nuestra misión es potenciar los centros de estética de La Pampa brindando tecnología láser de vanguardia con un soporte técnico y logístico inigualable.
            </p>
          </div>

          {/* Columna 2: Quick Links */}
          <div className="space-y-6">
            <h3 className="text-slate-900 font-bold uppercase tracking-wider text-xs">Acceso Rápido</h3>
            <nav className="flex flex-col gap-3">
              <Link href="/equipos" className="text-sm text-slate-500 hover:text-blue-600 transition-colors w-fit">Nuestros Equipos</Link>
              <Link href="/precios" className="text-sm text-slate-500 hover:text-blue-600 transition-colors w-fit">Planes de Alquiler</Link>
              <Link href="/alquiler" className="text-sm text-slate-500 hover:text-blue-600 transition-colors w-fit">Calendario de Reservas</Link>
              <Link href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors w-fit">Preguntas Frecuentes</Link>
            </nav>
          </div>

          {/* Columna 3: Contacto */}
          <div className="space-y-6">
            <h3 className="text-slate-900 font-bold uppercase tracking-wider text-xs">Contacto Institucional</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-slate-500">
                <Mail className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-slate-600">info@laserrent.com.ar</span>
              </div>
              <Link 
                href="https://wa.me/5492954631456" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-slate-500 hover:text-green-600 transition-colors w-fit"
              >
                <Phone className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-semibold text-slate-600">+54 9 2954 631456</span>
              </Link>
              <div className="flex items-start gap-3 text-slate-500">
                <MapPin className="h-4 w-4 text-blue-600 shrink-0" />
                <span className="text-sm text-slate-600">Santa Rosa, La Pampa. Cobertura en toda la provincia.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-xs">
            © {new Date().getFullYear()} Laser Rent. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-slate-400 hover:text-blue-600 text-xs transition-colors">Términos y Condiciones</Link>
            <Link href="#" className="text-slate-400 hover:text-blue-600 text-xs transition-colors">Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
