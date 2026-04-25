import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Shield, Zap, TrendingUp, Truck, ShieldCheck, GraduationCap } from "lucide-react";
import { SeasonalHeroEffects } from "@/components/SeasonalHeroEffects";
import { COSTO_ALQUILER_DIARIO, PRECIO_SESION_ESTIMADO, formatCurrency } from "@/lib/constants";

const HERO_IMAGE = "https://aftweonqhxvbcujexyre.supabase.co/storage/v1/object/public/equipos_imagenes/hero-profesional.webp";
const BENEFITS_IMAGE = "https://aftweonqhxvbcujexyre.supabase.co/storage/v1/object/public/equipos_imagenes/beneficios-tech.webp";
const CTA_IMAGE = "https://aftweonqhxvbcujexyre.supabase.co/storage/v1/object/public/equipos_imagenes/clinica-interior.webp";

import { createClient } from "@/lib/supabaseServer";
import { AutoLoginTrigger } from "@/components/AutoLoginTrigger";
import { Suspense } from "react";
import { Calendar } from "lucide-react";

const getUrgencyText = () => {
  const date = new Date();
  const day = date.getDate();
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const currentMonth = months[date.getMonth()];
  const nextMonth = months[(date.getMonth() + 1) % 12];

  if (day <= 20) {
    return `📅 Agenda de ${currentMonth} casi completa`;
  } else {
    return `📅 Cupos limitados para ${nextMonth} - ¡Reserva tu lugar!`;
  }
};

const getWhatsAppUrl = () => {
  const date = new Date();
  const day = date.getDate();
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const currentMonth = months[date.getMonth()];
  const nextMonth = months[(date.getMonth() + 1) % 12];
  const targetMonth = day <= 20 ? currentMonth : nextMonth;
  const msg = `¡Hola! Quiero consultar disponibilidad para alquilar un equipo en ${targetMonth}. ¿Tienen fechas libres?`;
  return `https://wa.me/5492954631456?text=${encodeURIComponent(msg)}`;
};

