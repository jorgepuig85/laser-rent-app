import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import { format, parseISO, isFuture } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Share2,
  FileText,
  ScrollText,
  Sparkles,
} from "lucide-react";

import { CancelButton } from "./CancelButton";
import { DepositButton } from "./DepositButton";
import { ReservationClient } from "./ReservationClient";

const ADSS_IMAGE =
  "https://pbvxslvihypfblbfyqle.supabase.co/storage/v1/object/public/equipos_imagenes/equipo_depilacion.webp";

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

  // Admin Check: Admins go straight to admin panel.
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (profile?.is_admin) {
    return redirect("/admin");
  }

  const { data: pro } = await supabase
    .from("external_professionals")
    .select("id, name")
    .eq("auth_id", user.id)
    .single();

  if (!pro) return redirect("/completar-perfil");

  // Mis reservas
  const { data: rentals } = await supabase
    .from("rentals")
    .select("id, title, start_date, end_date, status, receipt_url, deposit_amount, cost")
    .eq("external_professional_id", pro.id)
    .order("start_date", { ascending: true });

  const allRentals = rentals ?? [];

  // Datos para calendario
  const { data: blockedDatesData } = await supabase.rpc("get_all_booked_dates");
  const blockedDates = blockedDatesData ?? [];

  // Obtener tarifa diaria
  const { data: priceData } = await supabase
    .from("rental_prices")
    .select("daily_rate")
    .eq("equipment_name", "ADSS FG2000B")
    .single();

  const dailyRate = priceData?.daily_rate || 0;

  const firstName = pro.name?.split(" ")[0] ?? "Profesional";

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800">
      {/* ── Hero Header ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-b from-white to-[#FDFBF7] pt-28 pb-16 px-4 border-b border-[#EAE3D5]/50">
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#D4AF37]/5 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 -left-16 h-64 w-64 rounded-full bg-[#D4AF37]/5 blur-[80px]" />

        <div className="mx-auto max-w-5xl relative z-10 flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-semibold tracking-widest text-[#B89B72] uppercase shadow-sm border border-[#EAE3D5]">
              <Sparkles className="h-3.5 w-3.5" />
              Panel VIP
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl lg:text-5xl font-bold text-stone-900 leading-tight mb-4 tracking-tight max-w-4xl max-w-[800px] leading-[1.2]">
            ¡Hola, {firstName}! Qué bueno verte. Aquí puedes gestionar tus jornadas de depilación. 👋
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-24 space-y-16 -mt-8">

        {/* ── Calendario de Reservas (ReservationClient) ──────────────────── */}
        <section className="reveal-up relative z-20" style={{ animationDelay: '0.1s' }}>
          <div className="grid md:grid-cols-[1fr_400px] gap-8 items-start">
            <ReservationClient
              professionalId={pro.id}
              professionalName={pro.name}
              existingRentals={blockedDates}
              dailyRate={dailyRate}
            />
            <div className="hidden md:block relative h-[600px] w-full rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 bg-slate-50 sticky top-24">
               <Image
                src={ADSS_IMAGE}
                alt="ADSS FG2000B"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent flex items-end p-8">
                <div className="text-white">
                  <h3 className="font-serif text-2xl font-bold">ADSS FG2000B</h3>
                  <p className="text-white/80 text-sm">Plataforma Trío Láser</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Mis Próximas Jornadas ───────────────────────────────────────── */}
        <section className="reveal-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-end justify-between mb-8 px-2">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">Mis Próximas Jornadas</h2>
              <div className="h-1 w-12 bg-[#D4AF37] mt-2 rounded-full" />
            </div>
          </div>

          {allRentals.length > 0 ? (
            <div className="bg-white/50 backdrop-blur-md rounded-[2.5rem] shadow-[0_8px_40px_rgba(0,0,0,0.03)] border border-white overflow-hidden transition-all duration-500">
              {/* --- Desktop View --- */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-[#FCFAF5]/50 text-stone-400 font-bold border-b border-[#F3EBE1] uppercase tracking-[0.2em] text-[9px]">
                  <tr>
                    <th className="px-8 py-6">Equipo</th>
                    <th className="px-8 py-6">Período de Alquiler</th>
                    <th className="px-8 py-6">Estado</th>
                    <th className="px-8 py-6">Seña</th>
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
                      status: string;
                      receipt_url: string | null;
                      deposit_amount: number | null;
                      cost: number | null;
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
                              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[9px] uppercase tracking-[0.15em] font-bold bg-stone-100 text-stone-400 border border-stone-200">
                                Completada
                              </span>
                            ) : r.status === 'pendiente' ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] uppercase tracking-[0.15em] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                                Pendiente
                              </span>
                            ) : r.status === 'reservado' ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] uppercase tracking-[0.15em] font-bold bg-[#FCFAF5] text-[#B89B72] border border-[#EAE3D5]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#B89B72]" />
                                Confirmada
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[9px] uppercase tracking-[0.15em] font-bold bg-stone-100 text-stone-400 border border-stone-200">
                                {r.status}
                              </span>
                            )}
                          </td>
                          {/* Seña column */}
                          <td className="px-8 py-6">
                            {!isPast && r.status === 'pendiente' && !r.receipt_url ? (
                              <DepositButton
                                rentalId={r.id}
                                depositAmount={r.deposit_amount}
                                startDate={format(parseISO(r.start_date), "d 'de' MMM", { locale: es })}
                              />
                            ) : r.receipt_url ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                ✓ Enviado
                              </span>
                            ) : (
                              <span className="text-[10px] text-stone-300">—</span>
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

              {/* --- Mobile View --- */}
              <div className="md:hidden flex flex-col divide-y divide-[#F3EBE1]/50">
                {allRentals.map((r: { id: string; title: string; start_date: string; end_date: string; status: string; receipt_url: string | null; deposit_amount: number | null; cost: number | null; }) => {
                  const isPast = !isFuture(parseISO(r.end_date));
                  return (
                    <div key={r.id} className="p-6 flex flex-col gap-4 hover:bg-white/80 transition-all duration-300">
                      {/* Header row: Image, Title, Status */}
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex gap-4 items-center">
                          <div className="relative h-12 w-12 rounded-xl border border-[#EAE3D5] overflow-hidden bg-white shadow-sm shrink-0">
                            <Image src={ADSS_IMAGE} alt="ADSS FG2000B" fill className="object-cover" />
                          </div>
                          <div>
                            <p className="font-serif font-bold text-base text-stone-900 leading-none mb-1">ADSS FG2000B</p>
                            <p className="text-[8px] font-bold tracking-[0.2em] uppercase text-[#B89B72]">Trío Láser · Premium</p>
                          </div>
                        </div>
                        {/* Status Badge */}
                        <div className="shrink-0 text-right">
                          {isPast ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-[8px] uppercase tracking-[0.1em] font-bold bg-stone-100 text-stone-400 border border-stone-200">
                                Completada
                              </span>
                            ) : r.status === 'pendiente' ? (
                              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[8px] uppercase tracking-[0.1em] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                <span className="h-1 w-1 rounded-full bg-amber-500 animate-pulse" />
                                Pendiente
                              </span>
                            ) : r.status === 'reservado' ? (
                              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[8px] uppercase tracking-[0.1em] font-bold bg-[#FCFAF5] text-[#B89B72] border border-[#EAE3D5]">
                                <span className="h-1 w-1 rounded-full bg-[#B89B72]" />
                                Confirmada
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-[8px] uppercase tracking-[0.1em] font-bold bg-stone-100 text-stone-400 border border-stone-200">
                                {r.status}
                              </span>
                          )}
                        </div>
                      </div>

                      {/* Date & Deposit Action Row */}
                      <div className="bg-[#FCFAF5] rounded-2xl p-4 border border-[#EAE3D5] flex items-center justify-between gap-2 shadow-inner">
                        <div className="flex flex-col">
                          <span className="text-stone-900 font-bold tracking-tight text-sm">
                            {format(parseISO(r.start_date), "d MMM", { locale: es })}
                          </span>
                          <span className="text-[10px] text-stone-500 font-medium">
                            hasta el {format(parseISO(r.end_date), "d MMM", { locale: es })}
                          </span>
                        </div>
                        <div className="shrink-0">
                          {(!isPast && r.status === 'pendiente' && !r.receipt_url) ? (
                            <DepositButton
                              rentalId={r.id}
                              depositAmount={r.deposit_amount}
                              startDate={format(parseISO(r.start_date), "d 'de' MMM", { locale: es })}
                            />
                          ) : r.receipt_url ? (
                            <span className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-[9px] uppercase tracking-widest font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              ✓ Enviado
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {/* Cancel Action */}
                      {!isPast && (
                        <div className="flex justify-end mt-1">
                          <div className="opacity-80 active:opacity-100">
                            <CancelButton rentalId={r.id} startDate={r.start_date} />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-6 py-24 bg-white/40 backdrop-blur-sm rounded-[3rem] border border-dashed border-[#EAE3D5] text-center shadow-inner">
              <div className="rounded-3xl bg-white p-6 shadow-xl shadow-stone-200/50">
                <CalendarDays className="h-10 w-10 text-[#B89B72]/40" />
              </div>
              <div className="max-w-xs">
                <p className="font-serif text-2xl font-bold text-stone-800">No hay alquileres registrados</p>
                <p className="text-sm font-medium text-stone-400 mt-2 leading-relaxed">Las jornadas que solicites aparecerán aquí mismo.</p>
              </div>
            </div>
          )}
        </section>

        {/* ── Recursos para tu Centro ─────────────────────────────────────── */}
        <section className="reveal-up" style={{ animationDelay: '0.4s' }}>
          <div className="mb-10 px-2">
            <h2 className="font-serif text-3xl font-bold text-stone-900 tracking-tight">
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
                    <p className="font-serif font-bold text-stone-900 text-xl tracking-tight leading-none">{res.label}</p>
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
