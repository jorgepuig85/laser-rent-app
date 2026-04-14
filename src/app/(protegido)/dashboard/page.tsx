import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import { format, parseISO, isFuture, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  LayoutGrid,
  MessageCircleHeart,
  Share2,
  FileText,
  ScrollText,
  Sparkles,
  Clock3,
} from "lucide-react";

import { CancelButton } from "./CancelButton";

const ADSS_IMAGE =
  "https://pbvxslvihypfblbfyqle.supabase.co/storage/v1/object/public/equipos_imagenes/equipo_depilacion.webp";

const WA_LINK =
  "https://wa.me/5492954631456?text=" +
  encodeURIComponent("Hola! Necesito asistencia con mi panel de reservas.");

// ── Resource cards data ──────────────────────────────────────────────────────
const RESOURCES = [
  {
    icon: Share2,
    label: "Material para Redes",
    desc: "Imágenes, videos y copy listo para publicar",
    href: "https://drive.google.com/drive/folders/1YourFolderIdHere", // TODO: Añadir link real
    color: "from-white to-[#FCFAf5]",
    iconColor: "text-[#B89B72]",
    border: "border-[#EAE3D5] hover:border-[#D4AF37]/40",
  },
  {
    icon: FileText,
    label: "Ficha Técnica",
    desc: "Especificaciones del equipo ADSS FG2000B",
    href: "/ficha-tecnica",
    color: "from-white to-[#FCFAf5]",
    iconColor: "text-[#B89B72]",
    border: "border-[#EAE3D5] hover:border-[#D4AF37]/40",
  },
  {
    icon: ScrollText,
    label: "Consentimientos Legales",
    desc: "Modelos de consentimiento para tus pacientes",
    href: "/consentimiento-paciente",
    color: "from-white to-[#FCFAf5]",
    iconColor: "text-[#B89B72]",
    border: "border-[#EAE3D5] hover:border-[#D4AF37]/40",
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/?error=necesitas-login");

  const { data: pro } = await supabase
    .from("external_professionals")
    .select("id, name")
    .eq("auth_id", user.id)
    .single();

  if (!pro) return redirect("/completar-perfil");

  const { data: rentals } = await supabase
    .from("rentals")
    .select("*")
    .eq("external_professional_id", pro.id)
    .order("start_date", { ascending: true });

  const allRentals = rentals ?? [];

  // Stats
  const today = new Date();
  const activeRentals = allRentals.filter((r) => isFuture(parseISO(r.end_date)));
  const nextRental = activeRentals[0] ?? null;
  const monthRentals = allRentals.filter((r) => {
    const d = parseISO(r.start_date);
    return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  });

  const firstName = pro.name?.split(" ")[0] ?? "Profesional";

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800">
      {/* ── Hero Header ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-b from-white to-[#FDFBF7] pt-28 pb-20 px-4 border-b border-[#EAE3D5]/50">
        {/* Decorative subtle orbs */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#D4AF37]/5 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 -left-16 h-64 w-64 rounded-full bg-[#D4AF37]/5 blur-[80px]" />

        <div className="mx-auto max-w-5xl relative z-10 flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-semibold tracking-widest text-[#B89B72] uppercase shadow-sm border border-[#EAE3D5]">
              <Sparkles className="h-3.5 w-3.5" />
              Panel VIP
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 leading-tight mb-4 tracking-tight">
            ¡Hola, {firstName}! 👋
          </h1>
          <p className="text-lg md:text-xl text-stone-500 max-w-2xl font-light leading-relaxed">
            Bienvenida/o a tu espacio de gestión. Cada jornada es una nueva oportunidad
            para transformar vidas a través de la estética.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 -mt-10 pb-24 space-y-16">

        {/* ── Bento Stats ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Tarjeta 1 — Próxima jornada */}
          <div className="group relative bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(212,175,55,0.1)] p-8 flex flex-col gap-5 hover:-translate-y-2 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase">Tu próxima jornada</span>
              <div className="rounded-2xl bg-[#FCFAF5] border border-[#F3EBE1] p-3 shadow-inner">
                <CalendarDays className="h-5 w-5 text-[#B89B72]" />
              </div>
            </div>
            {nextRental ? (
              <div className="space-y-1">
                <p className="font-serif text-3xl font-bold text-stone-900 leading-tight">
                  {format(parseISO(nextRental.start_date), "d 'de' MMMM", { locale: es })}
                </p>
                <p className="text-sm font-medium text-stone-500 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#B89B72] animate-pulse" />
                  En {differenceInDays(parseISO(nextRental.start_date), today)} días
                </p>
              </div>
            ) : (
              <p className="font-serif text-xl font-medium text-stone-300 italic">Sin reservas futuras</p>
            )}
            <div className="mt-auto pt-5 border-t border-[#F3EBE1]/50">
              <Link href="/alquiler" className="group/link text-xs font-bold tracking-widest text-[#B89B72] flex items-center gap-2 uppercase transition-all duration-300">
                <span className="group-hover/link:mr-1 transition-all">Agendar nueva</span>
                <span className="text-lg">→</span>
              </Link>
            </div>
          </div>

          {/* Tarjeta 2 — Resumen del mes */}
          <div className="group relative bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(212,175,55,0.1)] p-8 flex flex-col gap-5 hover:-translate-y-2 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase">Resumen del mes</span>
              <div className="rounded-2xl bg-[#FCFAF5] border border-[#F3EBE1] p-3 shadow-inner">
                <LayoutGrid className="h-5 w-5 text-[#B89B72]" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="font-serif text-6xl font-bold text-stone-900 leading-none tracking-tighter">
                {monthRentals.length}
              </p>
              <p className="text-sm font-semibold text-stone-400 uppercase tracking-widest pl-1">
                {monthRentals.length === 1 ? "reserva activa" : "reservas activas"}
              </p>
            </div>
            <div className="mt-auto pt-5 border-t border-[#F3EBE1]/50">
              <div className="flex items-center gap-2 text-[10px] font-bold text-[#B89B72] uppercase tracking-[0.15em]">
                <Sparkles className="h-3 w-3" />
                <span>Nivel: Profesional VIP</span>
              </div>
            </div>
          </div>

          {/* Tarjeta 3 — Soporte VIP */}
          <div className="group relative bg-stone-900 rounded-[2.5rem] shadow-2xl shadow-stone-900/20 p-8 flex flex-col gap-5 hover:-translate-y-2 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden">
            {/* Glossy overlay */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -mr-16 -mt-16 blur-2xl" />
            
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-[0.2em] text-stone-500 uppercase">Asistencia Directa</span>
              <div className="rounded-2xl bg-white/10 border border-white/10 p-3">
                <MessageCircleHeart className="h-5 w-5 text-[#D4AF37]" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-serif text-2xl font-bold text-white leading-tight">
                Asistencia Directa
              </p>
              <p className="text-sm font-light text-stone-400 leading-relaxed">
                Estamos con vos en cada jornada. Contactanos por WhatsApp ante cualquier duda técnica o comercial con el equipo.
              </p>
            </div>
            <div className="mt-auto">
              <Link
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glint inline-flex items-center justify-center gap-3 w-full rounded-2xl bg-[#D4AF37] hover:bg-[#B89B72] text-stone-900 text-xs font-bold uppercase tracking-widest py-4 transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-xl shadow-[#D4AF37]/20"
              >
                Contactar Ahora
              </Link>
            </div>
          </div>
        </div>

        {/* ── Mis Reservas ────────────────────────────────────────────────── */}
        <section className="reveal-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-end justify-between mb-8 px-2">
            <div>
              <h2 className="font-serif text-4xl font-bold text-stone-900 tracking-tight">Mis Reservas</h2>
              <div className="h-1 w-12 bg-[#D4AF37] mt-2 rounded-full" />
            </div>
            <Link
              href="/alquiler"
              className="inline-flex items-center gap-2.5 rounded-full bg-white border border-[#EAE3D5] text-[#B89B72] hover:bg-[#FCFAF5] text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-3 transition-all duration-300 hover:shadow-lg active:scale-95"
            >
              <CalendarDays className="h-4 w-4" />
              Nueva Reserva
            </Link>
          </div>

          {allRentals.length > 0 ? (
            <div className="bg-white/50 backdrop-blur-md rounded-[2.5rem] shadow-[0_8px_40px_rgba(0,0,0,0.03)] border border-white overflow-hidden transition-all duration-500">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#FCFAF5]/50 text-stone-400 font-bold border-b border-[#F3EBE1] uppercase tracking-[0.2em] text-[9px]">
                  <tr>
                    <th className="px-8 py-6">Equipo</th>
                    <th className="px-8 py-6">Período de Alquiler</th>
                    <th className="px-8 py-6">Estado del Servicio</th>
                    <th className="px-8 py-6 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3EBE1]/50">
                  {allRentals.map(
                    (r: {
                      id: string;
                      title: string;
                      start_date: string;
                      end_date: string;
                    }) => {
                      const isPast = !isFuture(parseISO(r.end_date));
                      return (
                        <tr
                          key={r.id}
                          className="hover:bg-white/80 transition-all duration-300 group"
                        >
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-5">
                              <div className="relative h-16 w-16 rounded-2xl border border-[#EAE3D5] overflow-hidden bg-white shadow-sm shrink-0 group-hover:scale-105 transition-transform duration-500">
                                <Image
                                  src={ADSS_IMAGE}
                                  alt="ADSS FG2000B"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-serif font-bold text-xl text-stone-900 leading-none mb-1.5">ADSS FG2000B</p>
                                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#B89B72]">Trío Láser · Premium</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-stone-600 font-medium whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className="text-stone-900 font-bold tracking-tight">
                                {format(parseISO(r.start_date), "dd 'de' MMM", { locale: es })}
                              </span>
                              <span className="text-[11px] text-stone-400 font-medium">
                                Hasta el {format(parseISO(r.end_date), "dd 'de' MMM", { locale: es })}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            {isPast ? (
                              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[9px] uppercase tracking-[0.15em] font-bold bg-stone-100 text-stone-400 border border-stone-200">
                                Completada
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] uppercase tracking-[0.15em] font-bold bg-[#FCFAF5] text-[#B89B72] border border-[#EAE3D5] shadow-sm">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#B89B72] animate-pulse" />
                                Confirmada
                              </span>
                            )}
                          </td>
                          <td className="px-8 py-6 text-right">
                            {!isPast ? (
                              <div className="opacity-60 hover:opacity-100 transition-opacity">
                                <CancelButton rentalId={r.id} startDate={r.start_date} />
                              </div>
                            ) : (
                              <span className="text-[10px] text-stone-300 font-bold tracking-widest uppercase">— Concluído —</span>
                            )}
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-6 py-24 bg-white/40 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-[#EAE3D5] text-center shadow-inner">
              <div className="rounded-3xl bg-white p-6 shadow-xl shadow-stone-200/50">
                <CalendarDays className="h-10 w-10 text-[#B89B72]/40" />
              </div>
              <div className="max-w-xs">
                <p className="font-serif text-2xl font-bold text-stone-800">Comienza tu jornada</p>
                <p className="text-sm font-medium text-stone-400 mt-2 leading-relaxed">Reserva el equipamiento premium para tu centro de estética hoy mismo.</p>
              </div>
              <Link
                href="/alquiler"
                className="btn-glint mt-4 inline-flex items-center gap-3 rounded-2xl bg-stone-900 text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em] px-8 py-4 transition-all duration-300 hover:scale-[1.05] hover:shadow-2xl active:scale-95"
              >
                <CalendarDays className="h-4 w-4" />
                Agendar Mi Primera Jornada
              </Link>
            </div>
          )}
        </section>

        {/* ── Recursos para tu Centro ─────────────────────────────────────── */}
        <section className="reveal-up" style={{ animationDelay: '0.4s' }}>
          <div className="mb-10 px-2">
            <h2 className="font-serif text-4xl font-bold text-stone-900 tracking-tight">
              Recursos para tu Centro
            </h2>
            <div className="h-1 w-12 bg-[#D4AF37] mt-2 rounded-full" />
            <p className="text-sm font-medium text-stone-400 mt-4 leading-relaxed max-w-sm">
              Material exclusivo de marketing y legal diseñado para elevar el estándar de tu servicio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {RESOURCES.map((res) => {
              const Icon = res.icon;
              return (
                <Link
                  key={res.label}
                  href={res.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative flex flex-col gap-6 rounded-[2.5rem] border bg-gradient-to-br ${res.color} ${res.border} shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_25px_60px_rgba(212,175,55,0.15)] p-9 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-2`}
                >
                  <div className={`inline-flex w-fit rounded-2xl bg-white border border-[#EAE3D5] p-4 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <Icon className={`h-6 w-6 ${res.iconColor}`} />
                  </div>
                  <div className="space-y-2">
                    <p className="font-serif font-bold text-stone-900 text-2xl tracking-tight leading-none">{res.label}</p>
                    <p className="text-xs font-medium text-stone-400 leading-relaxed pr-4">{res.desc}</p>
                  </div>
                  <span className={`mt-auto pt-4 text-[10px] font-bold uppercase tracking-[0.2em] ${res.iconColor} group-hover:text-stone-900 transition-colors flex items-center gap-2`}>
                    Acceder ahora <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>


      </div>
    </div>
  );
}