export const revalidate = 60; // Actualizar zonas de cobertura y data dinámica
export default async function Home() {
  const supabase = await createClient();
  await supabase.auth.getSession();

  // Fetch dynamic rental price from DB
  const { data: tarifaData } = await supabase
    .from('rental_prices')
    .select('daily_rate')
    .limit(1)
    .single();
  
  const dailyRateDB = tarifaData?.daily_rate || COSTO_ALQUILER_DIARIO;
  const sesionesNecesarias = Math.ceil(dailyRateDB / PRECIO_SESION_ESTIMADO);

  const { data: locations } = await supabase
    .from('locations')
    .select('name')
    .eq('is_active', true)
    .order('name');
  
  const activeLocations = locations || [];

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <Suspense fallback={null}>
        <AutoLoginTrigger />
      </Suspense>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 md:pt-24 lg:pt-32 min-h-[85vh] flex items-center">
        <SeasonalHeroEffects />
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6 relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="flex flex-col justify-center space-y-8 reveal-up">
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                  Equipos de Última Generación
                </div>
                <h1 className="text-5xl font-serif font-black tracking-tighter sm:text-7xl xl:text-8xl text-foreground !leading-[1.1]">
                  Multiplicá los ingresos de tu centro sin invertir en equipos
                </h1>
                <p className="max-w-[600px] text-xl text-slate-500 leading-relaxed tracking-wide font-medium">
                  Alquilá tecnología Soprano Ice en La Pampa. Recuperá el costo del alquiler en tus primeras 5 a 10 sesiones.
                </p>
              </div>
              <div className="flex flex-col gap-8 items-center sm:items-start">
                <div className="flex flex-col gap-3 items-center sm:items-start">
                  <Button 
                    size="lg" 
                    className="h-16 px-14 text-xl shadow-2xl transition-all hover:scale-105 btn-glint rounded-full bg-[#8F754F] text-white font-bold border-none" 
                    render={<Link href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" />}
                  >
                    Ver disponibilidad para esta semana <Calendar className="ml-3 h-6 w-6" />
                  </Button>
                  <p className="text-xs font-semibold text-slate-500 mt-[-4px]">✅ Respondemos en menos de 10 minutos</p>
                  <span className="text-sm font-bold text-[#8F754F] bg-[#8F754F]/10 px-4 py-2 rounded-full animate-pulse border border-[#8F754F]/20" suppressHydrationWarning>
                    {getUrgencyText()}
                  </span>
                </div>


                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                  <Link href="/equipos" className="group flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors px-4 py-2">
                    Ver Equipos
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <div className="h-4 w-[1px] bg-slate-200 hidden sm:block"></div>
                  <Link href="/precios" className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors px-4 py-2">
                    Consultar Planes
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-1000 delay-150">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent z-10 rounded-2xl mix-blend-overlay"></div>
              {/* Image Placeholder */}
              <Image
                src={HERO_IMAGE}
                alt="Máquina de depilación láser profesional"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Brand Authority Trust Bar */}
      <section className="bg-slate-50 border-y border-slate-100 py-12">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="flex items-start gap-4 p-2">
              <div className="bg-primary/10 p-3 rounded-2xl text-primary shrink-0 text-2xl">
                🚚
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900">Logística propia</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Entrega y retiro en tu puerta.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-2">
              <div className="bg-primary/10 p-3 rounded-2xl text-primary shrink-0 text-2xl">
                🛠️
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900">Soporte Real</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Asistencia técnica en el día en toda La Pampa.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-2">
              <div className="bg-primary/10 p-3 rounded-2xl text-primary shrink-0 text-2xl">
                📈
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900">Rentabilidad</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Equipos listos para facturar desde el minuto 1.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profitability Section */}
      <section className="py-24 bg-primary/5">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <div className="text-center space-y-4 mb-16 reveal-up">
            <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-slate-900">Tu Negocio, Más Rentable</h2>
            <p className="text-slate-600 text-lg max-w-[800px] mx-auto">
              Con solo {sesionesNecesarias} clientas por jornada, cubres el costo del alquiler ({formatCurrency(dailyRateDB)}). ¡Todo lo demás es ganancia pura para tu centro!
            </p>
            <div className="inline-block bg-orange-100 text-orange-800 px-4 py-1.5 rounded-full font-bold text-sm border border-orange-200 mt-4 animate-pulse shadow-sm">
              🔥 Quedan pocas fechas disponibles para toda la zona. ¡No te quedes sin tu reserva!
            </div>
          </div>
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-primary/10 text-center">
            <div className="text-2xl md:text-4xl font-black text-slate-800 mb-6 font-serif">
              {sesionesNecesarias} sesiones x {formatCurrency(PRECIO_SESION_ESTIMADO)} = <span className="text-green-600">{formatCurrency(sesionesNecesarias * PRECIO_SESION_ESTIMADO)}</span>
            </div>
            <div className="inline-block bg-green-100 text-green-800 px-6 py-3 rounded-full font-bold text-lg">
              ¡Con media jornada ya pagaste el equipo!
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <div className="text-center space-y-4 mb-16 reveal-up">
            <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-slate-900">Cómo Funciona</h2>
            <p className="text-slate-500 text-lg">Un proceso simple para que te enfoques en tus pacientes.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { title: "Consultás", desc: "Elegís tu fecha por WhatsApp." },
              { title: "Coordinamos", desc: "Confirmamos la logística en tu zona." },
              { title: "Recibís", desc: "Llevamos el equipo listo para usar." },
              { title: "Facturás", desc: "Empezás a generar ingresos desde el primer minuto." }
            ].map((step, i) => (
              <div key={i} className="text-center space-y-4 relative">
                {i < 3 && <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-primary/20 border-t-2 border-dashed border-primary/30"></div>}
                <div className="w-16 h-16 mx-auto bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold relative z-10 shadow-lg">
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                <p className="text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <div className="text-center space-y-4 mb-20 reveal-up">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-slate-900">¿Por qué elegir Centro de Belleza?</h2>
            <p className="text-slate-500 text-lg max-w-[700px] mx-auto tracking-wide">
              Maximizamos tu rentabilidad eliminando los costos operativos de mantenimiento y reparaciones con tecnología certificada.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2 relative h-[400px] w-full rounded-2xl overflow-hidden shadow-xl order-2 lg:order-1">
              <Image 
                src={BENEFITS_IMAGE}
                alt="Tecnología láser avanzada"
                fill
                className="object-cover"
              />
            </div>
            <div className="lg:w-1/2 grid gap-6 sm:grid-cols-2 order-1 lg:order-2">
              {[
                {
                  icon: Zap,
                  title: "Eficaz en todos los tipos de piel",
                  desc: "Más clientas posibles. Tratamiento sin dolor (Máximo confort para tus pacientes)."
                },
                {
                  icon: Shield,
                  title: "Soporte Técnico",
                  desc: "Asistencia rápida y mantenimiento preventivo incluido en todos nuestros planes."
                },
                {
                  icon: TrendingUp,
                  title: "Alta Rentabilidad",
                  desc: "Comienza a generar ingresos desde el primer día sin descapitalizarte."
                },
                {
                  icon: CheckCircle2,
                  title: "Capacitación Incluida",
                  desc: "Te enseñamos a usar el equipo para asegurar los mejores resultados en tus pacientes."
                }
              ].map((benefit, i) => (
                <div key={i} className="group relative overflow-hidden rounded-3xl bg-slate-50 p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                    <benefit.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-slate-900">{benefit.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Zona de Cobertura Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6 text-center">
          <div className="space-y-4 mb-12 reveal-up">
            <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-slate-900">Nuestra Cobertura en La Pampa y Oeste de Buenos Aires</h2>
            <p className="text-slate-500 text-lg max-w-[700px] mx-auto tracking-wide">
              Llegamos a tu centro con logística propia, garantizando puntualidad y seguridad en la entrega.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {activeLocations.map((loc: { name: string }, i: number) => (
              <span key={i} className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-full text-sm font-bold shadow-sm hover:shadow-md transition-shadow hover:border-primary/50 cursor-default">
                {loc.name}
              </span>
            ))}
          </div>
          <div className="bg-primary/5 rounded-2xl p-8 max-w-3xl mx-auto border border-primary/10 space-y-6">
            <h3 className="text-xl font-bold text-slate-900">¿No ves tu localidad?</h3>
            <p className="text-slate-600 font-medium">Consultanos, ampliamos nuestra logística constantemente para llegar a vos.</p>
            <Button 
              className="rounded-full font-bold px-8 text-md h-12" 
              render={<Link href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" />}
            >
              Consultar por mi ciudad
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 md:py-40 relative overflow-hidden text-white">
        <Image 
          src={CTA_IMAGE}
          alt="Interior de clínica estética"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/70 backdrop-blur-[1px]"></div>
        <div className="mx-auto w-full max-w-4xl px-4 md:px-6 relative text-center space-y-10 animate-in fade-in zoom-in duration-700">
          <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tight leading-tight">Lleva tu centro de estética al siguiente nivel</h2>
          <p className="text-xl text-white/90 font-medium">
            Reserva tu equipo hoy y comienza a ofrecer tratamientos de depilación definitiva de alta eficacia en Santa Rosa y toda La Pampa.
          </p>
          <div className="flex flex-col gap-3 items-center justify-center">
            <Button size="lg" className="h-16 px-10 text-lg rounded-full shadow-2xl bg-[#8F754F] text-white hover:bg-[#8F754F]/90 hover:scale-105 transition-all btn-glint border-none font-bold" render={<Link href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" />}>
              Quiero empezar a facturar
            </Button>
            <p className="text-sm font-semibold text-white/80 mt-[-4px]">✅ Respondemos en menos de 10 minutos</p>
            <span className="text-sm font-bold text-white bg-black/40 px-4 py-2 rounded-full border border-white/20" suppressHydrationWarning>
              {getUrgencyText()}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
