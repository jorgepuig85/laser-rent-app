import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-12 bg-slate-50 relative z-10">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Columna 1: Branding & Missión */}
          <div className="space-y-6">
            <Image
              src="https://pbvxslvihypfblbfyqle.supabase.co/storage/v1/object/public/equipos_imagenes/logo-laser-rent.svg"
              alt="Centro de Belleza Logo"
              width={150}
              height={40}
              className="h-10 w-auto opacity-90"
            />
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Nuestra misión es potenciar los centros de estética de La Pampa brindando tecnología láser de vanguardia con un soporte técnico y logístico inigualable en Santa Rosa y Miguel Riglos.
            </p>
          </div>

          {/* Columna 2: Quick Links & Zones */}
          <div className="space-y-6">
            <h3 className="text-slate-900 font-bold uppercase tracking-wider text-xs">Zonas de Cobertura</h3>
            <nav className="flex flex-col gap-3">
              <span className="text-sm font-semibold text-slate-800">Santa Rosa</span>
              <span className="text-sm font-semibold text-slate-800">Miguel Riglos</span>
              <div className="pt-4 flex flex-col gap-3">
                <Link href="/equipos" className="text-sm text-slate-500 hover:text-[--seasonal-primary] transition-colors w-fit font-medium">Equipos</Link>
                <Link href="/precios" className="text-sm text-slate-500 hover:text-[--seasonal-primary] transition-colors w-fit font-medium">Precios</Link>
                <span className="text-sm text-slate-300 cursor-not-allowed w-fit font-medium">Preguntas Frecuentes (Próximamente)</span>
              </div>
            </nav>
          </div>

          {/* Columna 3: Contacto & Socials */}
          <div className="space-y-6">
            <h3 className="text-slate-900 font-bold uppercase tracking-wider text-xs">Contacto</h3>
            <div className="flex flex-col gap-4">
              <Link 
                href="https://wa.me/5492954631456" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-slate-500 hover:text-green-600 transition-colors w-fit"
              >
                <Phone className="h-4 w-4 text-[--seasonal-primary]" />
                <span className="text-sm font-semibold text-slate-600">+54 9 2954 631456</span>
              </Link>
              <Link 
                href="mailto:notificaciones@centrodebelleza.com.ar"
                className="flex items-center gap-3 text-slate-500 hover:text-[--seasonal-primary] transition-colors w-fit"
              >
                <Mail className="h-4 w-4 text-[--seasonal-primary]" />
                <span className="text-sm text-slate-600">notificaciones@centrodebelleza.com.ar</span>
              </Link>
              <div className="flex items-start gap-3 text-slate-500">
                <MapPin className="h-4 w-4 text-[--seasonal-primary] shrink-0" />
                <span className="text-sm text-slate-600">Sede Central: Santa Rosa, La Pampa.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-xs font-medium">
            © 2026 Centro de Belleza. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <Link href="/terminos" className="text-slate-400 hover:text-[--seasonal-primary] text-xs transition-colors">Términos</Link>
            <Link href="/privacidad" className="text-slate-400 hover:text-[--seasonal-primary] text-xs transition-colors">Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
